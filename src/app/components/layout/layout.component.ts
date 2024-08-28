import { Component, inject } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { LoadingComponent } from '../loading/loading.component';
import { ProfileCardComponent } from '../profile-card/profile-card.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    LoadingComponent,
    ProfileCardComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  authService = inject(AuthService);
  user?: any;
  loading: boolean = true;
  constructor() {}
  ngOnInit() {
    this.authService.getCurrentAuthUser().subscribe((result) => {
      this.authService.setUserData(result);
      console.log(' this.authService.setUserData(result);');

      this.user = this.authService.getLoggedInUser();
      this.user = result;
      this.loading = false;
    });
  }
}
