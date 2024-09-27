import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileSessionService {

  constructor() {}

  getProfileSession() {
    const pivot = localStorage.getItem('profile-session');

    if(pivot) {
      return JSON.parse(pivot);
    }
  }

  setProfileSession(user: IUser) {
    localStorage.setItem('profile-session', JSON.stringify(user));
  }

  removeProfileSession() {
    localStorage.clear();
  }

}
