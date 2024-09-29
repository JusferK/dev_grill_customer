import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { 
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonInputPasswordToggle,
  IonText,
  IonItemDivider,
  IonButton,
  IonIcon
 } from '@ionic/angular/standalone';
 import { addIcons } from 'ionicons';
 import { codeOutline } from 'ionicons/icons';
import { UserApiService } from '../services/user-api.service';
import { Subscription } from 'rxjs';
import { IUser } from '../models/user.model';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileSessionService } from '../services/profile-session.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonInput,
    IonInputPasswordToggle,
    IonText,
    IonItemDivider,
    IonButton,
    IonIcon,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class LoginPage {

  loginForm: FormGroup;
  incorrectLogin = signal<boolean>(false);
  userApiSuscription!: Subscription;
  returnedError = signal<boolean>(false);
  private _userApiService = inject(UserApiService);
  private _userProfileSession = inject(ProfileSessionService);
  private _router = inject(Router);

  constructor(private _fb: FormBuilder) {
    addIcons({ codeOutline })

    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.userApiSuscription = this._userApiService.userLogin(this.loginForm.value).subscribe({
      next: (data: IUser | boolean) => {
        if(data && typeof data !== 'boolean') {
          data.password = this.loginForm.get('password')?.value;
          this._userProfileSession.setProfileSession(data);
          this._router.navigate([''], { replaceUrl: true });
        } else {
          this.incorrectLogin.set(true);
        }
      },
      error: () => {
        this.returnedError.set(true);
      }
    })
  }

}
