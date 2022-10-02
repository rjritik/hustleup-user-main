import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class SignupService {

  constructor(private _httpClient:HttpClient) { }
  /**
  * Post user signup
  */
  headerpass:any = {
    headers: new HttpHeaders({ 
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Headers': 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE, PATCH'
    })
  };
  signup(data:any){
    return this._httpClient.post(`${environment.apiUrl}/users/userSignup`,data, this.headerpass);
  }

  activateAccount(otpdata:any){
    return  this._httpClient.post(`${environment.apiUrl}/users/activateAccount`,otpdata, this.headerpass);
  }

  resendotp(resenddata:any){
    return  this._httpClient.post(`${environment.apiUrl}/users/resendOtp`,resenddata, this.headerpass);
  }

  varifyUserName(data:any){
    return  this._httpClient.post(`${environment.apiUrl}/users/varifyUserName`,data, this.headerpass);
  }

}
