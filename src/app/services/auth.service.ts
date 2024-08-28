import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from '../models/User';
import { GlobalConstants } from '../constants/global-constants';
import { isPlatformBrowser } from '@angular/common';

const URL = GlobalConstants.URL + '/users';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData!: User;
  http = inject(HttpClient);
  register(user: FormData): Observable<any> {
    return this.http.post<any>(`${URL}/register`, user);
  }
  login(
    email: string,
    password: string
  ): Observable<{ token: string; user: User }> {
    const loginData = { email, password };
    return this.http.post<{ token: string; user: User }>(
      `${URL}/login`,
      loginData
    );
  }
  getLoggedInUser() {
    return this.userData;
  }
  isLoggedIn(): boolean {
    return !!this.userData;
  }
  logout(): void {
    localStorage.removeItem('token');
    let emptyUser!: User;
    this.setUserData(emptyUser);
  }
  setUserData(userData: User): void {
    this.userData = userData;
  }

  getCurrentAuthUser(): Observable<User> {
    return this.http.get<any>(`${URL}/profile`);
  }
}
