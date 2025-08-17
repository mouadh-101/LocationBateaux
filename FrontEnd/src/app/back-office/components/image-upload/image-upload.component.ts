import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Image } from 'src/app/interfaces/boat';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {
  @Input() set initialImages(value: Image[]) {
    this.images = [...value]; // Cloner pour éviter les effets de bord
  }

  @Output() imageUploaded = new EventEmitter<Image>();
  @Output() imageRemoved = new EventEmitter<Image>();

  images: Image[] = [];


  constructor(private http: HttpClient) { }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.http.post<Image>('http://localhost:8081/api/image/upload/image', formData)
      .subscribe(res => {
        this.images.push(res);
        this.imageUploaded.emit(res);
      });
  }

  removeImage(img: Image) {
    this.http.delete(`http://localhost:8081/api/image/${img.imageId}`)
      .subscribe({
        next: () => {
          this.images = this.images.filter(i => i.imageId !== img.imageId);
          this.imageRemoved.emit(img);  // <-- émettre la suppression vers le parent
          console.log(`Image with id ${img.imageId} removed.`);
        },
        error: (err) => {
          console.error('Failed to delete image:', err);
        }
      });
  }
  getImages(): Image[] {
    return [...this.images]; // On renvoie une copie pour éviter les effets de bord
  }


}
