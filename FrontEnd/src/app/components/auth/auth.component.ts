import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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
  showPassword = false;
  user: SocialUser | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private authModalService: AuthModalService,
    private router: Router,
    private alertService: AlertService,
    private socialAuthService: SocialAuthService,
    private http: HttpClient
  ) {
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
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)]],
      role: ['CLIENT', [Validators.required]],
    });
  }

  ngOnInit() {

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
              this.close();
              this.loginForm.reset();
            }, 1000);
          } else if (response.status === 'BANNED') {
            this.alertService.showAlert(response.message, 'banned');
          } else {
            this.alertService.showAlert(response.message, 'error');
          }
        },
        error: (error) => {
          this.alertService.showAlert(error.message || 'An error occurred during login.', 'error');
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
            this.close();
            this.registerForm.reset();
          }, 1000);
        },
        error: (error) => {
          this.alertService.showAlert(error.message || 'An error occurred during registration.', 'error');
        }
      });
    }
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user: SocialUser) => {
      const accessToken = user.idToken;
      this.handleSocialLogin(accessToken, (token) => this.authService.loginWithGoogleToken(token));
    });
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user: SocialUser) => {
      const accessToken = user.authToken;
      this.handleSocialLogin(accessToken, (token) => this.authService.loginWithFacebookToken(token));
    });
  }

  private handleSocialLogin(token: string, loginMethod: (token: string) => Observable<any>): void {
    loginMethod(token).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS') {
          this.alertService.showAlert(response.message, 'success');
          setTimeout(() => {
            this.close();
            this.router.navigate(['/dashboard']);
          }, 1000);
        } else if (response.status === 'BANNED') {
          this.alertService.showAlert(response.message, 'banned');
        } else {
          this.alertService.showAlert(response.message, 'error');
        }
      },
      error: (err) => {
        this.alertService.showAlert(err.message || 'An error occurred during social login.', 'error');
      }
    });
  }

  isTouchedAndDirtyWithError(form: FormGroup, controlName: string, error: string): boolean {
    const control = form.get(controlName);
    return !!(control && control.touched && control.dirty && control.hasError(error));
  }

  getPasswordStrength(): number {
    const password = this.registerForm.get('password')?.value || '';
    let strength = 0;

    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    return strength;
  }

  getPasswordStrengthPercentage(): number {
    return this.getPasswordStrength();
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    if (strength < 40) return 'bg-red-500';
    if (strength < 60) return 'bg-yellow-500';
    if (strength < 80) return 'bg-blue-500';
    return 'bg-green-500';
  }

  getPasswordStrengthTextClass(): string {
    const strength = this.getPasswordStrength();
    if (strength < 40) return 'text-red-600';
    if (strength < 60) return 'text-yellow-600';
    if (strength < 80) return 'text-blue-600';
    return 'text-green-600';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength < 40) return 'Faible';
    if (strength < 60) return 'Moyen';
    if (strength < 80) return 'Bon';
    return 'Excellent';
  }

  getPasswordCriteria(): { text: string; valid: boolean }[] {
    const password = this.registerForm.get('password')?.value || '';
    return [
      {
        text: '✓ Au moins 8 caractères',
        valid: password.length >= 8
      },
      {
        text: '✓ Une lettre majuscule',
        valid: /[A-Z]/.test(password)
      },
      {
        text: '✓ Une lettre minuscule',
        valid: /[a-z]/.test(password)
      },
      {
        text: '✓ Un chiffre',
        valid: /[0-9]/.test(password)
      },
      {
        text: '✓ Un caractère spécial',
        valid: /[^A-Za-z0-9]/.test(password)
      }
    ];
  }

  resetPasswordVisibility() {
    this.showPassword = false;
  }
}