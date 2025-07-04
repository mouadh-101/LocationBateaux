import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthModalService } from 'src/app/services/auth-modal.service';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleAuthService } from 'src/app/services/google-auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  isLoginMode = true;
  loginForm: FormGroup;
  registerForm: FormGroup;
  isOpen = false;


  constructor(private fb: FormBuilder, private authService: AuthService, private authModalService: AuthModalService, private router: Router, private alertService: AlertService,private googleService: GoogleAuthService) { // Replace 'any' with the actual type of your Google service if available

    this.authModalService.modalState$.subscribe(open => {
      this.isOpen = open;
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      
    });


    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$')]],
      password: ['', [Validators.required]],
      role: ['CLIENT', [Validators.required]],
    });
  }


  close() {
    this.authModalService.close();
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.status === 'SUCCESS') {
            this.alertService.showAlert(response.message, 'success');
            setTimeout(() => {
              this.router.navigate(['/boats']);
              this.close();
            }, 1000);
          }
          else if (response.status === 'BANNED') {
            this.alertService.showAlert(response.message, 'banned');
          }
          else {
            this.alertService.showAlert(response.message, 'error');
          }
        },
        error: (error) => {
          this.alertService.showAlert('error.message', 'error');
        }
      });
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.alertService.showAlert(response.message, 'success');
          setTimeout(() => {
            this.router.navigate(['/boats']);
            this.close();
          }, 1000);
        },
        error: (error) => {
          this.alertService.showAlert(error.message, 'error');
        }
      });
    }
  }
  isTouchedAndDirtyWithError(form: FormGroup, controlName: string, error: string): boolean {
    const control = form.get(controlName);
    return !!(control && control.touched && control.dirty && control.hasError(error));
  }

}



