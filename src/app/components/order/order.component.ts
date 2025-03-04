import { Component, OnInit } from '@angular/core';
import {OrderService} from "../../services/order.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {IOrder} from "../../models/order.interface";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  isLoading = false;
  errorMsg: string;
  infoMsg: string;

  order: IOrder;

  canCancel = true;
  cols: [];

  constructor(private orderService: OrderService, private route: ActivatedRoute,
              private router: Router, private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    this.loadOrder(orderId);
  }

  loadOrder(orderId: string) {
    const self = this;
    self.isLoading = true;

    this.orderService.getOrder(orderId)
      .subscribe(
        o => {
          self.order = o;
          self.errorMsg = '';
          self.isLoading = false;
          console.log(o);
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
