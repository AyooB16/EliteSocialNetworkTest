import { Component } from '@angular/core';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { GlobalConstants } from '../../constants/global-constants';

const IMAGES_URL = GlobalConstants.IMAGES_URL;

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css',
})
export class ProfileCardComponent {
  userData!: User;
  IMAGES_URL = IMAGES_URL;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    console.log('TZSSS');
    console.log(this.userData);

    this.userData = this.authService.getLoggedInUser();
  }
}
