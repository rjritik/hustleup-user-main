import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RightmenuService {
  constructor(private _HttpClient:HttpClient) { }
  notificationlist(data: any) {
    return this._HttpClient.post(`${environment.apiUrl}/notifications/getNotifications`,data)
  }

  readNotifications(){
    return this._HttpClient.get(`${environment.apiUrl}/notifications/readNotifications`);
  }

  acceptOrCancelSelfDropReq(data: any) {
    return this._HttpClient.post(`${environment.apiUrl}/orderSelfDrop/acceptOrCancelSelfDropReq`,data)
  }
}