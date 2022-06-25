import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';

import {StripeCardElementOptions, StripeElementsOptions} from '@stripe/stripe-js';
import {StripeCardComponent, StripeService} from 'ngx-stripe';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {CartService} from '../../services/cart.service';
import {ICart} from '../../models/cart.interface';
import {OrderService} from '../../services/order.service';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {IOrder} from '../../models/order.interface';
import {OrderMapper} from '../../mappers/order-mapper';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements OnInit {
  isLoading = false;
  totalAmount = 0;
  errorMsg: string;
  infoMsg: string;

  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  cardOptions: StripeCardElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: 'Roboto, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: 'rgb(108,117,125)'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en-NZ',
    appearance: {
      theme: 'stripe'
    }
  };

  stripeTest: FormGroup;

  cart: ICart;


  constructor(private cd: ChangeDetectorRef,
              private messageService: MessageService,
              private cartService: CartService,
              private orderService: OrderService,
              private fb: FormBuilder, private stripeService: StripeService,
              private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.isLoading = false;
    const cart = this.cartService.getCart();
    this.totalAmount = cart.netTotal;
    this.stripeTest = this.fb.group({
      email: ['', [Validators.required]],
      name: ['', [Validators.required]]
    });
  }

  createToken(): void {
    const self = this;
    self.isLoading = true;
    const name = this.stripeTest.get('name').value;
    const email = this.stripeTest.get('email').value;
    this.stripeService
      .createToken(this.card.element, { name })
      .subscribe((result) => {
        if (result.token) {
          // Use the token
          console.log(result.token.id);

          const cart: ICart = this.cartService.getCart();
          const order: IOrder = OrderMapper.mapCartToOrder(email, result.token.id, cart);

          self.orderService.sendOrder(order)
            .subscribe(o => {
              self.isLoading = false;
              self.cartService.clear();
              self.messageService.add({
                severity: 'success',
                summary: 'Payment succeeded', detail: `Order ${o.orderId} has been created, an order receipt is on its way`, life: 5000
              });
              setTimeout(
                () => {
                  self.router.navigate(['/products']);
                }, 3000);
            }, e => {
                    self.isLoading = false;
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Status retrieval failed',
                      detail: e.message,
                      life: 5000
                    });
                    self.errorMsg = e.message;
                  }
                );
            } else if (result.error) {
          self.isLoading = false;
          // Error creating the token
          console.log(result.error.message);
          self.messageService.add({severity: 'error',
            summary: 'Payment failed', detail: result.error.message, life: 5000});
          self.errorMsg = result.error.message;
        }
      });
  }
}
