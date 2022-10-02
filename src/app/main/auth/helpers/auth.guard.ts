import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  constructor(private _router: Router, private _authenticationService: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot){
    const currentUser = this._authenticationService.currentUserValue;

    if (currentUser) {
      // check if route is restricted by role
      if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1){
        // role not authorised so redirect to not-authorized page
        this._router.navigate(['/accounts/login']);
        return false;
      }
      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this._router.navigate(['/accounts/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  
}