import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActiveListingsService {

  constructor(private _HttpClient: HttpClient) {}

  SingleProductQuantityUpdate(data:any){
    return this._HttpClient.post(
      `${environment.apiUrl}/products/singleProductQuantityUpdate`,
      data
    );
  }

  SingleProductSellingPriceUpdate(data:any){
    return this._HttpClient.post(
      `${environment.apiUrl}/products/singleProductSellingPriceUpdate`,
      data
    );
  }

  duplicatelisting(data:any){
    return this._HttpClient.post(
      `${environment.apiUrl}/products/duplicateListing`,
      data
    );
  }

  ActiveCloseListing(data:any){
    return this._HttpClient.post(
      `${environment.apiUrl}/products/changeStatusBySeller`,
      data
    );
  }

  CommisionRateUpdate(data:any){
    console.log("from service",data);
    return this._HttpClient.post(
      `${environment.apiUrl}/products/updateInfluncerCommission`, data
    );
  }


}
