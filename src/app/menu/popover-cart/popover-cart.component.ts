import { Component, computed, inject, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonContent,
  IonIcon,
  IonSpinner,
  IonButton,
  IonText,
  IonBackdrop,
  PopoverController,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';
import { ICart } from 'src/app/models/cart.model';
import { IUser } from 'src/app/models/user.model';
import { CartService } from 'src/app/services/cart.service';
import { ProfileSessionService } from 'src/app/services/profile-session.service';
import { CurrencyPipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { removeOutline, trashOutline, checkmarkOutline, alertOutline } from 'ionicons/icons';
import { IOrderRequest, Status } from 'src/app/models/order-request.model';
import { IMenuOrder } from 'src/app/models/menu-order.model';
import { OrderRequestApiService } from 'src/app/services/order-request-api.service';
import { Subscription } from 'rxjs';
import { UserApiService } from 'src/app/services/user-api.service';

@Component({
  selector: 'app-popover-cart',
  standalone: true,
  templateUrl: './popover-cart.component.html',
  styleUrls: ['./popover-cart.component.scss'],
  imports: [
    IonContent,
    IonIcon,
    IonSpinner,
    IonButton,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel,
    IonBackdrop,
    CurrencyPipe
  ]
})
export class PopoverCartComponent implements OnInit, OnDestroy {

  cart = signal<ICart[]>([]);
  isLoading = signal<boolean>(false);
  userProfile!: Signal<IUser>;
  total = computed(() => {
    let value = 0;
    this.cart().forEach((cart_item) => value += cart_item.subtotal);
    return value;
  });
  orderSuscription?: Subscription;
  private _cartService = inject(CartService);
  private _profileService = inject(ProfileSessionService);
  private _popover = inject(PopoverController);
  private _orderApiService = inject(OrderRequestApiService);
  private _toastService = inject(ToastController);
  private _loadingCtrl = inject(LoadingController);
  private _userApiService = inject(UserApiService);

  constructor() {
    addIcons({ removeOutline, trashOutline, checkmarkOutline, alertOutline });
    this.userProfile = signal<IUser>(this._profileService.getProfileSession());
  }

  ngOnInit(): void {
    this.cart.set(this._cartService.getCart());
  }

  ngOnDestroy(): void {
    this.orderSuscription?.unsubscribe();
  }

  increment(item: ICart) {
    this.cart.update((prev) => {
      return prev.map((cart_item) => {
        if(cart_item.menuIdMenu === item.menuIdMenu) {
          let individualPrice = cart_item.subtotal / cart_item.quantity;
          cart_item.quantity++;
          cart_item.subtotal = cart_item.quantity * individualPrice;
          return cart_item;
        } else {
          return cart_item;
        }
      });
    });

    this._cartService.setCart('replace', undefined, this.cart());
  }

  decrement(item: ICart) {
    this.cart.update((prev) => {
      return prev.map((cart_item) => {
        if(cart_item.menuIdMenu === item.menuIdMenu) {
          let individualPrice = cart_item.subtotal / cart_item.quantity;
          cart_item.quantity--;
          cart_item.subtotal = cart_item.quantity * individualPrice;
          return cart_item;
        } else {
          return cart_item;
        }
      });
    });

    this._cartService.setCart('replace', undefined, this.cart());
  }

  removeItemCart(item: ICart) {
    this.cart.update((prev) => {
      return prev.filter((cart_item) => cart_item.menuIdMenu !== item.menuIdMenu);
    });

    this._cartService.setCart('replace', undefined, this.cart());
  }

  closePop() {
    this._popover.dismiss();
  }

  clearCart() {
     this._cartService.setCart('clear');
     this.cart.set([]);
  }

  sendOrder() {

    this.isLoading.set(true);
    this._loadingCtrl.create({
      backdropDismiss: false,
      spinner: 'crescent',
      cssClass: 'transparent-loader'
    }).then((e) => e.present());
    const menuOrderListBody: IMenuOrder[] = [];

    this.cart().forEach((item) => {
      menuOrderListBody.push({
        quantity: item.quantity,
        menuIdMenu: item.menuIdMenu
      });
    });

    const body: IOrderRequest = {
      orderDateTime: new Date(),
      totalDue: this.total(),
      status: Status.Pending,
      lastStatusUpdate: new Date(),
      userEmail: this.userProfile().email,
      menuOrderList: menuOrderListBody
    }

    this.orderSuscription = this._orderApiService.sendOrder(body).subscribe({
      next: () => {
        this._userApiService.getOrderMade(this.userProfile().email).subscribe({
          next: (data: IOrderRequest[]) => {
            this.userProfile().orderRequestList = data;
            this._profileService.setProfileSession(this.userProfile());
            setTimeout(() => {
              this.clearCart();
              this.isLoading.set(false);
              this._loadingCtrl.dismiss();
              this._toastService.create({
                message: 'Order was placed successfully',
                duration: 2000,
                position: 'bottom',
                icon: 'checkmark-outline'
              })
              .then((e) => e.present());
            }, 1000);
          }
        })

      },
      error: () => {
        setTimeout(() => {
          this.isLoading.set(false);
          this._loadingCtrl.dismiss();
          this._toastService.create({
            message: 'There was a problem, try again later.',
            duration: 2000,
            position: 'bottom',
            icon: 'alert-outline'
          })
          .then((e) => e.present());
        }, 1000)
      }
    })
  }

}