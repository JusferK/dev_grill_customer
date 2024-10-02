import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IMenu } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuApiService {

  private _httpClient = inject(HttpClient);
  baseURL: string;

  constructor() {
    this.baseURL = `${window.location.protocol}//${window.location.hostname}:8080/menu`
  }

  getAllMenus(): Observable<IMenu[]> {
    return this._httpClient.get<IMenu[]>(`${this.baseURL}/all-menus`);
  }

}
