import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderhistoryService {

  constructor(private _HttpClient:HttpClient) { }

  getorderhistory(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/order/getOrderById`,data);
  }

  GetInvoice(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/invoice/getInvoice`,data);
  }

  cancelOrder(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/order/cancelOrder`, data);
  }

  returnOrder(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/order/returnOrder`, data);
  }

}