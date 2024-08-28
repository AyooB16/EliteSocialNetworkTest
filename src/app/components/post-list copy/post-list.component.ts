import { Component } from '@angular/core';
import { Post } from '../../models/Post';
import { PostsService } from '../../services/posts.service';
import { PostCardSkeletonComponent } from '../post-card-skeleton/post-card-skeleton.component';
import { CommentsListComponent } from '../comments-list/comments-list.component';
import { GlobalConstants } from '../../constants/global-constants';
import { CommentsService } from '../../services/comments.service';
import { NgIf, TitleCasePipe } from '@angular/common';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { CommentsSkeletonComponent } from '../comments-skeleton/comments-skeleton.component';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';

import { CommentFormComponent } from '../comment-form/comment-form.component';
import { PostNewComponent } from '../post-new/post-new.component';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { TabMenuModule } from 'primeng/tabmenu';
import { PostEditFormComponent } from '../post-edit-form/post-edit-form.component';
import { DialogModule } from 'primeng/dialog';
const IMAGES_URL = GlobalConstants.IMAGES_URL;

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    PostCardSkeletonComponent,
    CommentsListComponent,
    DateAgoPipe,
    TitleCasePipe,
    CommentsSkeletonComponent,
    CommentFormComponent,
    MenuModule,
    NgIf,
    PostNewComponent,
    TabMenuModule,
    DialogModule,
    PostEditFormComponent,
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent {
  posts: Post[] = [];
  userDetails!: User;
  IMAGES_URL = IMAGES_URL;
  items: MenuItem[] | undefined;

  constructor(
    private authService: AuthService,
    private postService: PostsService,
    private commentsService: CommentsService
  ) {}

  ngOnInit(): void {
    this.userDetails = this.authService.getLoggedInUser();

    this.fetchPosts();
  }
  // showNewComment(comment: any) {
  //   const postIndex = this.posts.findIndex((post) => post._id === comment.post);
  //   if (postIndex !== -1) {
  //     this.posts[postIndex].comments.push(comment);
  //     this.posts[postIndex].commentsShowed.push(comment);
  //   }
  // }

  deletePost(post: Post) {
    console.log('Delete');
  }
  updatePost(post: Post) {
    console.log('updatePost');
  }
  isEditing = false;
  selectedPost: any;

  editPost(post: any) {
    this.isEditing = true;
    this.selectedPost = { ...post };
  }

  onPostUpdated(updatedPost: any) {
    this.isEditing = false;
    const index = this.posts.findIndex((p) => p._id === updatedPost._id);
    this.posts[index] = updatedPost;
  }

  onEditCancelled() {
    this.isEditing = false;
  }

  getMenuItemsForItem(post: Post): MenuItem[] {
    return [
      {
        label: 'Delete',
        icon: 'fa-plus',
        command: (e) => this.deletePost(post),
      },
      {
        label: 'Update',
        icon: 'fa-plus',
        command: (e) => this.updatePost(post),
      },
    ];
  }
  fetchPosts(): void {
    this.postService.getPosts().subscribe(
      (data: Post[]) => {
        this.posts = data.map((post) => ({
          ...post,
          commentsShowed: [],
          showComments: false,
        }));
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }
  isLiked(post: Post) {
    return !post.likes.includes(this.userDetails._id);
  }
  showNewPost(post: any) {
    this.posts.unshift(post);
  }
  toggleComments(post: Post) {
    if (!post.showComments) {
      post.showComments = !post.showComments;
    }

    if (post.showComments && post.commentsShowed.length === 0) {
      this.commentsService.getCommentsByPostId(post._id).subscribe(
        (comments) => {
          post.commentsShowed = comments;
        },
        (error) => {
          console.error('Error loading comments:', error);
        }
      );
    }
  }
  // Like a post
  likePost(post: Post): void {
    this.postService.likePost(post._id).subscribe(
      () => {
        post.likes.push(this.userDetails._id);
      },
      (error) => {
        console.error('Error liking post:', error);
      }
    );
  }

  // Unlike a post
  unlikePost(post: Post): void {
    this.postService.unlikePost(post._id).subscribe(
      () => {
        post.likes = post.likes.filter((like) => like !== this.userDetails._id);
      },
      (error) => {
        console.error('Error unliking post:', error);
      }
    );
  }
}
