import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

    setTimeout(() => {
      this.loading = false;
      this.close();
      this.alertService.showAlert('Your message has been sent successfully!', 'success');
      this.contactForm.reset();
    }, 1000);
  }
  isTouchedAndDirtyWithError(form: FormGroup, controlName: string, error: string): boolean {
    const control = form.get(controlName);
    return !!control && !!control.touched && !!control.dirty && !!control.hasError(error);
  }

}
