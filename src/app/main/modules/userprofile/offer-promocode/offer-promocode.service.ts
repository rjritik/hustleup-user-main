import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfferPromocodeService {

  constructor(private _HttpClient:HttpClient) { }

  getproductnamesellerwise(){
    return this._HttpClient.get(`${environment.apiUrl}/products/getProductNameSellerWise`)
  }

  getofferpromocodes(data:any){
   return this._HttpClient.post(`${environment.apiUrl}/couponPromoCodes/getAllCouponPromoCode`,data)
  }

  addofferpromocodes(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/couponPromoCodes/addCouponPromoCodes`,data);
  }

  updateofferpromocode(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/couponPromoCodes/updateCouponCode`,data)
  }

  duplicateofferpromocodes(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/couponPromoCodes/duplicateCouponCode`,data)
  }

  deleteofferpromocodes(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/couponPromoCodes/deleteCouponCode`,data)
  }
}
