import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseService} from './base.service';
import {environment} from '../../environments/environment';
import {IProduct} from '../models/product.interface';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getProducts(category: string, pageSize: number, offset: number, sortField: string, sortOrder: number, filters: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/product/v1/products?category=${category}&pagesize=${pageSize}&offset=${offset}`;

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
    console.log('Calling GET on url:' + url);
    const products$ = this.http
      .get(url, {headers: {
        skip: 'true'
        }})
      .pipe(map(mapProducts))
      .pipe(catchError(this.handleError));
    return products$;
  }

  getProduct(productId: string): Observable<any> {
    const url = `${environment.apiBaseUrl}/product/v1/products/${productId}`;

    console.log('Calling GET on url:' + url);
    const products$ = this.http
      .get(url, {headers: {
          skip: 'true'
        }})
      .pipe(map(toProduct))
      .pipe(catchError(this.handleError));
    return products$;
  }
}

function mapProducts(response: any): IProduct[] {
  const result = response.map(toProduct);
  return result;
}

function toProduct(r: any): IProduct {
  const q: IProduct = r;
  return q;
}
