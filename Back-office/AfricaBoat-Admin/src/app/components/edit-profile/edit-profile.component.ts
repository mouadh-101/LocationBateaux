import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  loading = true;
  error = '';
  private userSub?: Subscription;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    // Abonnement continu : à chaque changement de currentUser$, on met à jour user
    this.userSub = this.userService.currentUser$.subscribe({
      next: (user) => {
        this.user = user ? { ...user } : null; // clonage pour éviter références directes
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du profil.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  updateProfile(): void {
    if (!this.user) return;

    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: (updatedUser) => {
        alert('Profil mis à jour avec succès');
        // Pas besoin de refreshCurrentUser() car updateUser() met déjà à jour currentUserSubject
        // Le subscription dans ngOnInit mettra à jour automatiquement this.user
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        alert('Erreur lors de la mise à jour');
        console.error(err);
      }
    });
  }
}
