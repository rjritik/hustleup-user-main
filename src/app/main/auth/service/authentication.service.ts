import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { User,Role } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  navbarsub = new Subject<boolean>();
  shopCartIcon = new Subject<boolean>();
  //public
  public currentUser: Observable<User>;

  //private
  private currentUserSubject: BehaviorSubject<any>;
  
  constructor(private _http:HttpClient) {
    const currentUserJson:any = localStorage.getItem('currentUser');
    // let decoded:any = window.atob(currentUserJson);
    // this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(decoded));
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(currentUserJson));
    this.currentUser = this.currentUserSubject.asObservable();
  }

    // getter: currentUserValue
    public get currentUserValue(): User {
      return this.currentUserSubject.value;
    }   

    /**
   *  Confirms if user is User
   */
     get isUser() {
      return this.currentUser && this.currentUserSubject.value.role === Role.User;
    }
  
    /**
     *  Confirms if user is Seller
    */
    get isSeller() {
      return this.currentUser && this.currentUserSubject.value.role === Role.Seller;
    }
  
    /**
     *  Confirms if user is Influencer
     */  
    get isInfluencer() {
      return this.currentUser && this.currentUserSubject.value.role === Role.Influencer;
    }
  

  login(data:any){
    return this._http
      .post<any>(`${environment.apiUrl}/users/userLogin`, data)
      .pipe(map(user => {
          // login successful if there's a jwt token in the response
          if (user && user.token){
            // store user details and jwt token in local storage to keep user logged in between page refreshes

            // let encoded = window.btoa(JSON.stringify(user));
            // localStorage.setItem('currentUser', encoded);
            localStorage.setItem('currentUser', JSON.stringify(user))
            // notify
            this.currentUserSubject.next(user);
          }
          return user;
        })
      );
  }

  /**
 * User logout
 *
 */
    logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // notify
    this.currentUserSubject.next(null);
  }
}
