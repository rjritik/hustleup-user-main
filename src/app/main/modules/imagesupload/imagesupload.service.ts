import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImagesuploadService {

  constructor(private _HttpClient:HttpClient){ }

  imagesupload(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postImages/addPostImage`,data);
  }

  getUsersList(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/users/getUsersList`,data);
  }

  getProductList(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/products/getProductListByPattern`,data);
  }
  
  getAllSchedulePostImage(){
    return this._HttpClient.get(`${environment.apiUrl}/postImages/getAllSchedulePostImage`);
  }
  
  publishNowPostImage(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postImages/publishNowPostImage`,data);
  }

  deletePostImage(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postImages/deletePostImage`,data);
  }

  findHashtagPatternWise(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/hashtag/findHashtagPatternWise`,data);
  }
};