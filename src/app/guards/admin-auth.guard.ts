import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {CognitoUser} from '@aws-amplify/auth';
import {Auth} from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(private router: Router) {
  }
  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      Auth.currentAuthenticatedUser({
        bypassCache: false
      })
        .then((user: CognitoUser) => {
            if (user) {
              {
                const payload = user.getSignInUserSession().getAccessToken().payload;
                const groups = payload['cognito:groups'];

                if (groups && groups.includes('MohAdministrators')) {
                  resolve(true);
                }
              }
            }
            resolve(false);
          }
        )
        .catch(() => {
          this.router.navigate(['/login']);
          resolve(false);
        });
    });
  }

}
