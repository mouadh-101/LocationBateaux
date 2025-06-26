import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthModalService } from 'src/app/services/auth-modal.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuOpen = false;
  isLoggedIn = false; 
  constructor(private router: Router,private authModalService: AuthModalService,private authService:AuthService) {}
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  toggleMenu() {

    this.isMenuOpen = !this.isMenuOpen;
  }

  openAuth() {
    this.authModalService.open();
  }
  
  


}
