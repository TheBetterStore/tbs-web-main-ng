import {EventEmitter, Injectable, Output} from '@angular/core';
import {ICart, ICartItem} from '../models/cart.interface';
import {IProduct} from '../models/product.interface';
import {IOrderItem} from '../models/order.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  readonly TAX_RATE = 0.15;

  @Output() cartEvent: EventEmitter<any> = new EventEmitter();
  constructor() { }

  clear(): void {
    localStorage.setItem('cart', JSON.stringify(this.getEmptyCart()));
    this.cartEvent.emit();
  }

  getCart(): ICart {
    let cart = JSON.parse(localStorage.getItem('cart'));

    if (!cart || !cart.orderItems) {
      cart = this.getEmptyCart();
    }
    return cart;
  }

  getEmptyCart(): ICart {
    const c: ICart = {
      orderItems: [],
      taxTotal: 0,
      taxRate: this.TAX_RATE,
      netTotal: 0,
      grossTotal: 0
    };
    return c;
  }

  addProduct(p: IProduct, quantity = 1): ICart {
    if (!quantity) {
      quantity = 1;
    }

    let cart: ICart = JSON.parse(localStorage.getItem('cart'));
    let q;
    if (cart) {
      q = cart.orderItems.find(x => x.product.productId === p.productId);
    } else {
      cart = this.getEmptyCart();
    }

    if (q) {
      q.quantity += quantity;
    }
    else {
      const item: ICartItem = {
        quantity: 1,
        product: p,
      };

      cart.orderItems.push(item);
    }

    this.storeCart(cart);
    this.cartEvent.emit();
    return cart;
  }

  deleteProduct(p: ICartItem): ICart {

    let cart: ICart = JSON.parse(localStorage.getItem('cart'));
    console.log(`Product: ${JSON.stringify(p)}`);

    if (cart) {
      cart.orderItems = cart.orderItems.filter(x => x.product.productId !== p.product.productId);
    }
    else {
      cart = this.getEmptyCart();
    }

    console.log(cart);
    this.storeCart(cart);
    this.cartEvent.emit();
    return cart;
  }

  calculateTotals(cart: ICart): ICart {
    cart.netTotal = 0;
    cart.orderItems.forEach(item => {
      const p = item.product as IProduct;
      cart.netTotal += p.price * item.quantity;
    });
    cart.grossTotal = cart.netTotal - (cart.netTotal * cart.taxRate) / (1 + cart.taxRate);
    cart.taxTotal = cart.netTotal - cart.grossTotal;
    return cart;
  }

  storeCart(cart: ICart): void {
    cart = this.calculateTotals(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}
