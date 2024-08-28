import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { LoadingComponent } from '../../components/loading/loading.component';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    FormsModule,
    LoadingComponent,
    ReactiveFormsModule,
    NgIf,
    RouterModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  loginForm!: FormGroup;
  loading: boolean = false;
  password!: string;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Welcome' });
  }
  showError(error: number, message: string) {
    if (error == 400) {
      console.log(message);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Server Error',
      });
    }
  }
  ngOnInit(): void {
    this.initLoginForm();
  }

  private initLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.loading = true;
      this.authService.login(email, password).subscribe(
        (response) => {
          console.log(response);
          localStorage.setItem('token', response.token);
          this.authService.setUserData(response.user);
          this.showSuccess();
          this.loading = false;
          this.router.navigate(['/']);
        },
        (error) => {
          console.log(error);

          this.showError(error.status, error.error.msg);
          this.loading = false;
        }
      );
    }
  }
}
