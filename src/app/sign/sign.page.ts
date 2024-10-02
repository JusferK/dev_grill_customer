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
  IonButton,
  IonNote
 } from '@ionic/angular/standalone';
 import { ReactiveFormsModule } from '@angular/forms';
 import { Router, RouterLink } from '@angular/router';
import { UserApiService } from '../services/user-api.service';
import { IUser } from '../models/user.model';
import { ProfileSessionService } from '../services/profile-session.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.page.html',
  styleUrls: ['./sign.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonInput,
    IonInputPasswordToggle,
    IonText,
    IonButton,
    IonNote, 
    RouterLink
  ]
})
export class SignPage {

  foundEmail = signal<boolean>(false);
  returnedError = signal<boolean>(false);
  createAccountForm: FormGroup;
  private _userProfileService = inject(ProfileSessionService);
  private _userApiService = inject(UserApiService);
  private _router = inject(Router);

  constructor(private _fb: FormBuilder) {
    this.createAccountForm = this._fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(100)]],
      name: ['', [Validators.required, Validators.maxLength(45)]],
      lastName: ['', [Validators.required, Validators.maxLength(45)]],
      nit: ['', [Validators.required]],
      signDate: ['']
    });
  }

  onSubmit() {
    this.createAccountForm.get('signDate')?.patchValue(new Date());

    this._userApiService.userCreateAccount(this.createAccountForm.value).subscribe({
      next: (data: IUser) => {
        data.password = this.createAccountForm.get('password')?.value;
        this._userProfileService.setProfileSession(data);
        this._router.navigate([''], { replaceUrl: true });
      },
      error: (error: any) => {
        if(error.error.message === 'Email is already registered.') {
          this.foundEmail.set(true);
        } else {
          this.returnedError.set(true);
        }

        setTimeout(() => {
          this.foundEmail.set(false);
          this.returnedError.set(false);
        }, 5000);
        
      }
    })
  }

}
