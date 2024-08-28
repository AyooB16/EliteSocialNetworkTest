import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-post-edit-form',
  standalone: true,
  imports: [FormsModule, DialogModule, Button],
  templateUrl: './post-edit-form.component.html',
  styleUrl: './post-edit-form.component.css',
})
export class PostEditFormComponent {
  @Input() post: any;
  @Output() postUpdated = new EventEmitter<any>();
  @Output() editCancelled = new EventEmitter<void>();

  constructor(private postsService: PostsService) {}

  onSubmit() {
    this.postsService.updatePost(this.post._id, this.post).subscribe(
      (updatedPost) => {
        this.postUpdated.emit(updatedPost);
      },
      (error) => {
        console.error('Error updating post:', error);
      }
    );
  }

  onCancel() {
    this.editCancelled.emit();
  }
}
