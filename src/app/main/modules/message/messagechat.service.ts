import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessagechatService {
  
  constructor(private _HttpClient:HttpClient) {};

  // chat-api
  getChatMessageList(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/singleChatMessages/getChatMessageList`,data);
  };

  getAllChatMembers(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/singleChatMember/getAllChatMembers`,data);
  }

  getChatMessagesListReplysList(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/singleChatMessageReply/getChatMessagesListReplysList`,data);
  };

  markAsDoneUndoneMember(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/singleChatMember/markAsDoneUndoneMember`,data);
  };

  moveToSpamMember(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/singleChatMember/moveToSpamMember`,data);
  };

  uploadMedia(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/chatMedia/uploadMedia`,data);
  };

};