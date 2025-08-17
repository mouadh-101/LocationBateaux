import { Component } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent {
  user:User| null = null;
  isLoggedIn: boolean = false;

  constructor(private userService: UserService,private authService:AuthService) {}

  ngOnInit(): void {
    this.getUser();
  }
  getUser(): void {
    this.userService.getMe().subscribe({
      next: (user: User) => {
        this.user = user;
        this.isLoggedIn = true;
      },
      error: (err) => {
        console.error('Error fetching user:', err);
      }
    });
  }
  logout(): void {
    this.authService.logout();
  }

}
