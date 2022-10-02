import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class YourchannelService {

  constructor(private _HttpClient:HttpClient){ }

  getChannelMessage(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/channelMessages/getChannelMessage`,data);
  }

  getChannelReplyMessage(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/channelReplyMessages/getChannelReplyMessages`,data);
  }
}