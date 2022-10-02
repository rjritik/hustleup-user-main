import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddproductService {

  constructor(private _HttpClient:HttpClient) { }
  
  getBrandDetailsBySeller(){
    return this._HttpClient.get(`${environment.apiUrl}/brands/getBrandDetailsBySeller`);
  }

  findMenuCategory(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/menuCategory/findMenuCategory`,data);
  }

  findMenuSubCategory(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/menuSubCategory/findMenuSubCategory`,data);
  }

  findfindproductType(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/productType/findproductType`,data);
  }

  getColorList(){
    return this._HttpClient.get(`${environment.apiUrl}/colors/getColorList`)
  }

  // all product-post
  addProduct(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/products/addProduct`,data);
  }
  
  checkproductid(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/products/checkProductId`,data);
  }

  productsellerwise(){
    return this._HttpClient.get(`${environment.apiUrl}/products/getProductNameSellerWise`)
  }
}
