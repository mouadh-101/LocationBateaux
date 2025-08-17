import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { s } from '@fullcalendar/core/internal-common';
import { AlertService } from 'src/app/services/alert.service';
import { ContactUsService } from 'src/app/services/contact-us.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  visible = false;
  loading = false;
  contactForm: FormGroup;

  constructor(private fb: FormBuilder,
    private alertService: AlertService,
    private contactUsService: ContactUsService) {
    this.contactUsService.modalState$.subscribe(open => {
      this.visible = open;
    });  
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  open() {
    this.visible = true;
  }

  close() {
    this.visible = false;
    this.contactForm.reset();
  }

  submit() {
    if (this.contactForm.invalid) return;

    this.loading = true;
    this.contactUsService.sendMessage(this.contactForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.alertService.showAlert('Votre message a été envoyé avec succès.',"success");
        this.contactForm.reset();
        this.close();

      },
      error: (error) => {
        this.alertService.showAlert('Une erreur est survenue lors de l\'envoi de votre message.',"error");
        console.error('Error sending message:', error);
        this.loading = false;
      },
    });
  }
  isTouchedAndDirtyWithError(form: FormGroup, controlName: string, error: string): boolean {
    const control = form.get(controlName);
    return !!control && !!control.touched && !!control.dirty && !!control.hasError(error);
  }

}
