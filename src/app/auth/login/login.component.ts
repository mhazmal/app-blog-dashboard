import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private authService : AuthService) {}

  onSubmit(formValue) {
    // console.log(formValue)
    this.authService.login(formValue.email, formValue.password)

  }
}
