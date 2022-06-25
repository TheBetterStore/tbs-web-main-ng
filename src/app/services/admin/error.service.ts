import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../base.service';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ErrorService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getErrors(pageSize: number, offset: number, sortField: string, sortOrder: number, filters: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/admin/v1/errors?pagesize=${pageSize}&offset=${offset}`;

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
    const errors$ = this.http
      .get(url)
      .pipe(map(mapErrors))
      .pipe(catchError(this.handleError));
    return errors$;
  }

}

function mapErrors(response: any): any[] {
  const result = response.map(toError);
  console.log(result);
  return result;
}

function toError(r: any): any {
  const q = r;
  return q;
}
