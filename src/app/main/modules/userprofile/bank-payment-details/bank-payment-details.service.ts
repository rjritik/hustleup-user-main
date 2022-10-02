import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankPaymentDetailsService {

  constructor(private _HttpClient: HttpClient) {}

  verifyIfscCode(ifscCode:any){
    return this._HttpClient.get(`https://ifsc.razorpay.com/${ifscCode}`);
  }

  GetBankPaymentList(data:any) {
    return this._HttpClient.post(`${environment.apiUrl}/bankDetails/getBankDetail`,data);
  }

  addBankPaymenDetail(data: any) {
    return this._HttpClient.post(`${environment.apiUrl}/bankDetails/addBankDetail`,data);
  }

  updateBankPaymenDetail(data: any) {
    return this._HttpClient.patch(`${environment.apiUrl}/bankDetails/updateBankDetail`,data);
  }
  
}