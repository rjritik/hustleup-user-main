import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject,BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductListingService {

  private selectedfield = new BehaviorSubject<any>(undefined)
  GetSelectedField = this.selectedfield.asObservable()

  private textActivelist = new BehaviorSubject<any>(undefined)
  GettextActivelist = this.textActivelist.asObservable()
  
  private textPendinglist = new BehaviorSubject<any>(undefined)
  GettextPendinglist = this.textPendinglist.asObservable()

  private textFailedlist = new BehaviorSubject<any>(undefined)
  GettextFailedlist = this.textFailedlist.asObservable()

  private textDeactivatedlist = new BehaviorSubject<any>(undefined)
  GettextDeactivatedlist = this.textDeactivatedlist.asObservable()

  private Activelistcount = new BehaviorSubject<any>({})
  GetActivelistcount = this.Activelistcount.asObservable()

  private Pendinglistcount = new BehaviorSubject<any>({})
  GetPendinglistcount = this.Pendinglistcount.asObservable()
  
  private Failedlistcount = new BehaviorSubject<any>({})
  GetFailedlistcount = this.Failedlistcount.asObservable()

  private Deactivatedlistcount = new BehaviorSubject<any>({})
  GetDeactivatedlistcount = this.Deactivatedlistcount.asObservable()

  private statuscodesearch = new BehaviorSubject<any>(undefined)
  Getstatuscodesearch = this.statuscodesearch.asObservable()

  constructor(private _HttpClient:HttpClient) { }

  GetProductList(data: any) {
    return this._HttpClient.post(
      `${environment.apiUrl}/products/getProductStatusWise`,
      data
    );
  }

  ViewReason(data:any){
    return this._HttpClient.post(
      `${environment.apiUrl}/products/viewProductReason`,
      data
    );
  }
  
  ReList(data:any){
    return this._HttpClient.post(
      `${environment.apiUrl}/products/changeStatusBySeller`,
      data
    );
  }

  SettextActivelist(data:any){
    this.textActivelist.next(data);
  }
  SettextPendinglist(data:any){
    this.textPendinglist.next(data);
  }
  SettextFailedlist(data:any){
    this.textFailedlist.next(data);
  }
  SettextDeactivatedlist(data:any){
     this.textDeactivatedlist.next(data); 
  }

  SetSelectedField(dropselectedfield:any){
    this.selectedfield.next(dropselectedfield)
  }

  SetActiveListingscount(data:any){
    this.Activelistcount.next(data);
  }

  SetPendingListingscount(data:any){
    this.Pendinglistcount.next(data);
  }
  
  SetFailedListingscount(data:any){
    this.Failedlistcount.next(data);
  }
  
  SetDeactivatedListingscount(data:any){
    this.Deactivatedlistcount.next(data);
  }  
}
