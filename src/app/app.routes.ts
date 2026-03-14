import {RouterModule, Routes} from '@angular/router';
import {AboutComponent} from "./components/about/about.component";
import {LoginComponent} from "./components/login/login.component";
import {AuthGuard} from "./guards/auth.guard";
import {HomeComponent} from "./components/home/home.component";
import {LogoutComponent} from "./components/logout/logout.component";
import {OrdersComponent} from "./components/orders/orders.component";
import {OrderComponent} from "./components/order/order.component";
import {ProductsComponent} from "./components/products/products.component";
import {ProductComponent} from "./components/product/product.component";
import {CartComponent} from "./components/cart/cart.component";
import {CheckoutComponent} from "./components/checkout/checkout.component";
import {ProductAdminComponent} from "./components/admin/product-admin/product-admin.component";
import {NgModule} from "@angular/core";

export const routes: Routes = [{
  path: 'home',
  component: HomeComponent
},
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'orders',
    component: OrdersComponent, canActivate: [AuthGuard]
  },
  {
    path: 'orders/:orderId',
    component: OrderComponent, canActivate: [AuthGuard]
  },
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: 'products/:productId',
    component: ProductComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent, canActivate: [AuthGuard]
  },
  {
    path: 'admin/products',
    component: ProductAdminComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
