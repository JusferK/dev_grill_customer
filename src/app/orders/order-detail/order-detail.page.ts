import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent,
  IonHeader,
  IonTitle, 
  IonToolbar,
  IonSpinner,
  IonGrid,
  IonRow,
  IonItem,
  IonCol,
  IonButton,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonAccordion,
  IonLabel,
  IonAccordionGroup
} from '@ionic/angular/standalone';
import { IOrderRequest, Status } from 'src/app/models/order-request.model';
import { IMenu } from 'src/app/models/menu.model';
import { MenuApiService } from 'src/app/services/menu-api.service';

interface menuOrderRecordJoin {
  menu_name: string;
  photo: string;
  menu_price: number;
  quantity: number;
  subtotal: number;
}

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule, 
    FormsModule,
    IonSpinner,
    IonGrid,
    IonRow,
    IonItem,
    IonCol,
    IonButton,
    IonText,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    CurrencyPipe,
    DatePipe,
    IonAccordion,
    IonLabel,
    IonAccordionGroup
  ]
})
export class OrderDetailPage implements OnInit {

  orderInput = input.required<IOrderRequest>;
  order = signal<IOrderRequest | null>(null);
  isLoading = signal<boolean>(true);
  menuDetalList = signal<menuOrderRecordJoin[]>([]);
  private _menuApiService = inject(MenuApiService);

  ngOnInit(): void {
    this.order.set(this.orderInput as unknown as IOrderRequest); 
    
    this.order()?.menuOrderList.forEach((record) => {
      this._menuApiService.getMenu(record.menuIdMenu).subscribe({
        next: (menu: IMenu) => {

          const body: menuOrderRecordJoin = {
            menu_name: menu.name,
            photo: menu.photo,
            quantity: record.quantity,
            menu_price: menu.price,
            subtotal: record.quantity * menu.price
          }

          this.menuDetalList.update((prev) => [...prev, body]);

          if(this.menuDetalList().length === this.order()?.menuOrderList.length) {
            this.isLoading.set(false);
          }
        }
      })
    });
  }

  labelColor(status: Status): string {
    switch(status) {
      case Status.Pending:
        return 'warning'
      case Status.Cancelled:
        return 'danger';
      case Status.Progress:
        return 'primary';
      case Status.Completed:
        return 'success';
    }
  }

}
