import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  constructor(private _HttpClient:HttpClient) { }

  getSubMenuAndProductType(){
    return this._HttpClient.get(`${environment.apiUrl}/menuCategory/getSubMenuAndProductType`)
  }
  
  // navmenu(data:any){
  //   return this._HttpClient.post(`${environment.apiUrl}/menuCategory/findMenuCategory`,data)
  // }
  // SubMenuCategory(data:any){
  //   return this._HttpClient.post(`${environment.apiUrl}/menuSubCategory/findMenuSubCategory`,data)
  // }
  // FindProductType(data:any){
  //   return this._HttpClient.post(`${environment.apiUrl}/productType/findproductType`,data)
  // }

}