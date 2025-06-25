import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuOpen = false;
  constructor(private router: Router) {}

  toggleMenu() {
    
    this.isMenuOpen = !this.isMenuOpen;
  }

  onLogin() {
    this.router.navigate(['/auth']);
  }


}
