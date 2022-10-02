import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _HttpClient: HttpClient) { }

  productdetail(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/products/productDetail`,data)
  }

  followUnfollowProduct(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/products/followUnfollowProduct`,data)
  }

  bookmarkPostImage(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postImages/bookmarkPostImage`,data);
  }

  bookmarkPostVideo(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postVideo/bookmarkPostVideo`,data);
  }
}