import {Component, OnInit, Output} from '@angular/core';
import {IProduct} from '../../models/product.interface';
import {ProductService} from '../../services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService, LazyLoadEvent, MessageService} from 'primeng/api';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})


export class ProductsComponent implements OnInit {

  isLoading = false;
  errorMsg: string;
  infoMsg: string;

  products: IProduct[];
  selectedProducts: any;


  maxRowsPerPage = 100;
  pageSize = 5;
  offset = 0;
  rowsPerPageList = [5, 25, 50, 100, this.maxRowsPerPage];

  selectedCategory='Books';
  isCategoryBooks = true;

  bookCols: any[];
  computerCols: any[];
  mobileCols: any[];
  sub: any;

  constructor(private productService: ProductService, private route: ActivatedRoute,
              private router: Router, private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private cartService: CartService) { }

  ngOnInit(): void {

    this.bookCols = [
      { field: 'imageUrl', header: '', width: '15%', filterMatchMode: 'contains' },
      { field: 'name', header: 'Name', width: '20%', filterMatchMode: 'contains' },
      { field: 'bookDetails.authors', header: 'Authors', width: '15%', filterMatchMode: 'contains' },
      { field: 'genre', header: 'Genre', width: '15%', filterMatchMode: 'contains' },
      { field: 'price', header: 'Price', width: '22%', filterMatchMode: 'contains', },
    ];

    this.computerCols = [
      { field: 'imageUrl', header: '', width: '15%', filterMatchMode: 'contains' },
      { field: 'name', header: 'Name', width: '20%', filterMatchMode: 'contains' },
      { field: 'brand', header: 'Brand', width: '15%', filterMatchMode: 'contains' },
      { field: 'price', header: 'Price', width: '22%', filterMatchMode: 'contains', },
    ];

    this.mobileCols = [
      { field: 'imageUrl', header: '', width: '10%', filterMatchMode: 'contains' },
      { field: 'brand', header: 'Make', width: '10%', filterMatchMode: 'contains' },
      { field: 'model', header: 'Model', width: '10%', filterMatchMode: 'contains' },
      { field: 'name', header: 'Name', width: '20%', filterMatchMode: 'contains' },
      { field: 'price', header: 'Price', width: '22%', filterMatchMode: 'contains', },
    ];

    this.sub = this.route.queryParams.subscribe(params => {
      console.log(params);
      this.selectedCategory = params.category || 'ALL';
      this.loadProducts(this.selectedCategory);
    });
  }

  loadProducts(category: string): void {
    const self = this;
    let sortOrder = 1; // Ascending, -1 = Descending
    let sortField = null;

    self.isLoading = true;
    self.products = [];
    self.selectedProducts = {};

    this.productService.getProducts(category, this.pageSize, this.offset, sortField, sortOrder, '')
      .subscribe(
        p => {
          self.products = p;
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

  onAddProduct(p: IProduct): void {
    const cart = this.cartService.addProduct(p);
    const self = this;
    this.selectedProducts = cart.orderItems;
    this.infoMsg = 'Product added';
    setTimeout(
      () => {
        this.errorMsg = '';
      }, 3000);
  }

  onDeleteProduct(p): void {
    console.log(p);
    const cart = this.cartService.deleteProduct(p);
    this.selectedProducts = cart.orderItems;
  }

}
