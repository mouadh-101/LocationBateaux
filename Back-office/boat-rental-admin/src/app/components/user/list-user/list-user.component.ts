import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.refreshUsers(); // ✅ Appel dès l'initialisation
  }

  refreshUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Erreur récupération utilisateurs :', err);
      }
    });
  }

  editUser(user: User): void {
    this.router.navigate(['/edit-user', user.id]);
  }

  banUser(user: User): void {
    this.userService.banUser(user.id).subscribe({
      next: () => {
        alert(` ${user.name} banni avec succès.`);
        this.refreshUsers(); 
      },
      error: err => {
        console.error('Erreur bannissement:', err);
        alert('Erreur lors du bannissement.');
      }
    });
  }

  unbanUser(user: User): void {
    this.userService.unbanUser(user.id).subscribe({
      next: () => {
        alert(` ${user.name} débanni avec succès.`);
        this.refreshUsers();
      },
      error: err => {
        console.error('Erreur débannissement:', err);
        alert('Erreur lors du débannissement.');
      }
    });
  }
}
