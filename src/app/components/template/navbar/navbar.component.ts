import {Component, OnInit, ChangeDetectorRef, NgZone} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {CartService} from '../../../services/cart.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';
import {ILogin} from '../../../models/login.interface';
import {BaseComponent} from "../../base.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent extends BaseComponent {

  firstname: string | undefined;
  cartItemCount = 0;
  isLoading = false;
  login!: ILogin;

  constructor(private ref: ChangeDetectorRef,
              private cartService: CartService,
              authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router) {
    super(authenticationService);
    cartService.cartEvent.subscribe(
      () => this.onCartChanged());

    this.authenticationService.loginEvent.subscribe(
      user => this.onLoginChanged(user)
    );
  }

  ngOnInit(): void {
    this.initialise();
  }

  async initialise(): Promise<void> {
    this.isLoading = true;
    this.setCartItemCount();
    await this.authenticationService.authenticate();
    this.isLoading = false;
  }

  setCartItemCount(): void {
    this.cartItemCount = 0;
    const cart = this.cartService.getCart();
    if (cart && cart.orderItems) {
      cart.orderItems.forEach(p => {
        this.cartItemCount += p.quantity;
      });
    }
  }

  onCartChanged(): void {
    this.setCartItemCount();
  }

  onLoginChanged(login: ILogin): void {
    const self = this;
    self.login = login;
  }

}
