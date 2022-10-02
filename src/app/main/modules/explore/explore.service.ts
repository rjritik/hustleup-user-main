import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExploreService {

  constructor(private _HttpClient:HttpClient) { }

  getexploredata(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/explorer/getExplorer`,data)
  }
}
