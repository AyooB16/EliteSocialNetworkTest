import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../../models/Post';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { PostsService } from '../../services/posts.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-new',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './post-new.component.html',
  styleUrl: './post-new.component.css',
})
export class PostNewComponent {
  userData!: User;
  postForm!: FormGroup;
  loading: boolean = false;
  @Output()
  handleSubmit = new EventEmitter<Post>();
  constructor(
    private authService: AuthService,
    private postsService: PostsService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.initPostForm();
    this.userData = this.authService.getLoggedInUser();
  }
  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Post Created' });
  }
  showError(error: number, message: string) {
    if (error == 400) {
      console.log(message);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
      });
    }
    if (error == 401) {
      console.log(message);
      this.messageService.add({
        severity: 'error',
        detail: 'Server Error',
        summary: 'Session Expired',
      });
      this.authService.logout();
      this.router.navigate(['login']);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Server Error',
      });
    }
  }

  private initPostForm(): void {
    this.postForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  onSubmitComment(): void {
    if (this.postForm.valid) {
      const { text } = this.postForm.value;
      this.loading = true;
      if (this.userData) {
        this.postsService.createPost(text).subscribe(
          (response) => {
            this.handleSubmit.emit(response);
            this.showSuccess();
            this.loading = false;
            this.postForm.reset();
          },
          (error) => {
            console.log(error);

            this.showError(error.status, error.error);
            this.loading = false;
          }
        );
      } else {
        this.authService.logout();
      }
    }
  }
}
