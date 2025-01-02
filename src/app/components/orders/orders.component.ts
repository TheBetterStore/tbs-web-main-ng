import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {OrderService} from "../../services/order.service";
import {IOrder} from "../../models/order.interface";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  isLoading = false;
  errorMsg: string;
  infoMsg: string;

  orders: IOrder[];
  selectedOrders: any;


  maxRowsPerPage = 100;
  pageSize = 5;
  offset = 0;
  rowsPerPageList = [5, 25, 50, 100, this.maxRowsPerPage];

  orderCols: any[];
  sub: any;

  constructor(private orderService: OrderService, private route: ActivatedRoute,
              private router: Router, private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.orderCols = [
      { field: 'orderId', header: 'Order#', width: '15%', class: '', filterMatchMode: 'contains' },
      { field: 'createdTime', header: 'Date', width: '15%', class: '', filterMatchMode: 'contains' },
      { field: 'orderitems.length', header: 'Items', class: '', width: '10%', filterMatchMode: 'contains' },
      { field: 'grossTotal', header: 'Gross Total', width: '15%', class: 'tbs-col-rightalign', filterMatchMode: 'contains', },
      { field: 'netTotal', header: 'Net Total', width: '15%', class: '', filterMatchMode: 'contains' },

    ];

    this.loadOrders();
  }

  loadOrders(): void {
    const self = this;
    let sortOrder = 1; // Ascending, -1 = Descending
    let sortField = null;

    self.isLoading = true;
    self.orders = [];
    self.selectedOrders = {};

    this.orderService.getOrders(this.pageSize, this.offset, sortField, sortOrder, '')
      .subscribe(
        p => {
          self.orders = p;
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

}
