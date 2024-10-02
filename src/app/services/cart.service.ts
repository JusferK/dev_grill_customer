import { Injectable, signal } from '@angular/core';
import { ICart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart = signal<ICart[]>([]);

  constructor() {
    const pivot = localStorage.getItem('cart-list');

    if(pivot) {
      this.cart.set(JSON.parse(pivot));
    }

  }

  getCart(): ICart[] {
    return this.cart();
  }

  setCart(action: string, item?: ICart, itemsList?: ICart[]) {

    switch(action) {
      case 'remove':
        this.cart.update((prev) => prev.filter((cart_item) => cart_item.menuIdMenu !== item!.menuIdMenu));
        break;
      case 'add':
        this.cart.update((prev) => [...prev, item!]);
        break;
      case 'replace':
        this.cart.set(itemsList!);
        break;
      case 'clear':
        this.cart.set([]);
        localStorage.removeItem('cart-list');
        break;
    }

    if(this.cart().length > 0) {
      localStorage.setItem('cart-list', JSON.stringify(this.cart()));
    } else {
      localStorage.removeItem('cart-list');
    }

  }

}
