import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreatechannelService {

  constructor(private _HttpClient:HttpClient){ }

  uploadMedia(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/chatMedia/uploadMedia`,data);
  };
  
  searchChannelsURL(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/channel/searchChannelsURL`,data);
  }

  createChannel(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/channel/createChannel`,data);
  } 

  getAllChannel(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/channel/getAllChannel`,data);
  }

  getChannelMemberList(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/channelMembers/getChannelMemberList`,data);
  }

  checkUserMemberOfChannel(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/channelMembers/checkUserMemberOfChannel`,data);
  }

}
