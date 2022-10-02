import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MinimizepopService {

  constructor(private _HttpClient:HttpClient){ }

  getUsersList(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/users/getUsersList`,data);
  }

  getProductList(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/products/getProductListByPattern`,data);
  }

  getAllRepliesMessagesList(){
    return this._HttpClient.get(`${environment.apiUrl}/savedRepliesMessages/getAllRepliesMessagesList`);
  }

  addRepliesMessages(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/savedRepliesMessages/addRepliesMessages`,data);
  }

  editRepliesMessages(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/savedRepliesMessages/editRepliesMessages`,data);
  }

  deleteRepliesMessage(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/savedRepliesMessages/deleteRepliesMessage`,data);
  }

}
