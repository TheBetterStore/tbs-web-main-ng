import { Component, OnInit } from '@angular/core';
import {IProduct} from '../../models/product.interface';
import {ProductService} from '../../services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService, MessageService} from 'primeng/api';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  isLoading = false;
  errorMsg: string;
  infoMsg: string;
  addQuantity = 1;

  product: IProduct;

  cols: any[];

  constructor(private productService: ProductService, private route: ActivatedRoute,
              private router: Router, private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private cartService: CartService) { }

  ngOnInit(): void {

    const productId = this.route.snapshot.paramMap.get('productId');
    this.loadProduct(productId);
  }

  loadProduct(productId: string): void {
    const self = this;

    self.isLoading = true;

    this.productService.getProduct(productId)
      .subscribe(
        p => {
          self.product = p;
          self.errorMsg = '';
          self.isLoading = false;
        },
        e => {
          self.messageService.add({
            severity: 'error',
            summary: 'Status retrieval failed',
            detail: e.message,
            life: 5000
          });
          self.errorMsg = e.message;
          self.isLoading = false;
        },
        () => {
        }
      );
  }

  onAddProduct(): void {
    this.cartService.addProduct(this.product, this.addQuantity);
    this.infoMsg = 'Product added';
    this.router.navigateByUrl('/cart');
  }

  onDeleteProduct(p): void {
    console.log(p);
    const cart = this.cartService.deleteProduct(p);
  }

}
