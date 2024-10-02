import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonText,
  IonRefresher,
  IonRefresherContent,
  PopoverController
} from '@ionic/angular/standalone';
import {
  cartOutline,
  ellipsisHorizontalOutline,
  addOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NgIf } from '@angular/common';
import { IMenu } from '../models/menu.model';
import { MenuApiService } from '../services/menu-api.service';
import { Subscription } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import { MenuDetailPagePage } from './menu-detail-page/menu-detail-page.page';
import { ICart } from '../models/cart.model';
import { CartService } from '../services/cart.service';
import { ToastController } from '@ionic/angular';
import { PopoverCartComponent } from './popover-cart/popover-cart.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonBadge,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    NgIf,
    CurrencyPipe,
    IonButton,
    IonText,
    IonRefresher,
    IonRefresherContent
  ],
})

export class Tab1Page implements OnInit {
  isLoading = signal<boolean>(true);
  menuList = signal<IMenu[]>([]);
  menuSuscription!: Subscription;
  numberOfItems = computed(() => this.cart().length);
  private _menuApiService = inject(MenuApiService);
  private _modelCtrl = inject(ModalController);
  private _cartService = inject(CartService);
  private _toastService = inject(ToastController);
  cart = signal<ICart[]>(this._cartService.getCart());
  private _popover = inject(PopoverController);

  constructor() {
    addIcons({ cartOutline, ellipsisHorizontalOutline, addOutline });
  }

  ngOnInit(): void {
    this.menuSuscription = this._menuApiService.getAllMenus().subscribe({
      next: (data: IMenu[]) => {
        this.menuList.set(data);
        setTimeout(() => {
          this.isLoading.set(false);
        }, 2000);
      },
    });
  }

  async addToCartHandler(menu: IMenu) {
    let itemInCart = false;
    let position: number = 0;
    let item_found: ICart;

    this.cart().forEach((item: ICart, index: number) => {
      if (item.menuIdMenu === menu.idMenu) {
        item.quantity++;
        item.subtotal = item.quantity * menu.price;
        itemInCart = true;
        position = index;
      }
      this._cartService.setCart('replace', undefined, this.cart());
    });

    item_found = this.cart()[position];

    if (!itemInCart) {
      const item: ICart = {
        menuIdMenu: menu.idMenu,
        menu_name: menu.name,
        photo: menu.photo,
        quantity: 1,
        subtotal: menu.price,
      };

      this._cartService.setCart('add', item);
      this.cart.update((prev) => [...prev, item]);
    }

    const toast = await this._toastService.create({
      message: (itemInCart) ? (
        `${item_found.quantity} items added for this menu`
      ) : (
        'Menu added to card'
      ),
      duration: 5000,
      position: 'bottom'
    });

    await toast.present();
  }

  async getMoreDetails(menu: IMenu) {
    const model = this._modelCtrl.create({
      component: MenuDetailPagePage,
      componentProps: {
        data: menu,
      },
      initialBreakpoint: 0.9,
    });

    (await model).present();

    (await model)
      .onDidDismiss()
      .then(() => this.cart.set(this._cartService.getCart()));
  }

  async openCartMenu(e: Event) {
    const popover = await this._popover.create({
      component: PopoverCartComponent,
      event: e
    });
    
    await popover.present();

    (await popover)
      .onDidDismiss()
      .then(() => this.cart.set(this._cartService.getCart()));
  }

  handleRefresh(e: any) {
    setTimeout(() =>{
      this.menuSuscription = this._menuApiService.getAllMenus().subscribe({
        next: (data: IMenu[]) => {
          this.menuList.set(data);
        },
      });

      e.target.complete();
    }, 2000)
  }

}