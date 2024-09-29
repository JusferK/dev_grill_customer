import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { INews } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {
  
  baserURL = 'http://192.168.10.23:8080/news';
  //baserURL = 'http://localhost:8080/news';
  private _httpClient = inject(HttpClient);

  constructor() {}

  getAllNews(): Observable<INews[]> {
    return this._httpClient.get<INews[]>(`${this.baserURL}/all-news`);
  }

}
