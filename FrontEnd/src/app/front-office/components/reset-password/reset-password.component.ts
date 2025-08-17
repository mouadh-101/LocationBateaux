import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertComponent } from 'src/app/shared/alert/alert.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  token: string = '';
  passwordForm!: FormGroup;
  showNewPassword = false;
  showConfirmPassword = false;
  updatingPassword = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (!newPassword || !confirmPassword) {
      return null;
    }

    if (newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  resetPassword() {
    if (this.passwordForm.valid) {
      this.updatingPassword = true;
      this.authService.resetPassword(this.token,this.passwordForm.value.newPassword).subscribe({
        next: (response) => {
          if (response.status === 'SUCCESS') {
            this.alertService.showAlert(response.message, 'success');
            setTimeout(() => this.router.navigate(['/']), 1000); // redirect after success
            this.updatingPassword = false;
          }
        },
        error: (error) => {
          this.alertService.showAlert(error.error.message || 'Une erreur est survenue.', 'error');
        }
      });
    }
  }
    // Password strength calculation
  getPasswordStrength(): number {
    const password = this.passwordForm.get('newPassword')?.value || '';
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
    const password = this.passwordForm.get('newPassword')?.value || '';
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
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }
}

