import { Injectable } from '@angular/core';
import { Observable, Subject,BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {

  constructor(private _HttpClient:HttpClient){ }

  getcartlist(){
    return this._HttpClient.get(`${environment.apiUrl}/cart/getAllCart`);
  }

  UpdateCart(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/cart/updateCart`, data);
  }

  deletecartlist(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/cart/deleteCart`, data);
  }
  
  addsavelist(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/wishlist/addRemoveWishlist`, data);
  }

  moveToSaveList(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/cart/moveToSaveList`, data);
  }

  placeorder(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/order/addOrder`,data);
  }
  PlaceOneOrder(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/order/addOneOrder`,data);
  }
// ------start couponcode section---------------------------
  viewAllCouponWithProduct(){
    return  this._HttpClient.get(`${environment.apiUrl}/couponPromoCodes/viewAllCouponWithProduct`);
  }

  getProductWiseCouponCode(data:any){
    return  this._HttpClient.post(`${environment.apiUrl}/couponPromoCodes/getProductWiseCouponCode`,data);
  }
  getAllAppliedCouponCode(){
    return  this._HttpClient.get(`${environment.apiUrl}/couponPromoCodes/getAllAppliedCouponCode`);
  }

  verifycoupencode(data:any){
   return  this._HttpClient.post(`${environment.apiUrl}/couponPromoCodes/varifyCouponCode`,data);
  }

  removeCouponCode(data:any){
    return  this._HttpClient.post(`${environment.apiUrl}/couponPromoCodes/removeCouponCode`,data);
  }

  applyCouponByPromocode(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/couponPromoCodes/applyCouponByPromocode`,data)
  }

  viewAllSingleProductAppliedCouponCode(data:any){
    return  this._HttpClient.post(`${environment.apiUrl}/couponPromoCodes/getAllAppiledSingleProductPromocode`,data);
  }

  directBySingleProductApplyCouponCode(data:any){
    return  this._HttpClient.post(`${environment.apiUrl}/couponPromoCodes/applyPrivateCouponCode`,data);
  }

  // ---------- razorPay API -----------
  razorPayMethod(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/razor/createOrder`, data);
  }

  refundMethod(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/razor/refund`, data);
  }
}