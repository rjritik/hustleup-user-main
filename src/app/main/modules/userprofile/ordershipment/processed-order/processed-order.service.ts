import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcessedOrderService {

  constructor(private _HttpClient: HttpClient) { }

  CreateReschedulePickup(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/orderPickup/reschedulePickup`,data)
  }
}