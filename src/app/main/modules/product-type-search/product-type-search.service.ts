import { HttpClient } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeSearchService {

  constructor(private _HttpClient: HttpClient) { }
  
  getAllSearchListingByProductTypeId(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/products/getAllSearchListingByProductTypeId`, data);
  }

  viewProductTypeWise(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/products/viewProductTypeWise`, data)
  }
}
