// src/app/services/comment.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/Comment';
import { GlobalConstants } from '../constants/global-constants';

const URL = GlobalConstants.URL + '/comments';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private http: HttpClient) {}

  // Create a new comment
  createComment(postId: string, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${URL}`, { text: comment, post: postId });
  }

  // Get comments for a specific post
  getCommentsByPostId(postId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${URL}/${postId}`);
  }

  // Update a comment by ID
  updateComment(id: string, comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${URL}/${id}`, comment);
  }

  // Delete a comment by ID
  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>(`${URL}/${id}`);
  }
}
