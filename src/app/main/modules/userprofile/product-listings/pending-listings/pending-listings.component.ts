import { Component, OnInit,OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/main/auth/service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { ProductListingService } from '../product-listing.service';
import { PendingListingsService } from './pending-listings.service';
declare var $ :any;

@Component({
  selector: 'app-pending-listings',
  templateUrl: './pending-listings.component.html',
  styleUrls: ['./pending-listings.component.css']
})
export class PendingListingsComponent implements OnInit,OnDestroy {
  PendingListingStatus = 0;
  returnstatus:number;
  PendingListingList:any=[];
  SelectedCloseListing:any=[];
  SlideOptions:any;
  selecteddropdownitem:any;
  PageNo:any;
  limit:any;
  totalPages:any;
  nextPage:any;
  hasNextPage:any;
  prevPage:any;
  hasPrevPage:any;
  docslength:any;
  selectdropvalue:any;
  Pendinglistunsubscribe:any;

  constructor(private _SharedService: SharedService,private _ProductListingService:ProductListingService,private _PendingListingsService:PendingListingsService,private _authentication:AuthenticationService) {
   }

  ngOnInit(): void {
    this.SlideOptions = {nav:false, items: 1, loop:false,autoplay:false,autoplayTimeout:1000};
    this.Pendinglistunsubscribe = this._ProductListingService.GettextPendinglist.subscribe(res=>{
      if(res != undefined){
        if(res == ""){
          this.GetPendingListingData();
        }else{
          this.GetSelectedField();
          this.returnSearch(res);
        }
      }else{
        this.GetPendingListingData()
      }
    })
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
        status : this.PendingListingStatus,
        searchBy:this.selectdropvalue,
        pattern:res,
        page: this.PageNo == undefined ? 1 : this.PageNo,
        limit:  this.limit == undefined ? 10:this.limit
      }
      this._ProductListingService.GetProductList(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.PendingListingList = res.data.docs
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
            status:this.PendingListingStatus
          }
          this._ProductListingService.SetPendingListingscount(ordervalue);
        }
      })
  }

  GetPendingListingData(){
    const data = {
      status : this.PendingListingStatus,
      page: this.PageNo == undefined ? 1 : this.PageNo,
      limit:  this.limit == undefined ? 10:this.limit,
     countryCode:this._authentication.currentUserValue.countryCode
    }
    this._ProductListingService.GetProductList(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.PendingListingList = res.data.docs
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
          status:this.PendingListingStatus
        }
        this._ProductListingService.SetPendingListingscount(ordervalue);
      } 
    })
  }

  cancel(item:any){
    this.SelectedCloseListing = item
  }

  DuplicateLIsting(item:any){
    const data ={
      productId:item._id
    }
    this._PendingListingsService.pendingduplicatelisting(data).subscribe((res:any)=>{
      if(res.status == 201){
        this._SharedService.successToast("Duplicate Listing Successfully")
        this.GetPendingListingData()
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  CancelModel(){
    $('#Pending-Listings-cancel').modal('hide');
  }


  ConfirmCancelClick(){
    const data = {
      productId:this.SelectedCloseListing._id
    }
    this._PendingListingsService.pendingCloseListing(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message)
        $('#Pending-Listings-cancel').modal('hide');
        this.GetPendingListingData()
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
    this.Pendinglistunsubscribe.unsubscribe();
    this._ProductListingService.SetSelectedField("Product ID");
    this._ProductListingService.SetPendingListingscount({});
  }
}
