import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/template/navbar/navbar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AmplifyService} from 'aws-amplify-angular';
import { AboutComponent } from './components/about/about.component';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TableModule} from 'primeng/table';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { ProductsComponent } from './components/products/products.component';
import { CartComponent } from './components/cart/cart.component';
import { FooterComponent } from './components/template/footer/footer.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import {NgxStripeModule} from 'ngx-stripe';
import { OrdersComponent } from './components/orders/orders.component';
import { ErrorsComponent } from './components/admin/errors/errors.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { ProductComponent } from './components/product/product.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import {TokenHttpInterceptor} from './services/token-http-interceptor';
import {AmplifyAuthenticatorModule} from '@aws-amplify/ui-angular';
import { ProductAdminComponent } from './components/admin/product-admin/product-admin.component';
import {MultiSelectModule} from 'primeng/multiselect';
import {PickListModule} from 'primeng/picklist';
import {DropdownModule} from 'primeng/dropdown';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    AboutComponent,
    ProductsComponent,
    CartComponent,
    FooterComponent,
    CheckoutComponent,
    OrdersComponent,
    ErrorsComponent,
    ProductComponent,
    LoginComponent,
    LogoutComponent,
    ProductAdminComponent
  ],
  imports: [
    BrowserModule,
    AmplifyAuthenticatorModule,
    AppRoutingModule,
    ConfirmDialogModule,
    HttpClientModule,
    FormsModule,
    MessagesModule,
    MessageModule,
    MultiSelectModule,
    PickListModule,
    BrowserAnimationsModule,
    TableModule,
    ProgressSpinnerModule,
    ToastModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot('pk_test_bNJSBFzdWS7HFT4QIN7jkIDB'),
    DropdownModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: TokenHttpInterceptor, multi: true}, AmplifyService, MessageService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
