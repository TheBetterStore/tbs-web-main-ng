import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {OrderService} from '../../services/order.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService, MessageService} from 'primeng/api';
import {IOrder} from '../../models/order.interface';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ToastModule, ConfirmDialogModule, ProgressSpinnerModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  isLoading = false;
  errorMsg = '';
  infoMsg = '';

  order!: IOrder;

  canCancel = true;
  cols: any[] = [];

  constructor(private orderService: OrderService, private route: ActivatedRoute,
              private router: Router, private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    this.loadOrder(orderId!);
  }

  loadOrder(orderId: string): void {
    const self = this;
    self.isLoading = true;

    this.orderService.getOrder(orderId)
      .subscribe(
        (o: IOrder) => {
          self.order = o;
          self.errorMsg = '';
          self.isLoading = false;
          console.log(o);
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

}
