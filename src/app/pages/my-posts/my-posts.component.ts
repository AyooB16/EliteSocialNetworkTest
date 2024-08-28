import { Component } from '@angular/core';
import { Post } from '../../models/Post';
import { PostsService } from '../../services/posts.service';
import { GlobalConstants } from '../../constants/global-constants';
import { CommentsService } from '../../services/comments.service';
import { NgIf, TitleCasePipe } from '@angular/common';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';

import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { TabMenuModule } from 'primeng/tabmenu';
import { DialogModule } from 'primeng/dialog';
import { CommentFormComponent } from '../../components/comment-form/comment-form.component';
import { CommentsListComponent } from '../../components/comments-list/comments-list.component';
import { CommentsSkeletonComponent } from '../../components/comments-skeleton/comments-skeleton.component';
import { PostCardSkeletonComponent } from '../../components/post-card-skeleton/post-card-skeleton.component';
import { PostEditFormComponent } from '../../components/post-edit-form/post-edit-form.component';
import { PostNewComponent } from '../../components/post-new/post-new.component';
const IMAGES_URL = GlobalConstants.IMAGES_URL;

@Component({
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
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.css',
})
export class MyPostsComponent {
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
    this.postService.deletePost(post._id).subscribe(
      (result) => {
        this.posts = this.posts.filter((postObj) => postObj._id !== post._id);
      },
      (error) => {
        console.error('Error updating post:', error);
      }
    );
  }

  isEditing = false;
  selectedPost: any;

  onPostUpdated(updatedPost: any) {
    this.editingPostId = null;
    const index = this.posts.findIndex((p) => p._id === updatedPost._id);
    this.posts[index] = updatedPost;
  }

  onEditCancelled() {
    this.editingPostId = null;
  }

  getMenuItemsForItem(post: Post): MenuItem[] {
    return [
      {
        label: 'Delete',
        command: (e) => this.deletePost(post),
      },
      {
        label: 'Update',
        command: (e) => this.editPost(post._id),
      },
    ];
  }
  fetchPosts(): void {
    this.postService.getMyPosts().subscribe(
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
  editingPostId: string | null = null;

  editPost(postId: string) {
    this.editingPostId = postId;
  }

  cancelEdit() {
    this.editingPostId = null;
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
