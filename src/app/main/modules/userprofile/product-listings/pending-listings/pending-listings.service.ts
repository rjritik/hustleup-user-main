import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PendingListingsService {

  constructor(private _HttpClient: HttpClient) {}
  pendingduplicatelisting(data:any){
    return this._HttpClient.post(
      `${environment.apiUrl}/products/duplicateListing`,
      data
    );
  }

  pendingCloseListing(data:any){
    return this._HttpClient.post(
      `${environment.apiUrl}/products/deleteProduct`,
      data
    );
  }

}
