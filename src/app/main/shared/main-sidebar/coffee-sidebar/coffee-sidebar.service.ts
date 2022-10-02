import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoffeeSidebarService {

  constructor(private _HttpClient:HttpClient) {}

  getCoffeePriviledgeByInfluencerId(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/coffeePrivilege/getCoffeePriviledgeByInfluencerId`,data);
  }

  buyCoffee(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/buyCoffee/buyCoffee`,data);
  }
}