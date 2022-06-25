import {switchMap} from 'rxjs/operators';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {from, Observable} from 'rxjs';

@Injectable()
export class TokenHttpInterceptor implements HttpInterceptor {

  constructor(public auth: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.headers.get('skip')) {
      // Get rid of skip
      const headers = request.headers
        .delete('skip');
      const requestClone = request.clone({
        headers
      });
      return next.handle(requestClone);
    }
    return from(this.auth.session())
      .pipe(
        switchMap(session => {
          const headers = request.headers
            .set('Authorization', ((session && session.idToken) ? (session.idToken.jwtToken) : null))
            .append('Content-Type', 'application/json');
          const requestClone = request.clone({
            headers
          });
          return next.handle(requestClone);
        })
      );
  }
}
