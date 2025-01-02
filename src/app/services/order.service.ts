import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from './base.service';
import {ICart} from '../models/cart.interface';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';

import {IOrder} from '../models/order.interface';
import {DateUtils} from "../helpers/date-utils";

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getOrders(pageSize: number, offset: number, sortField: string, sortOrder: number, filters: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/order/v1/orders?pagesize=${pageSize}&offset=${offset}`;

    if (sortField) {
      let sSortOrder = 'ASC';
      if (sortOrder && sortOrder === -1) {
        sSortOrder = 'DESC';
      }
      url += `&sortfield=${sortField}&sortorder=${sSortOrder}`;
    }
    if (filters && Object.keys(filters).length > 0 ) {
      const sFilters = encodeURIComponent(JSON.stringify(filters));
      url += `&filters=${sFilters}`;
    }

    console.log('Calling url:' + url);
    const orders$ = this.http
      .get(url)
      .pipe(map(mapOrders))
      .pipe(catchError(this.handleError));
    return orders$;
  }

  sendOrder(order: IOrder): Observable<any> {
    console.log(`Sending order`);
    const url = `${environment.apiBaseUrl}/order/v1/orders`;

    console.log('Calling POST on url:' + url);
    console.log(JSON.stringify(order));
    const result$ = this.http
      .post(url, order)
      .pipe(catchError(this.handleError));
    return result$;
  }
}

function mapOrders(response: any): IOrder[] {
  const result = response.map(toOrder);
  return result;
}

function toOrder(r: any): IOrder {
  const q: IOrder = r;
  q.createdTimeLocal = DateUtils.getLocalDateFromIso(r.createdTime);
  q.lastUpdatedTimeLocal = DateUtils.getLocalDateFromIso(r.lastUpdatedTime);
  return q;
}

