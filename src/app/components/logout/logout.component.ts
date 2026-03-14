import {Component, NgZone, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private ngZone: NgZone) { }

  ngOnInit(): void {
    console.log('Signing out...');
    this.logout();
  }

  async logout(): Promise<any> {
    await this.authenticationService.logout();
    this.ngZone.run(() => {
      this.router.navigate(['/login']);
    });
  }
}
