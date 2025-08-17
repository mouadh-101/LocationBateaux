import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-back-layout',
  templateUrl: './back-layout.component.html',
  styleUrls: ['./back-layout.component.css']
})
export class BackLayoutComponent {
  sidebarCollapsed = false;
  sidebarMobileOpen = false;
  isMobile = false;

  user: User | null = null;
  isLoggedIn = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private userService: UserService, 
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();

    // Charge l’utilisateur stocké, APRES l'initialisation du composant
    this.userService.getMe().subscribe({
      next: (user) => {
        this.user = user
        this.authService.setCurrentUser(user);
      },
      error: (err) => console.error('Erreur lors de la récupération de l’utilisateur', err),
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
