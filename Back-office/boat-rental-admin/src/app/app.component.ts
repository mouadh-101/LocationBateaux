import { Component, HostListener, OnInit } from '@angular/core';
import { User } from './interfaces/user';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  sidebarCollapsed = false;
  sidebarMobileOpen = false;
  isMobile = false;

  user: User | null = null;
  isLoggedIn = false;

  constructor(
    private userService: UserService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();

    this.userService.currentUser$.subscribe({
      next: (user) => (this.user = user),
      error: (err) => console.error('Erreur lors de la récupération du user', err),
    });

    this.authService.authState$.subscribe({
      next: (state) => (this.isLoggedIn = state),
    });
  }

  // Ecoute le redimensionnement de la fenêtre
  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth < 768; // breakpoint mobile (md en tailwind)
    if (!this.isMobile) {
      this.sidebarMobileOpen = false; // ferme menu mobile si passage desktop
    }
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.sidebarMobileOpen = !this.sidebarMobileOpen;
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }

  closeSidebarMobile() {
    if (this.isMobile) {
      this.sidebarMobileOpen = false;
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
