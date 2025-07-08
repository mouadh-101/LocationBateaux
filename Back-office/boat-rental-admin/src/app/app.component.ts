import { AuthService } from './services/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from './interfaces/user';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'boat-rental-admin';
  sidebarCollapsed: boolean = false;
  user: User | null = null;
  isLoggedIn=false;

  constructor(private userService:UserService ,private authService:AuthService,private router:Router) {}

  ngOnInit(): void {
    // S'abonner au BehaviorSubject pour recevoir les mises à jour en temps réel
    this.userService.currentUser$.subscribe({
      next: user => this.user = user,
      error: err => console.error('Erreur lors de la récupération du user', err)
    });
    this.authService.authState$.subscribe({
      next: state => this.isLoggedIn = state
    })
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  onLogout()
  {
    this.authService.logout()
    this.router.navigate(['/']);
  }
}
