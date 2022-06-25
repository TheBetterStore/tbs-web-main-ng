import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthState, CognitoUserInterface, FormFieldTypes, onAuthUIStateChange} from '@aws-amplify/ui-components';
import {Auth} from 'aws-amplify';
import {AuthenticationService} from '../../services/authentication.service';
import {CognitoUser} from '@aws-amplify/auth';
import {ILogin} from '../../models/login.interface';
import {AmplifyService} from 'aws-amplify-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formFields: any;
  user: CognitoUserInterface| undefined;
  authState: AuthState;

  constructor(private amplifyService: AmplifyService,
              private authenticationService: AuthenticationService,
              private ngZone: NgZone,
              private router: Router, private ref: ChangeDetectorRef) {

    this.formFields = {
      signUp: {
        email: {
          order: 1
        },

        given_name: {
          order: 2,
          placeholder: "Firstname"
        },
        family_name: {
          order: 4,
          placeholder: "Surname"
        },
        password: {
          order: 5
        },
        confirm_password: {
          order: 6
        }
      },
      signIn: {
        username: {
          labelHidden: false,
          placeholder: 'Enter Your Email Here',
          isRequired: true,
          label: 'Email:'
        },
      }
    }
  }

  ngOnInit(): void {

    this.amplifyService.authStateChange$.subscribe(({state, user}) => {

      this.user = user;
      if (state === 'signedIn') {
        console.log('Got here1');
        console.log(user);
        if (this.user && this.user.attributes) {
          console.log('Got here2');

          const attributes = this.user.attributes;
          const groups = this.user.getSignInUserSession().getAccessToken().payload['cognito:groups'];

          const login: ILogin = {
            firstname: attributes.given_name,
            groups
          };
          this.authenticationService.emitUser(login);
          this.ngZone.run(() => {
            this.router.navigate(['/home']);
          });
        }
        this.router.navigate(['/home'])
      } else {
        this.authenticationService.emitUser(null);
      }
    })

  }

}
