import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SharedService } from '../../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class SearchResultService {

  constructor(private _HttpClient: HttpClient) { }


  getSearchListPopup(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/explorer/getSearchListPopup`,data)
  }

  searcheduserlist(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/users/getUsersList`,data)
  }

  searchedhashtaglist(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/hashtag/findHashtagPatternWise`,data)
  }
  
  followhashtags(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/hashtag/followHashtag`,data)
  }

  searchedpostlist(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postImages/getPostCategoriesWise`, data)
  }
  
  searchedvideolist(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postVideo/getPostCategoriesWise`, data)
  }

  searchedbloglist(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postBlog/getBlogCategoriesWise`, data)
  }

  getAllSearchListingByProductTypeId(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/products/getAllSearchListingByProductTypeId`, data);
  }


  viewProductTypeWise(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/products/viewProductTypeWise`, data)
  }

 

  // -----------------------observablesection start-----------------------------------------

 /*  ---------------ActiveTab Observables Start--------------------*/
  private activetabs = new Subject<any>();
  GetActiveTabName = this.activetabs.asObservable()

  SetActiveTabName(data:any){
    this.activetabs.next(data);
  }

  /*  ---------------ActiveTab Observables End--------------------*/

  /*  ---------------SearchedText Observables Start--------------------*/

  private selectedtitle = new Subject<any>()
  Getselectedtitle = this.selectedtitle.asObservable()

  Setselectedtitle(data:any){
    this.selectedtitle.next(data);
  }

  /*  ---------------SearchedText Observables End--------------------*/

  /*  --------------- ProductTypeId Observables Start --------------------*/
  private producttypeid = new Subject<any>()
  GetProductTypeId = this.producttypeid.asObservable()

  SetProductTypeId(data:any){
    this.producttypeid.next(data);
  }

  /*  --------------- ProductTypeId Observables End --------------------*/

    /*  --------------- ProductTypeWiseData Observables Start --------------------*/
    private producttypewisedata = new Subject<any>()
    GetProductTypeWiseData = this.producttypewisedata.asObservable()
  
    SetProductTypeWiseData(data:any){
      this.producttypewisedata.next(data);
    }
  
    /*  --------------- ProductTypeWiseData Observables End --------------------*/

    
  // -----------------------observablesection end-----------------------------------------
}