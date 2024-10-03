import { Component, computed, inject, input, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonSpinner,
  IonText,
  IonIcon,
  IonAccordionGroup,
  IonLabel,
  IonAccordion,
  IonItem,
  IonList,
  IonFooter
 } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { IMenu } from 'src/app/models/menu.model';
import { IIngredient } from 'src/app/models/ingredient.model';
import { CurrencyPipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { 
  cartOutline,
  removeOutline,
  addOutline 
} from 'ionicons/icons';
import { CartService } from 'src/app/services/cart.service';
import { ICart } from 'src/app/models/cart.model';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-menu-detail-page',
  templateUrl: './menu-detail-page.page.html',
  styleUrls: ['./menu-detail-page.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    IonButtons,
    IonSpinner,
    IonText,
    CurrencyPipe,
    IonIcon,
    IonAccordionGroup,
    IonLabel,
    IonAccordion,
    IonItem,
    IonList,
    IonFooter
  ]
})
export class MenuDetailPagePage implements OnInit {

  quantity = signal<number>(1);
  data = input.required<IMenu>;
  menuInfo = signal<IMenu | null>(null);
  ingredientList = signal<IIngredient[]>([]);
  private _modalCtrl = inject(ModalController);
  private _cartService = inject(CartService);
  inCartAR = signal<boolean>(false);
  subtotal = computed(() => {
    const menu = this.menuInfo();
    const price = menu?.price ?? 0;
    return price * (this.quantity() ?? this.quantity()); 
  });
  cart = signal<ICart[]>([]);
  private _toastService = inject(ToastController);

  constructor() {
    addIcons({ cartOutline, removeOutline, addOutline });
  }

  ngOnInit(): void {
    this.menuInfo.set(this.data as unknown as IMenu);

    this.cart.set(this._cartService.getCart());

    this.cart().forEach((item) => {
      if(item.menuIdMenu === this.menuInfo()?.idMenu) {
        this.quantity.set(item.quantity);
        this.inCartAR.set(true);
      }
    });
  }

  async increment() {
    this.quantity.update((prev) => prev + 1);

    if(this.inCartAR()) {
      this.updateCard(this.quantity());
  
      const toast = await this._toastService.create({
        message: `Increase quantity to ${this.quantity()}`,
        duration: 2000,
        position: 'bottom'
      });
  
      await toast.present();

    }
  }

  async decrement() {
    this.quantity.update((prev) => prev - 1);
    this.updateCard(this.quantity());

    if(this.inCartAR()) {
      const toast = await this._toastService.create({
        message: `Decreace quantity to ${this.quantity()}`,
        duration: 2000,
        position: 'bottom'
      });
  
      await toast.present();
    }
  }

  goBack() {
    this._modalCtrl.dismiss();
  }

  updateCard(quantity: number) {
    const tempCart: ICart[] = this.cart();

    tempCart.forEach((cart_item) => {
      if(cart_item.menuIdMenu === this.menuInfo()?.idMenu) {
        cart_item.quantity = quantity;
        cart_item.subtotal = quantity * this.menuInfo()?.price!;
      }
    });

    this._cartService.setCart('replace', undefined, tempCart);
  }

  async removeSelectedMenu() {
    const item_cart: ICart = this.cart().find((cart_i) => cart_i.menuIdMenu === this.menuInfo()?.idMenu)!;

    this._cartService.setCart('remove', item_cart);
    this._modalCtrl.dismiss();

    const toast = await this._toastService.create({
      message: `${item_cart.menu_name} removed`,
      duration: 2000,
      position: 'bottom'
    });

    await toast.present();
  }

  async addToCart() {
    const add_cart_item: ICart = {
      menu_name: this.menuInfo()?.name!,
      menuIdMenu: this.menuInfo()?.idMenu!,
      photo: this.menuInfo()?.photo!,
      quantity: this.quantity(),
      subtotal: this.quantity() * this.menuInfo()?.price!
    }

    this._cartService.setCart('add', add_cart_item);

    this._modalCtrl.dismiss();

    const toast = await this._toastService.create({
      message: `${add_cart_item.quantity} ${add_cart_item.menu_name} added to cart.`,
      duration: 2000,
      position: 'bottom'
    });

    await toast.present();
  }

}