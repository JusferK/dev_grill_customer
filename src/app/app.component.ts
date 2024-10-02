import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { UserApiService } from './services/user-api.service';
import { ProfileSessionService } from './services/profile-session.service';
import { IUser } from './models/user.model';
import { IOrderRequest } from './models/order-request.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit{

  private _userApiService = inject(UserApiService);
  private _profileSessionService = inject(ProfileSessionService);

  ngOnInit(): void {
    const userProfile: IUser = this._profileSessionService.getProfileSession();
    this._userApiService.getOrderMade(userProfile.email).subscribe({
      next: (data: IOrderRequest[]) => {
        userProfile.orderRequestList = data;
        this._profileSessionService.setProfileSession(userProfile);
      }
    })
  }

}
