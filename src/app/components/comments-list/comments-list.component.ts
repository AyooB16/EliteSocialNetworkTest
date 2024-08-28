import { Component, inject, Input, OnInit } from '@angular/core';
import { Post } from '../../models/Post';
import { CommentsService } from '../../services/comments.service';
import { Comment } from '../../models/Comment';
import { TitleCasePipe } from '@angular/common';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { CommentsSkeletonComponent } from '../comments-skeleton/comments-skeleton.component';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { GlobalConstants } from '../../constants/global-constants';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
const IMAGES_URL = GlobalConstants.IMAGES_URL;
@Component({
  selector: 'app-comments-list',
  standalone: true,
  imports: [
    DateAgoPipe,
    TitleCasePipe,
    CommentsSkeletonComponent,
    CommentFormComponent,
  ],
  templateUrl: './comments-list.component.html',
  styleUrl: './comments-list.component.css',
})
export class CommentsListComponent implements OnInit {
  @Input({ required: true }) post!: Post;
  IMAGES_URL = IMAGES_URL;
  authService = inject(AuthService);
  userDetails!: User;
  loading: boolean = true;
  ngOnInit() {
    this.userDetails = this.authService.getLoggedInUser();
  }

  constructor(
    private commentsService: CommentsService,
    private messageService: MessageService,
    private router: Router
  ) {}
  deleteComment(commentId: string) {
    this.commentsService.deleteComment(commentId).subscribe(
      (result) => {
        this.post.commentsShowed = this.post.commentsShowed.filter(
          (comment) => comment._id !== commentId
        );
      },
      (error) => {
        console.error('Error updating post:', error);
      }
    );
  }

  showNewComment(comment: any) {
    console.log('dsdfsdfsdfdsf');

    this.post.comments.push(comment);
    this.post.commentsShowed.push(comment);
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
}
