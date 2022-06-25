import {ICart, ICartItem} from '../models/cart.interface';
import {IOrder, IOrderItem} from '../models/order.interface';

export class OrderMapper {
  public static mapCartToOrder(receiptEmail: string, stripeToken: string, c: ICart): IOrder {
    console.log(c);
    const order: IOrder = {
      receiptEmail,
      stripeToken,
      netTotal: c.netTotal,
      grossTotal: c.grossTotal,
      taxRate: c.taxRate,
      taxTotal: c.taxTotal,
      orderItems: c.orderItems.map(OrderMapper.toOrderItem),
    };
    return order;
  }

  static toOrderItem(i: ICartItem): IOrderItem {
    console.log(i);
    const result: IOrderItem = {
      quantity: i.quantity,
      price: i.product.price,
      productId: i.product.productId,
      productName: i.product.name,
    };
    return result;
  }
}
