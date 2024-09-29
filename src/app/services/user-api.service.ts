import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private _httpClient = inject(HttpClient);
  baseURL: string = 'http://192.168.10.23:8080/user';
  //baseURL: string = 'http://localhost:8080/user';

  constructor() {}

  userLogin(body: any): Observable<IUser | boolean> {
    return this._httpClient.post<IUser>(`${this.baseURL}/login`, body);
  }
  
  userCreateAccount(newUser: IUser): Observable<IUser> {
    return this._httpClient.post<IUser>(`${this.baseURL}/sign`, newUser);
  }

  updateProfile(user: IUser): Observable<IUser> {
    return this._httpClient.put<IUser>(`${this.baseURL}/update-user`, user);
  }

}
