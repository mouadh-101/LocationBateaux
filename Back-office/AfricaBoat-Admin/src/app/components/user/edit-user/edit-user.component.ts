import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  userId!: number;
  user: User = {
    id: 0,
    name: '',
    email: '',
    password: '', // optionnel ici, ou à gérer séparément
    role: '',
    isActive:false,
    phone:''

  };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUser();
  }

  loadUser(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Erreur chargement utilisateur', err);
        alert('Utilisateur introuvable');
        this.router.navigate(['/users']); // ou la route liste
      },
    });
  }

  updateUser(): void {
    this.userService.updateUser(this.userId, this.user).subscribe({
      next: () => {
        alert('Utilisateur mis à jour Avec Succès ✅');
        this.router.navigate(['/users']); // retour à la liste
      },
      error: (err) => {
        console.error('Erreur mise à jour utilisateur', err);
        alert('Erreur lors de la mise à jour');
      },
    });
  }
}
