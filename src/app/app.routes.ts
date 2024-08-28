import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login - Elite Social Network',

    loadComponent: () =>
      import('./pages/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'register',
    title: 'Register - Elite Social Network',

    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: '',
    title: 'Elite Social Network',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/layout/layout.component').then(
        (m) => m.LayoutComponent
      ),
    children: [
      {
        title: 'Home - Elite Social Network',
        path: 'home',

        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        title: 'My Posts - Elite Social Network',
        path: 'myposts',

        loadComponent: () =>
          import('./pages/my-posts/my-posts.component').then(
            (m) => m.MyPostsComponent
          ),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
