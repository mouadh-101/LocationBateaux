import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthModalService } from 'src/app/services/auth-modal.service';
import { AuthService } from 'src/app/services/auth.service';

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


  constructor(private fb: FormBuilder, private authService: AuthService, private authModalService: AuthModalService, private router: Router, private alertService: AlertService) {

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
            setTimeout(() => {
              this.router.navigate(['/boats']);
              this.close();
            }, 1000);
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
          this.toggleMode();
        },
        error: (error) => {
          this.alertService.showAlert(error.message, 'error');
        }
      });
    }
  }
}



