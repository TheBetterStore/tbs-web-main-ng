import {Component, OnInit, Output} from '@angular/core';
import {IProduct} from '../../models/product.interface';
import {CartService} from '../../services/cart.service';
import {ICart, ICartItem} from '../../models/cart.interface';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  errorMsg: string;
  infoMsg: string;
  isLoading = false;
  selectedProducts: ICartItem[];
  cols;
  cart: ICart;

  constructor(private cartService: CartService) {
    this.cols = [
      { field: 'imageUrl', header: '', width: '15%', filterMatchMode: 'contains' },
      { field: 'name', header: 'Name', width: '20%', filterMatchMode: 'contains' },
      { field: 'brand', header: 'Brand', width: '15%', filterMatchMode: 'contains' },
      { field: 'quantity', header: 'Quantity', width: '15%', filterMatchMode: 'contains' },
      { field: 'price', header: 'Price', width: '22%', filterMatchMode: 'contains', },
      { width: '8em'}
    ];
  }


  ngOnInit(): void {
    this.initialise();
  }

  initialise(): void {
    this.isLoading = true;
    this.cart = this.cartService.getCart();

    this.selectedProducts = this.cart.orderItems;
    this.isLoading = false;
  }

  onAddProduct(p: ICartItem): void {
    const cart = this.cartService.addProduct(p.product);
    this.selectedProducts = cart.orderItems;
  }

  onDeleteProduct(p: ICartItem): void {
    console.log(p);
    const cart = this.cartService.deleteProduct(p);
    this.selectedProducts = cart.orderItems;
  }

}
