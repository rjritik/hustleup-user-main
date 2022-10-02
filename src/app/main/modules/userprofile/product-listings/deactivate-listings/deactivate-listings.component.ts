import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/main/auth/service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { ProductListingService } from '../product-listing.service';
declare var $ :any;

@Component({
  selector: 'app-deactivate-listings',
  templateUrl: './deactivate-listings.component.html',
  styleUrls: ['./deactivate-listings.component.css']
})
export class DeactivateListingsComponent implements OnInit {
  DeactivateListingStatus=3;
  returnstatus:number;
  DeactivateListing:any=[];
  SlideOptions:any;
  selecteddropdownitem:any
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
  Deactivatedlistunsubscribe:any;

  constructor(private _ProductListingService:ProductListingService,private _authentication:AuthenticationService,private _SharedService: SharedService) {
   }

  ngOnInit(): void {
    this.Deactivatedlistunsubscribe = this._ProductListingService.GettextDeactivatedlist.subscribe(res=>{
      if(res != undefined){
        if(res == ""){
          this.GetDeactivateListingData();
        }else{
          this.GetSelectedField();
          this.returnSearch(res);
        }
      }else{
        this.GetDeactivateListingData();
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
        status : this.DeactivateListingStatus,
        searchBy:this.selectdropvalue,
        pattern:res,
        page: this.PageNo == undefined ? 1 : this.PageNo,
        limit:  this.limit == undefined ? 10:this.limit
      }
       this._ProductListingService.GetProductList(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.DeactivateListing = res.data.docs
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
            status:this.DeactivateListingStatus
          }
          this._ProductListingService.SetDeactivatedListingscount(ordervalue);
        }
      })
  }

  GetDeactivateListingData(){
     const data = {
      status : this.DeactivateListingStatus,
      page: this.PageNo == undefined ? 1 : this.PageNo,
      limit:  this.limit == undefined ? 10:this.limit,
     countryCode:this._authentication.currentUserValue.countryCode
    }
    this._ProductListingService.GetProductList(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.DeactivateListing = res.data.docs
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
          status:this.DeactivateListingStatus
        }
        this._ProductListingService.SetDeactivatedListingscount(ordervalue);
      } 
    })
  }

  DeactivateViewReason(item:any){
    const data ={
      productId:item._id
    }
    this._ProductListingService.ViewReason(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.showReason = res.data.disApproveReasion
      }
    })
  }

  DeactivateReList(item:any){
    const data ={
      productId:item._id,
      productStatus: 1
    }
    this._ProductListingService.ReList(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast("Product Re-List Successfully")
        this.GetDeactivateListingData()
      }
    })
  }

   //for pagination
   SelectItemsPerPage(event:any){
    this.limit = event.target.value
    this.GetDeactivateListingData()
  }
  onFirst(){
    if(this.hasPrevPage  == true){
      this.PageNo = 1
      this.GetDeactivateListingData()
    }
  }

  onPrevious(){
    if(this.hasPrevPage  == true){
      this.PageNo = this.prevPage
      this.GetDeactivateListingData()
    }
  }

  onNext(){
    if(this.hasNextPage  == true){
      this.PageNo = this.nextPage
      this.GetDeactivateListingData()
    }
  }

  onLast(){
    if(this.hasNextPage  == true){
      this.PageNo = this.totalPages
      this.GetDeactivateListingData()
    }
  }

  ngOnDestroy(){
    this.Deactivatedlistunsubscribe.unsubscribe();
    this._ProductListingService.SetSelectedField("Product ID");
    this._ProductListingService.SetDeactivatedListingscount({});
  }


}
