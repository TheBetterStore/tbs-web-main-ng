import {EventEmitter, Injectable, Output} from '@angular/core';
import {Auth} from 'aws-amplify';
import {CognitoUser} from '@aws-amplify/auth';
import {from, Observable} from 'rxjs';
import {ILogin} from '../models/login.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  @Output() loginEvent: EventEmitter<any> = new EventEmitter();

  private loggedIn = false;

  constructor() { }

  emitUser(login: ILogin): void {

    this.loginEvent.emit(login);
  }

  async authenticate(): Promise<CognitoUser> {
    const self = this;
    let firstname;

    try {
      const user: CognitoUser = await Auth.currentAuthenticatedUser();
      self.loggedIn = true;
      console.log(user);
      const groups = user.getSignInUserSession().getAccessToken().payload['cognito:groups'];
      console.log(groups);
      user.getUserAttributes( (a, r) => {
        if (r) {
          console.log(r);
          firstname =  r.find(o => o.Name === 'given_name').Value;
          const login: ILogin = {
            firstname,
            groups
          };
          this.loginEvent.emit(login);
        }
      });
      return user;
    } catch (e) {
      console.log('Failed auth');
      this.loginEvent.emit('');
    }
  }

  async logout(): Promise<any> {
    await Auth.signOut();
    this.loginEvent.emit('');
  }

  public session(): Observable<any> {
    return from(Auth.currentSession());
  }
}
