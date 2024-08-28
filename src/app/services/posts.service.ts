import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/Post';
import { GlobalConstants } from '../constants/global-constants';
const URL = GlobalConstants.URL + '/posts';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private http: HttpClient) {}

  // Create a new post
  createPost(text: string): Observable<Post> {
    console.log(text);

    return this.http.post<Post>(`${URL}`, { text });
  }

  // Get all posts
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${URL}`);
  }
  // Get all posts
  getMyPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${URL}/myposts`);
  }
  // Get a single post by ID
  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(`${URL}/${id}`);
  }

  // Update a post by ID
  updatePost(id: string, post: Post): Observable<Post> {
    if (typeof localStorage !== 'undefined') {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      });
      return this.http.put<Post>(`${URL}/${id}`, post);
    } else {
      console.error('localStorage is not available.');
      return new Observable();
    }
  }

  // Delete a post by ID
  deletePost(id: string): Observable<void> {
    if (typeof localStorage !== 'undefined') {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      });
      return this.http.delete<void>(`${URL}/${id}`);
    } else {
      console.error('localStorage is not available.');
      return new Observable();
    }
  }

  // Like a post
  likePost(id: string): Observable<Post> {
    if (typeof localStorage !== 'undefined') {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      });
      return this.http.post<Post>(`${URL}/${id}/like`, {});
    } else {
      console.error('localStorage is not available.');
      return new Observable();
    }
  }
  unlikePost(id: string): Observable<Post> {
    if (typeof localStorage !== 'undefined') {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      });
      return this.http.post<Post>(`${URL}/${id}/unlike`, {});
    } else {
      console.error('localStorage is not available.');
      return new Observable();
    }
  }
}
