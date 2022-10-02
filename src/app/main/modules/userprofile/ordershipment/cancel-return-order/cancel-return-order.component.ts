import { Component, OnInit,OnDestroy } from '@angular/core';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { OrdershipmentService } from '../ordershipment.service';
declare var $:any;

@Component({
  selector: 'app-cancel-return-order',
  templateUrl: './cancel-return-order.component.html',
  styleUrls: ['./cancel-return-order.component.css']
})
export class CancelReturnOrderComponent implements OnInit,OnDestroy {
  CancelReturnOrderList:any=[];
  CancelNdReturnStatus = 5;
  selecteddropdownitem:any;
  SearchedText:any;
  StartDate:any;
  EndDate:any;
  PageNo:any;
  limit:any;
  totalPages:any;
  nextPage:any;
  hasNextPage:any;
  prevPage:any;
  hasPrevPage:any;
  viewreasontitle:any;
  viewreasoncomment:any;
  BuyerName:any;
  BuyerEmail:any;
  BuyerMobile:any;
  docslength:any;
  CancelledReturnedtextunsubscribe:any;
  SDateCancelledReturned:any;
  EDateCancelledReturned:any;  
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');
  // IsSeller:boolean = false;

  constructor(
    private _OrdershipmentService:OrdershipmentService,
    private _AuthenticationService:AuthenticationService,
    private _SharedService: SharedService,
  ) { }

  ngOnInit(): void {
    // if(this._AuthenticationService.isSeller == true){
    //   this.IsSeller = true;
    // }
    this.CancelledReturnedtextunsubscribe = this._OrdershipmentService.GetCancelledReturnedtext.subscribe(res=>{
      if(res != undefined){
        if(res == ""){
          this.GetCancelReturnOrderData();
        }else{
          this.GetSelectedField();
          this.returnSearch(res);
        } 
      }else{
        this.GetCancelReturnOrderData();
      }
    })
    this.SDateCancelledReturned = this._OrdershipmentService.GetSDateCancelledReturned.subscribe(date=>{ 
      this.StartDate = date;
    });
    this.EDateCancelledReturned =  this._OrdershipmentService.GetEDateCancelledReturned.subscribe(date=>{
        this.EndDate = date;
        if(this.StartDate != undefined && this.EndDate != undefined){
          this.datewisedata();
        };
    });
  }


  GetSelectedField(){
    this._OrdershipmentService.GetSelectedField.subscribe((res:any)=>{
      switch (res){
        case "Order ID":
          this.selecteddropdownitem = "orderId";
          break;
        case "Product ID":
          this.selecteddropdownitem = "productId";
          break;
        case "Buyer's Username":
          this.selecteddropdownitem = "username";
          break;
        case "SKU":
          this.selecteddropdownitem = "sellerSku";
          break;                
        default:
          this.selecteddropdownitem = "orderId";
          break;
      }
     })
  }

  datewisedata(){
      const data = {
        status : this.CancelNdReturnStatus,
        start_date:this.StartDate,
        end_date:this.EndDate,
        page: this.PageNo == undefined ? 1 : this.PageNo,
        limit:  this.limit == undefined ? 10:this.limit
      }
      this._OrdershipmentService.getOrderDetailsOfCancelAndReturn(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.CancelReturnOrderList = res.data.docs
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
            status:this.CancelNdReturnStatus
          }
          this._OrdershipmentService.SetGetCancelledReturned(ordervalue);
        }
      })
  }

  returnSearch(res:any){
      const data = {
        status : this.CancelNdReturnStatus,
        searchBy:this.selecteddropdownitem,
        pattern:res,
        page: this.PageNo == undefined ? 1 : this.PageNo,
        limit:  this.limit == undefined ? 10:this.limit
      }
      this._OrdershipmentService.getOrderDetailsOfCancelAndReturn(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.CancelReturnOrderList = res.data.docs
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
            status:this.CancelNdReturnStatus
          }
          this._OrdershipmentService.SetGetCancelledReturned(ordervalue);
        } 
      })
  }  

  async GetCancelReturnOrderData(){
    const data = {
      status : this.CancelNdReturnStatus,
      page: this.PageNo == undefined ? 1 : this.PageNo,
      limit:  this.limit == undefined ? 10:this.limit
    }
    this._OrdershipmentService.getOrderDetailsOfCancelAndReturn(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.CancelReturnOrderList = res.data.docs
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
          status:this.CancelNdReturnStatus
        }
        this._OrdershipmentService.SetGetCancelledReturned(ordervalue);
      } else{
        this._SharedService.errorToast(res.message);
      }
    })
  }

  SelectItemsPerPage(event:any){
    this.limit = event.target.value
    this.GetCancelReturnOrderData()
  }
  onFirst(){
    if(this.hasPrevPage  == true){
      this.PageNo = 1
      this.GetCancelReturnOrderData()
    }
  }

  onPrevious(){
    if(this.hasPrevPage  == true){
      this.PageNo = this.prevPage
      this.GetCancelReturnOrderData()
    }
  }

  onNext(){
    if(this.hasNextPage  == true){
      this.PageNo = this.nextPage
      this.GetCancelReturnOrderData()
    }
  }

  onLast(){
    if(this.hasNextPage  == true){
      this.PageNo = this.totalPages
      this.GetCancelReturnOrderData()
    }
  }

  viewreason(data:any){
    $('#viewreason').modal("show");
    this.viewreasontitle = data.cancellationReason;
    this.viewreasoncomment = data.cancellationComment;
    // this._OrdershipmentService.getReason({"_id":data._id}).subscribe((res:any)=>{
    //   if(res.status == 200){
    //     $('#viewreason').modal("show");
    //     this.viewreasontitle = res.data.cancellationReason;
    //     this.viewreasoncomment = res.data.cancellationComment;
    //   }
    // },err=>{
    //   console.log(err,"err viewreason");
    // });
  }

  ContactBuyer(item:any){
    $('#contactbuyer').modal("show");
    this.BuyerName=item.user_details.username;
    this.BuyerEmail=item.user_details.email
    this.BuyerMobile=item.user_details.mobile
  }

  ngOnDestroy(){
    this.SDateCancelledReturned.unsubscribe();
    this.EDateCancelledReturned.unsubscribe();
    this.CancelledReturnedtextunsubscribe.unsubscribe();
    this._OrdershipmentService.SetSelectedField(undefined);
    this._OrdershipmentService.SetGetCancelledReturned({});
    this._OrdershipmentService.SetSDateCancelledReturned(undefined);
    this._OrdershipmentService.SetEDateCancelledReturned(undefined);
  }

}
