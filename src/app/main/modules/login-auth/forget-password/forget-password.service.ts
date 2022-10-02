import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {

  constructor(private _HttpClient:HttpClient) { }

  headerpass:any = {
    headers: new HttpHeaders({ 
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Headers': 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE, PATCH'
    })
  };

  findAccount(data:any){
    return this._HttpClient.post(environment.apiUrl + '/users/findAccount',data,this.headerpass);
  }

  forgotPassword(data:any){
    return this._HttpClient.post(environment.apiUrl + '/users/forgotPassword',data, this.headerpass);
  }

  otpvalidation(data:any){
    return this._HttpClient.post(environment.apiUrl + '/users/verifyOtp',data,this.headerpass);
  }
  
  resetPasswords(data:any){
    return this._HttpClient.patch(environment.apiUrl + '/users/resetPassword',data,this.headerpass);
  }
}
