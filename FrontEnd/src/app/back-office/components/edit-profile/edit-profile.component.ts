import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
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
    this.userService.getMe().subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du profil';
        console.error(err);
        this.loading = false;
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
        this.userService.currentUser$.subscribe(() => {
          this.user = updatedUser;
        });

        this.router.navigate(['/admin/profile']);
      },
      error: (err) => {
        alert('Erreur lors de la mise à jour');
        console.error(err);
      }
    });
  }
}
