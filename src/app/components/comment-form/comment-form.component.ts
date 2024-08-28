import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { CommentsService } from '../../services/comments.service';
import { PostsService } from '../../services/posts.service';
import { NgIf } from '@angular/common';
import { User } from '../../models/User';
import { Comment } from '../../models/Comment';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.css',
})
export class CommentFormComponent {
  userData!: User;
  commentForm!: FormGroup;
  loading: boolean = false;
  @Input({ required: true }) postId!: string;
  @Output()
  handleSubmit = new EventEmitter<Comment>();
  constructor(
    private authService: AuthService,
    private commentsService: CommentsService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.initCommentForm();
    this.userData = this.authService.getLoggedInUser();
  }
  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Comment Added' });
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

  private initCommentForm(): void {
    this.commentForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  onSubmitComment(): void {
    if (this.commentForm.valid) {
      const { text } = this.commentForm.value;
      this.loading = true;
      if (this.userData) {
        this.commentsService.createComment(this.postId, text).subscribe(
          (response) => {
            this.handleSubmit.emit(response);
            this.showSuccess();

            this.loading = false;
            this.commentForm.reset();
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
