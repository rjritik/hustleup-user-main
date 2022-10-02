import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor(private _HttpClient:HttpClient) { }

  findMenuCategory(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/menuCategory/findMenuCategory`,data);
  }

  findfindproductType(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/productType/findproductType`,data);
  }

  findMenuSubCategory(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/menuSubCategory/findMenuSubCategory`,data);
  }

  getAllMapLocation(){
    return this._HttpClient.get(`${environment.apiUrl}/map/getAllMapLocation`);
  }
}
