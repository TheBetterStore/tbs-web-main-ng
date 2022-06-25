import {Component, OnDestroy, OnInit, ChangeDetectorRef, NgZone} from '@angular/core';
import { onAuthUIStateChange, CognitoUserInterface, AuthState } from '@aws-amplify/ui-components';
import {AmplifyService} from 'aws-amplify-angular';
import { CognitoUser } from '@aws-amplify/auth';
import { Auth } from 'aws-amplify';
import {IProduct} from '../../../models/product.interface';
import {CartService} from '../../../services/cart.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';
import {IUser} from '../../../models/user.interface';
import {ILogin} from '../../../models/login.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  authState: AuthState | undefined;
  firstname: string | undefined;
  cartItemCount = 0;
  user: CognitoUser;
  isLoading = false;
  login: ILogin;

  constructor(public amplify: AmplifyService,
              private ref: ChangeDetectorRef,
              private cartService: CartService,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private ngZone: NgZone,
              private router: Router) {

    cartService.cartEvent.subscribe(
      x => this.onCartChanged());

    authenticationService.loginEvent.subscribe(
      user => this.onLoginChanged(user)
    );
  }

  ngOnInit(): void {
    this.initialise();
  }

  async initialise(): Promise<void> {
    this.isLoading = true;
    this.setCartItemCount();
    this.user = await this.authenticationService.authenticate();
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
    console.log('Entered Navigation.onLoginChanged');
    const self = this;
    if (login) {
      console.log('Logged in: ' + login.firstname);
    }
    self.login = login;
  }

  isAdmin(): boolean {
    if (this.login && this.login.groups && this.login.groups.find(x => x === 'Administrators')) {
      return true;
    }
    return false;
  }
}
