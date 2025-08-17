import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { User, UserStats } from 'src/app/interfaces/user';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  personalInfoForm!: FormGroup;
  passwordForm!: FormGroup;

  currentUser: User | null = null;

  userStats :UserStats | null = null;

  // UI State
  updatingPersonalInfo = false;
  updatingPassword = false;


  // Password visibility toggles
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private userService: UserService,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    this.loadUserData();
  }

  initializeForms() {

    this.personalInfoForm = this.fb.group({
      nom: [this.currentUser?.name, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      telephone: [this.currentUser?.phone, [
        Validators.required,
        Validators.pattern('^\\+?[0-9]{10,15}$')
      ]]
    });

    // Password Form
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  loadUserData() {
    // Load current user data from service
    this.userService.getMe().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.personalInfoForm.patchValue({
          nom: user.name,
          telephone: user.phone
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données utilisateur', error);
      }
    });
    // Load user statistics
    this.userService.getUserStats().subscribe({
      next: (stats) => {
        this.userStats = stats;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques utilisateur', error);
      }
    });
  }

  // Custom validator for password confirmation
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

  updatePersonalInfo() {
    if (this.personalInfoForm.valid && this.currentUser) {
      this.updatingPersonalInfo = true;

      this.currentUser.name = this.personalInfoForm.value.nom;
      this.currentUser.phone = this.personalInfoForm.value.telephone;

      this.userService.updatePersonalInfo(this.currentUser).subscribe({
        next: (response) => {
          this.updatingPersonalInfo = false;
          this.alertService.showAlert('Informations personnelles mises à jour avec succès', 'success');
          this.currentUser = { ...this.currentUser, ...response };

        },
        error: (error) => {
          this.updatingPersonalInfo = false;
          this.alertService.showAlert('Erreur lors de la mise à jour des informations personnelles', 'error');
        }
      });
    }
  }

  updatePassword() {
    if (this.passwordForm.valid) {
      this.updatingPassword = true;

      const passwordData = {
        curentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword
      };

      this.userService.updatePassword(passwordData).subscribe({
        next: (response) => {
          this.updatingPassword = false;
          this.alertService.showAlert('Mot de passe mis à jour avec succès', 'success');
          this.passwordForm.reset();
          this.resetPasswordVisibility();
        },
        error: (error) => {
          this.updatingPassword = false;
          if (error.status === 400) {
            this.alertService.showAlert('Mot de passe actuel incorrect', 'warning');
          } else {
            this.alertService.showAlert('Erreur lors de la mise à jour du mot de passe', 'error');
          }
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

  getInitials(): string {
    if (this.currentUser) {
      return this.currentUser.name
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return '';

  }

  resetPasswordVisibility() {
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }


  logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.authService.logout();
    }
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
  
}