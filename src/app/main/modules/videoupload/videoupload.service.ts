import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideouploadService {

  constructor(private _HttpClient:HttpClient){ }

  videoupload(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postVideo/addPostVideo`,data);
  }

  getUsersList(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/users/getUsersList`,data);
  }

  getProductList(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/products/getProductListByPattern`,data);
  }

  getAllSchedulePostVideo(){
    return this._HttpClient.get(`${environment.apiUrl}/postVideo/getAllSchedulePostVideo`);
  }
  
  publishNowPostVideo(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postVideo/publishNowPostVideo`,data);
  }

  deletePostVideo(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postVideo/deletePostVideo`,data);
  }
}
