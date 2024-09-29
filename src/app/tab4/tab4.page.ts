import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent
 } from '@ionic/angular/standalone';
import { NewsApiService } from '../services/news-api.service';
import { Subscription } from 'rxjs';
import { INews } from '../models/news.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    DatePipe
  ]
})
export class Tab4Page implements OnInit, OnDestroy {

  newsItems = signal<INews[]>([]);
  newsServiceSuscription!: Subscription;
  private _newsApiService = inject(NewsApiService);

  constructor() {}

  ngOnInit() {
    this.newsServiceSuscription = this._newsApiService.getAllNews().subscribe({
      next: (data: INews[]) => {
        this.newsItems.set(data);
        console.log(this.newsItems());
      }
    });
    
  }

  ngOnDestroy(): void {
    this.newsServiceSuscription.unsubscribe();
  }

}
