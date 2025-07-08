import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  user: User | null = null;
  loading = true;
  error = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du profil.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  updateProfile(): void {
    if (!this.user) return;

    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: () => {
        alert('Profil mis à jour avec succès');
        this.router.navigate(['/profile']);  // redirection après mise à jour
      },
      error: (err) => {
        alert('Erreur lors de la mise à jour');
        console.error(err);
      }
    });
  }
}
