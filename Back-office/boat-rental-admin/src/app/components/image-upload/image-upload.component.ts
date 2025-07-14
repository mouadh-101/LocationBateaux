import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Image } from 'src/app/interfaces/boats';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {
  @Output() imageUploaded = new EventEmitter<Image>();
  images: Image[] = [];

  constructor(private http: HttpClient) {}

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

  removeImage(img:Image) {
    this.http.delete(`http://localhost:8081/api/image/${img.imageId}`)
      .subscribe(() => {
        this.images = this.images.filter(i => i.imageId !== img.imageId);
      });
  }

}
