import { Component, HostListener, OnInit } from '@angular/core';
import { User } from './interfaces/user';
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
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();

    // Charge l’utilisateur stocké, APRES l'initialisation du composant
    this.authService.loadUserFromStorage();

    this.authService.currentUser$.subscribe({
      next: (user) => (this.user = user),
      error: (err) => console.error('Erreur lors de la récupération du user', err),
    });

    this.authService.authState$.subscribe({
      next: (state) => (this.isLoggedIn = state),
    });
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth < 100;
    if (!this.isMobile) {
      this.sidebarMobileOpen = false;
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
