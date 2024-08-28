import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoadingComponent } from '../../components/loading/loading.component';
import { NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, LoadingComponent, ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initRegisterForm();
  }

  private initRegisterForm(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(6)]],
      image: [''],
      bio: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  onImageSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];

    if (file) {
      this.registerForm.patchValue({ image: file });
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = new FormData();
      formData.append('username', this.registerForm.get('username')?.value);
      formData.append('email', this.registerForm.get('email')?.value);
      formData.append('password', this.registerForm.get('password')?.value);
      formData.append('bio', this.registerForm.get('bio')?.value);
      const file1 = this.registerForm.get('image')?.value;

      if (file1 instanceof File) {
        console.log('file1.name');
        console.log(this.registerForm.get('image')?.value);

        formData.append('image', file1, file1.name);
      }

      this.loading = true;

      this.authService.register(formData).subscribe(
        (response) => {
          console.log(response);
          this.authService.setUserData(response.user);
          this.showSuccess();
          this.loading = false;
          this.router.navigate(['/']);
        },
        (error) => {
          this.showError(error.status, error.message);
          this.loading = false;
        }
      );
    }
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Registration Successful',
    });
  }

  showError(error: number, message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Registration Failed',
      detail: message,
    });
  }
}
