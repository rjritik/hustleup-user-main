import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewOrderService {

  constructor(private _HttpClient: HttpClient) { }

  // GetPicsum(pageno:any,limit:any) {
  //   return this._HttpClient.get(
  //     `https://picsum.photos/v2/list?page=`+pageno+'&limit='+limit
  //   );
  // }

  CreateInvoice(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/invoice/createInvoice`,data)
  }

  cancelOrder(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/order/cancelOrder`, data);
  }
}