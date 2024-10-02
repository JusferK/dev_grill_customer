import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { INews } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {
  
  baserURL: string;
  private _httpClient = inject(HttpClient);

  constructor() {
    this.baserURL = `${window.location.protocol}//${window.location.hostname}:8080/news`
  }

  getAllNews(): Observable<INews[]> {
    return this._httpClient.get<INews[]>(`${this.baserURL}/all-news`);
  }

}
