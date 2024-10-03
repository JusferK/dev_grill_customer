import { Component, inject, OnInit, signal } from '@angular/core';
import {
   IonHeader,
   IonToolbar,
   IonTitle,
   IonContent,
   IonCard,
   IonCardHeader,
   IonCardTitle,
   IonCardSubtitle,
   IonCardContent,
   IonIcon,
   IonInput,
   IonInputPasswordToggle,
   IonButton,
   IonToast,
   IonBackdrop,
   IonSpinner,
   LoadingController
   } from '@ionic/angular/standalone';
import { ProfileSessionService } from '../services/profile-session.service';
import { IUser } from '../models/user.model';
import { addIcons } from 'ionicons';
import { personCircleOutline, warningOutline, checkboxOutline } from 'ionicons/icons';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UserApiService } from '../services/user-api.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonIcon,
    IonInput,
    IonButton,
    IonToast,
    IonInputPasswordToggle,
    IonBackdrop,
    IonSpinner,
    ReactiveFormsModule,
    DatePipe
  ],
})
export class Tab3Page implements OnInit {

  updateSignal = signal<boolean>(false);
  willNotUpdate = signal<boolean>(true);
  isLoading = signal<boolean>(false);
  userProfile = signal<IUser | null>(null);
  updateForm!: FormGroup;
  private _profileSessionService = inject(ProfileSessionService);
  private _router = inject(Router);
  private _toastController = inject(ToastController);
  private _userApiService = inject(UserApiService);
  private _loadingCtrl = inject(LoadingController);

  constructor(private _fb: FormBuilder) {
    addIcons({ personCircleOutline, warningOutline, checkboxOutline });
  }

  ngOnInit(): void {

    this.userProfile.set(this._profileSessionService.getProfileSession());
    const profile = this.userProfile()!;

    if(profile) {
      this.updateForm = this._fb.group({
        email: [profile.email],
        name: [profile.name, [Validators.required, Validators.maxLength(45)]],
        lastName: [profile.lastName, [Validators.required, Validators.maxLength(45)]],
        password: [profile.password, [Validators.required, Validators.maxLength(300)]],
        nit: [profile.nit, [Validators.required]],
        signDate: [profile.signDate]
      });
    }
  }

  onUpdate = () => this.updateSignal.update(prev => !prev);

  onSubmit() {

    const checker = this.validateSameValues();
    this._loadingCtrl.create({
      backdropDismiss: false,
      spinner: 'crescent',
      cssClass: 'transparent-loader'
    }).then((e) => e.present());

    if(checker.includes(true)) {

      this.isLoading.set(true);

      this._userApiService.updateProfile(this.updateForm.value).subscribe({
        next: (data: IUser) => {
          data.password = this.updateForm.get('password')?.value;
          this._profileSessionService.setProfileSession(data);
          this.userProfile.set(data);
          this.userProfile.set(this.userProfile());
          this.updateSignal.set(false);

          setTimeout(() => {
            this._loadingCtrl.dismiss();
            this._toastController.create({
              message: 'Change made successfully!',
              duration: 2000,
              icon: checkboxOutline,
              position: 'top'
            })
            .then((response) => response.present());
          }, 1000);
        },
        error: () => {
          setTimeout(() => {
            this._loadingCtrl.dismiss();
            this._toastController.create({
              message: 'There was an problem, try later',
              duration: 2000,
              icon: warningOutline,
              position: 'top'
            })
            .then((response) => response.present());
          }, 1000);
        }
      });
    } else {
      setTimeout(() => {
        this._loadingCtrl.dismiss();
        this._toastController.create({
          message: 'No change was made',
          duration: 2000,
          icon: warningOutline,
          position: 'top'
        })
        .then((response) => response.present());
      }, 1000);

    }


  }

  passwordToStars(password?: string): string {

    let changedPW: string = '';
    if(password) {
      for(let i = 0; i < password.length; i++) {
        changedPW += '*';
      }
    }

    return changedPW;

  }

  logoutHandler() {
    this._profileSessionService.removeProfileSession();
    this._router.navigate(['/login'], { replaceUrl: true });
  }

  validateSameValues(): boolean[] {

    const bag: boolean[] = [];

    const profile = this.userProfile()!;

    this.updateForm.get('name')?.value !== profile.name ? bag.push(true) : bag.push(false);
    this.updateForm.get('lastName')?.value !== profile.lastName ? bag.push(true) : bag.push(false);
    this.updateForm.get('password')?.value !== profile.password ? bag.push(true) : bag.push(false);
    this.updateForm.get('nit')?.value !== profile.nit ? bag.push(true) : bag.push(false);

    return bag;
  }

}
