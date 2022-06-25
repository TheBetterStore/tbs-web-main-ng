import { Component, OnInit } from '@angular/core';
import {IProduct} from '../../../models/product.interface';
import {ProductService} from '../../../services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'app-product-admin',
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.scss']
})
export class ProductAdminComponent implements OnInit {

  isLoading = false;
  errorMsg: string;
  infoMsg: string;

  products: IProduct[];
  selectedProducts: any;

  maxRowsPerPage = 100;
  pageSize = 5;
  offset = 0;
  rowsPerPageList = [5, 25, 50, 100, this.maxRowsPerPage];

  typeOptions = ['PHYSICAL', 'DIGITAL']

  cols = [
    { field: 'imageUrl', header: '', width: '10%', filterMatchMode: 'contains' },
    { field: 'name', header: 'Name', width: '20%', filterMatchMode: 'contains' },
    { field: 'sku', header: 'SKU', width: '10%', filterMatchMode: 'contains' },
    { field: 'type', header: 'Type', width: '10%', filterMatchMode: 'contains' },
    { field: 'brand', header: 'Brand', width: '15%', filterMatchMode: 'contains' },
    { field: 'hitCount', header: 'Hits', width: '10%', filterMatchMode: 'contains' },
    { field: 'price', header: 'Price', width: '10%', filterMatchMode: 'contains', },

  ];

  constructor(private productService: ProductService, private route: ActivatedRoute,
              private router: Router, private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.loadProducts('ALL');
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

  onRecEdited(rec) {
    console.log('Rec ediited');
  }

}
