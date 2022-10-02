import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoffeeCollectionService {

  constructor(private _HttpClient:HttpClient) { }

  getAllCoffee(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/coffee/getAllCoffee`,data);
  }

  getallcoffeeprivilege(){
    return this._HttpClient.get(`${environment.apiUrl}/coffeePrivilege/getAllCoffeePriviledge`);
  }

  addcoffeePrivilege(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/coffeePrivilege/addCoffeePrivilege`,data);
  }

  deletecoffeePrivilege(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/coffeePrivilege/deleteCoffeePriviledge`,data);
  }

  enabledisableCoffee(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/coffee/coffeeEnableDisable`,data)
  }
}
