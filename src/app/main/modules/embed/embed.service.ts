import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmbedService {

  constructor(private _HttpClient:HttpClient) { }

  GetSingleProduct(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/products/getSingleProduct`, data);
  }

  wishlistproduct(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/wishlist/addRemoveWishlist`,data);
  }
}
