import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SelectAddressService {

  constructor(private _HttpClient: HttpClient) { }

  GetMyAddress() {
    return this._HttpClient.get(
      `${environment.apiUrl}/addresses/getAddressList`
    );
  }

  AddMyaddress(data: any) {
    return this._HttpClient.post(
      `${environment.apiUrl}/addresses/addAddress`,
      data
    );
  }

  // UpdateMyaddress(data: any) {
  //   return this._HttpClient.patch(
  //     `${environment.apiUrl}/addresses/editAddress`,
  //     data
  //   );
  // }
  MakeDefaultMyaddress(id: any) {
    return this._HttpClient.patch(
      `${environment.apiUrl}/addresses/makeDefaultAddress`,
      id
    );
  }
}
