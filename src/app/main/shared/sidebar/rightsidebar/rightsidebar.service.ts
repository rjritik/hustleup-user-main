import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RightsidebarService {

  constructor(private _HttpClient: HttpClient) { }

  gettrendingproduct(){
    return this._HttpClient.get(`${environment.apiUrl}/products/getTrendingProductList`)
  }
}
