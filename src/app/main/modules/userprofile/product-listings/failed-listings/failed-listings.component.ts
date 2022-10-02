import { Component, OnInit,OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/main/auth/service';
import { ProductListingService } from '../product-listing.service';
import { FailedListingsService } from './failed-listings.service';
declare var $ :any;

@Component({
  selector: 'app-failed-listings',
  templateUrl: './failed-listings.component.html',
  styleUrls: ['./failed-listings.component.css']
})
export class FailedListingsComponent implements OnInit,OnDestroy {
  FailedListingStatus = 2;
  returnstatus:number;
  FailedListingList:any=[];
  SlideOptions:any;
  selecteddropdownitem:any;
  PageNo:any;
  limit:any;
  totalPages:any;
  nextPage:any;
  hasNextPage:any;
  prevPage:any;
  hasPrevPage:any;
  showReason:any;
  docslength:any;
  selectdropvalue:any;
  failedlistunsubscribe:any;

  constructor(private _ProductListingService:ProductListingService,private _authentication:AuthenticationService,private _FailedListingsService:FailedListingsService) {
   }

  ngOnInit(): void {
    this.failedlistunsubscribe = this._ProductListingService.GettextFailedlist.subscribe(res=>{
      if(res != undefined){
        if(res == ""){
          this.GetPendingListingData();
        }else{
          this.GetSelectedField();
          this.returnSearch(res);
        }
      }else{
        this.GetPendingListingData();
      }
    })
    this.SlideOptions = {nav:false, items: 1, loop:false,autoplay:false,autoplayTimeout:1000};
  }

  GetSelectedField(){
    this._ProductListingService.GetSelectedField.subscribe((res:any)=>{
      switch (res){
        case "Product ID":
          this.selectdropvalue = "productId";
          break;
        case "Product Name":
          this.selectdropvalue = "productName";
          break;
        case "Seller SKU":
          this.selectdropvalue = "sellerSku";
          break;                
        default:
          this.selectdropvalue = "productId";
          break;
      }
    })
  }

  returnSearch(res:any){
      const data = {
        status : this.FailedListingStatus,
        searchBy:this.selectdropvalue,
        pattern:res,
        page: this.PageNo == undefined ? 1 : this.PageNo,
        limit:  this.limit == undefined ? 10:this.limit
      }
      this._ProductListingService.GetProductList(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.FailedListingList = res.data.docs
          this.PageNo = res.data.page
          this.limit = res.data.limit
          this.totalPages = res.data.totalPages
          this.nextPage = res.data.nextPage
          this.prevPage = res.data.prevPage
          this.hasNextPage = res.data.hasNextPage
          this.hasPrevPage = res.data.hasPrevPage
          this.docslength = res.data.totalDocs
          const ordervalue = {
            data:res.data.totalDocs,
            status:this.FailedListingStatus
          }
          this._ProductListingService.SetFailedListingscount(ordervalue);
        }
      })
  }

  GetPendingListingData(){
    const data = {
      status : this.FailedListingStatus,
      page: this.PageNo == undefined ? 1 : this.PageNo,
      limit:  this.limit == undefined ? 10:this.limit,
     countryCode:this._authentication.currentUserValue.countryCode
    }
    this._ProductListingService.GetProductList(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.FailedListingList = res.data.docs
        this.PageNo = res.data.page
        this.limit = res.data.limit
        this.totalPages = res.data.totalPages
        this.nextPage = res.data.nextPage
        this.prevPage = res.data.prevPage
        this.hasNextPage = res.data.hasNextPage
        this.hasPrevPage = res.data.hasPrevPage
        this.docslength =  res.data.totalDocs
        const ordervalue = {
          data:res.data.totalDocs,
          status:this.FailedListingStatus
        }
        this._ProductListingService.SetFailedListingscount(ordervalue);
      } 
    })
  }

  FailedViewReason(item:any){
    const data ={
      productId:item._id
    }
    this._ProductListingService.ViewReason(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.showReason = res.data.disApproveReasion
      }
    })
  }

    //for pagination
    SelectItemsPerPage(event:any){
      this.limit = event.target.value
      this.GetPendingListingData()
    }
    onFirst(){
      if(this.hasPrevPage  == true){
        this.PageNo = 1
        this.GetPendingListingData()
      }
    }
  
    onPrevious(){
      if(this.hasPrevPage  == true){
        this.PageNo = this.prevPage
        this.GetPendingListingData()
      }
    }
  
    onNext(){
      if(this.hasNextPage  == true){
        this.PageNo = this.nextPage
        this.GetPendingListingData()
      }
    }
  
    onLast(){
      if(this.hasNextPage  == true){
        this.PageNo = this.totalPages
        this.GetPendingListingData()
      }
    }

  ngOnDestroy(){
    this.failedlistunsubscribe.unsubscribe();
    this._ProductListingService.SetSelectedField("Product ID");
    this._ProductListingService.SetFailedListingscount({});
  }

}
