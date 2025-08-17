import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserRegister } from 'src/app/interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  user: Omit<UserRegister, 'password'> = {
    name: '',
    email: '',
    role: '',
    phone: ''
  };

  generatedPassword: string | null = null;

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    this.userService.addUserWithRandomPassword(this.user).subscribe({
      next: (response) => {
        this.generatedPassword = response.generatedPassword || null;
        alert('Utilisateur Ajouté Avec Succès ✅ !');
        this.router.navigate(['/admin/users']);
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de l’ajout de l’utilisateur.');
      }
    });
  }
}
