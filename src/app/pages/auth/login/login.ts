import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class Login {
  email = '';
  password = '';

  constructor(private router: Router) {}

  onSubmit() {
    // Later: replace with real API call
    if (this.email === 'test@example.com' && this.password === 'password') {
      console.log('Login successful');
      this.router.navigate(['/dashboard']);
    } else {
      console.log('Invalid credentials');
      alert('Invalid email or password');
    }
  }
}
