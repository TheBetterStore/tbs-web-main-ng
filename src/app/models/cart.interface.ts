import {IProduct} from './product.interface';

export interface ICart {
  netTotal: number;
  grossTotal: number;
  taxRate: number;
  taxTotal: number;
  orderItems: ICartItem[];
}

export interface ICartItem {
  quantity: number;
  product: IProduct;
}
