import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../models/user.model';
import { IOrderRequest } from '../models/order-request.model';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private _httpClient = inject(HttpClient);
  baseURL: string;

  constructor() {
    this.baseURL = `${window.location.protocol}//${window.location.hostname}:8080/user`;
  }

  userLogin(body: any): Observable<IUser | boolean> {
    return this._httpClient.post<IUser>(`${this.baseURL}/login`, body);
  }
  
  userCreateAccount(newUser: IUser): Observable<IUser> {
    return this._httpClient.post<IUser>(`${this.baseURL}/sign`, newUser);
  }

  updateProfile(user: IUser): Observable<IUser> {
    return this._httpClient.put<IUser>(`${this.baseURL}/update-user`, user);
  }

  getOrderMade(email: string): Observable<IOrderRequest[]> {
    return this._httpClient.get<IOrderRequest[]>(`${this.baseURL}/orders-made/${email}`);
  }

}