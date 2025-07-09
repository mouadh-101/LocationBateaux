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

  // Pagination
  page: number = 1;
  pageSize: number = 6;
  totalPages: number = 0;

  // Filtres
  filterName: string = '';
  filterRole: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.refreshUsers();
  }

  // Applique les filtres + pagination
  get paginatedUsers(): User[] {
    const filtered = this.users.filter(user =>
      user.name.toLowerCase().includes(this.filterName.toLowerCase()) &&
      (this.filterRole === '' || user.role === this.filterRole)
    );

    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    if (this.page > this.totalPages && this.totalPages > 0) {
      this.page = this.totalPages;
    }

    const startIndex = (this.page - 1) * this.pageSize;
    return filtered.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(direction: number): void {
    const newPage = this.page + direction;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
    }
  }

  refreshUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.totalPages = Math.ceil(this.users.length / this.pageSize);
        if (this.page > this.totalPages) {
          this.page = this.totalPages;
        }
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
        alert(`${user.name} banni avec succès.`);
        this.refreshUsers();
      },
      error: err => {
        console.error('Erreur bannissement :', err);
        alert('Erreur lors du bannissement.');
      }
    });
  }

  unbanUser(user: User): void {
    this.userService.unbanUser(user.id).subscribe({
      next: () => {
        alert(`${user.name} débanni avec succès.`);
        this.refreshUsers();
      },
      error: err => {
        console.error('Erreur débannissement :', err);
        alert('Erreur lors du débannissement.');
      }
    });
  }

  resetFilters(): void {
  this.filterName = '';
  this.filterRole = '';
  this.page = 1;
}

}
