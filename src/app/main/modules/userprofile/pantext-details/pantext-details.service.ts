import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PantextDetailService {

  constructor(private _HttpClient: HttpClient) {}

  GetPanList() {
    return this._HttpClient.get(
      `${environment.apiUrl}/panDetails/getPan`
    );
  }

  AddPanDetail(data: any) {
    return this._HttpClient.post(
      `${environment.apiUrl}/panDetails/addPan`,
      data
    );
  }
}