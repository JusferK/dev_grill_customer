import { Component, computed, inject, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  IonLabel,
  IonIcon,
  ModalController,
  LoadingController,
  ToastController
 } from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';
import { IOrderRequest, Status } from '../models/order-request.model';
import { UserApiService } from '../services/user-api.service';
import { ProfileSessionService } from '../services/profile-session.service';
import { IUser } from '../models/user.model';
import { Subscription } from 'rxjs';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { sadOutline, addOutline } from 'ionicons/icons';
import { OrderDetailPage } from './order-detail/order-detail.page';
import { OrderRequestApiService } from '../services/order-request-api.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    NgIf,
    IonSpinner,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonButton,
    IonRefresher,
    IonRefresherContent,
    IonLabel,
    DatePipe,
    CurrencyPipe,
    RouterLink,
    IonIcon
  ]
})
export class Tab2Page implements OnInit, OnDestroy{

  isLoading = signal<boolean>(true);
  orders = signal<IOrderRequest[]>([]);
  user!: Signal<IUser>;
  orderSuscription!: Subscription;
  orderListIsEmpty = computed(() => this.orders().length === 0);
  private _userApiService = inject(UserApiService);
  private _profileSessionService = inject(ProfileSessionService);
  private _modelCtrl = inject(ModalController);
  private _orderApiService = inject(OrderRequestApiService);
  private _loadingCtrl = inject(LoadingController);
  private _toastService = inject(ToastController);

  constructor() {
    addIcons({ sadOutline, addOutline });
  }

  ngOnInit(): void {
    this.user = signal<IUser>(this._profileSessionService.getProfileSession());
    this.orderSuscription = this._userApiService.getOrderMade(this.user().email).subscribe({
      next: (data: IOrderRequest[]) => {
        this.orders.set(data);
        this.user().orderRequestList = data;
        this._profileSessionService.setProfileSession(this.user());
        this.isLoading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.orderSuscription.unsubscribe();
  }

  handleRefresh(e: any) {
    setTimeout(() => {
      this.orderSuscription.unsubscribe();
      this.orderSuscription = this._userApiService.getOrderMade(this.user().email).subscribe({
        next: (data: IOrderRequest[]) => {
          this.orders.set(data);
          this.user().orderRequestList = data;
          this._profileSessionService.setProfileSession(this.user());
          e.target.complete();
        }
      });
    }, 1000);
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

  async viewOrderDetails(order: IOrderRequest) {
    this._modelCtrl.create({
      component: OrderDetailPage,
      componentProps: {
        orderInput: order
      },
      initialBreakpoint: .90,
      cssClass: 'modal-content'
    })
    .then((e) => e.present());
  }

  cancelOrder(e: Event, order: IOrderRequest) {

    this._loadingCtrl.create({
      backdropDismiss: false,
      spinner: 'crescent',
      cssClass: 'transparent-loader'
    }).then((e) => e.present());

    order.status = Status.Cancelled;
    order.lastStatusUpdate = new Date();
    
    this._orderApiService.updateOrder(order).subscribe({
      next: () => {
        this.orderSuscription = this._userApiService.getOrderMade(this.user().email).subscribe({
          next: (data: IOrderRequest[]) => {
            this.orders.set(data);
            this.user().orderRequestList = data;
            this._profileSessionService.setProfileSession(this.user());

            setTimeout(() => {
              this._loadingCtrl.dismiss();
              this._toastService.create({
                message: 'Order was cancelled',
                duration: 2000,
                position: 'bottom'
              })
              .then((e) => e.present());
            }, 2000);


          }
        });
      }
    });

    e.stopPropagation();
  }

}
