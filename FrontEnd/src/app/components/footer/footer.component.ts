import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  email = '';

  socialLinks = [
    { name: 'Facebook', icon: 'facebook', url: '#' },
    { name: 'Twitter', icon: 'twitter', url: '#' },
    { name: 'LinkedIn', icon: 'linkedin', url: '#' },
  ];

  quickLinks = [
    { name: 'Accueil', url: '#' },
    { name: 'Services', url: '#' },
    { name: 'À propos', url: '#' },
    { name: 'Contact', url: '#' },
    { name: 'Blog', url: '#' },
    { name: 'Carrières', url: '#' }
  ];

  legalLinks = [
    { name: 'Politique de confidentialité', url: '#' },
    { name: 'Conditions d\'utilisation', url: '#' },
  ];

  onNewsletterSubmit() {
    if (this.email) {
      console.log('Inscription newsletter:', this.email);
      // Logique d'inscription à la newsletter
      this.email = '';
      // Afficher un message de succès
    }
  }

  onSocialClick(platform: string) {
    console.log(`Clic sur ${platform}`);
    // Logique de redirection vers les réseaux sociaux
  }
}
