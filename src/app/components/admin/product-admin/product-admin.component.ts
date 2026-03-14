import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {IProduct} from '../../../models/product.interface';
import {ProductService} from '../../../services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'app-product-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TableModule, DropdownModule],
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.scss']
})
export class ProductAdminComponent implements OnInit {

  isLoading = false;
  errorMsg = '';
  infoMsg = '';

  products: IProduct[] = [];
  selectedProducts: any;

  maxRowsPerPage = 100;
  pageSize = 5;
  offset = 0;
  rowsPerPageList = [5, 25, 50, 100, this.maxRowsPerPage];

  typeOptions = ['PHYSICAL', 'DIGITAL'];

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
    const sortOrder = 1;
    const sortField = '';

    self.isLoading = true;
    self.products = [];
    self.selectedProducts = {};

    this.productService.getProducts(category, this.pageSize, this.offset, sortField, sortOrder, '')
      .subscribe(
        (p: IProduct[]) => {
          self.products = p;
          self.errorMsg = '';
          self.isLoading = false;
        },
        (e: any) => {
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

  onRecEdited(rec: any): void {
    console.log('Rec edited');
  }

}
