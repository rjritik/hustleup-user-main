import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MutedAccountsService {

  constructor(private _HttpClient: HttpClient) {}

  GetMutedAccountList() {
    return this._HttpClient.get(
      `${environment.apiUrl}/users/getMutedAccountList`
    );
  }

  UnmuteAccount(id: any) {
    return this._HttpClient.patch(
      `${environment.apiUrl}/users/muteAccount`,
      id
    );
  }

  GetPicsum(pageno:any,limit:any) {
    return this._HttpClient.get(
      `https://picsum.photos/v2/list?page=`+pageno+'&limit='+limit
    );
  }

  // GetOfferPromocode(pageno:any,limit:any){
  //   return this._HttpClient.get(`http://localhost:3000/OfferPromocodes?_page=`+pageno+'&_limit='+limit)
  // }
}
