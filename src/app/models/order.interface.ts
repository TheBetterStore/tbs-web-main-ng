export interface IOrder {
  orderId?: string;
  customerId?: string;
  receiptEmail?: string;
  stripeToken?: string;
  netTotal: number;
  grossTotal: number;
  taxRate: number;
  taxTotal: number;
  orderItems: IOrderItem[];
  createdTime?: string;
  lastUpdatedTime?: string;
}

export interface IOrderItem {
  quantity: number;
  productId: string;
  productName: string;
  price: number;
}
