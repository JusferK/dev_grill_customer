import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IOrderRequest } from '../models/order-request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderRequestApiService {

  baseURL: string;
  private _httpClient = inject(HttpClient);

  constructor() {
    this.baseURL = `${window.location.protocol}//${window.location.hostname}:8080/orders`;
  }

  sendOrder(body: IOrderRequest): Observable<IOrderRequest> {
    return this._httpClient.post<IOrderRequest>(`${this.baseURL}/new-order`, body);
  }

}
