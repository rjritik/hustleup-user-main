import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PendingOrderService {

  constructor(private _HttpClient: HttpClient) { }

  GetInvoice(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/invoice/getInvoice`,data)
  }
  CreateOrderPickup(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/orderPickup/createOrderPickup`,data)
  }

  getcourierpartner(){
    return this._HttpClient.get(`${environment.apiUrl}/courierPartner/getCourierPartnersBySeller`)
  }

  addcourierpartner(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/courierPartner/addCourierPartner`,data)
  }

  createorderselfship(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/orderSelfShip/createOrderSelfShip`,data)
  }

  varifyselfdropdata(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/orderSelfDrop/verifySelfDropData`,data) 
  }

  createselfdroprequest(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/orderSelfDrop/createAndSentOrderSelfDrop`,data)
  }
  cancelselfdroprequest(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/orderSelfDrop/cancelSelfDropRequest`,data)
  }
}