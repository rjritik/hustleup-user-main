import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private _HttpClient:HttpClient) { }

  getAllPromoterProduct(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/promoteProduct/getAllPromoterProduct`,data);
  }

  getAllProductSellerwise(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/products/getAllProductSellerWise`,data);
  }
  findMenuCategory(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/menuCategory/findMenuCategory`,data);
  }

  wishlistproduct(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/wishlist/addRemoveWishlist`,data);
  }
}