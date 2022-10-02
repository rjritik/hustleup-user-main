import { Component, OnInit,OnDestroy, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { SharedService } from 'src/app/main/shared/shared.service';
import {OrdershipmentService} from '../ordershipment.service';
import {PendingOrderService} from '../pending-order/pending-order.service'


@Component({
  selector: 'app-pending-order',
  templateUrl: './pending-order.component.html',
  styleUrls: ['./pending-order.component.css']
})
export class PendingOrderComponent implements OnInit,OnDestroy {
  PendingOrderStatus = 1;
  PendingOrderList:any=[];
  invoiceform:any=[];
  selecteddropdownitem:any
  SearchedText:any
  StartDate:any
  EndDate:any;
  PageNo:any;
  limit:any;
  totalPages:any;
  nextPage:any;
  hasNextPage:any
  prevPage:any;
  hasPrevPage:any;
  docslength:any;
  PendingOrderstextunsubscribe:any;
  SDatePendingOrders:any;
  EDatePendingOrders:any; 
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency'); 
  IsSeller:boolean = false;

  constructor(
    private _OrdershipmentService:OrdershipmentService,
    private _SharedService: SharedService,
    private Route:Router,
    private _PendingOrderService:PendingOrderService,
    private _AuthenticationService:AuthenticationService,
    private sanitizer:DomSanitizer
  ) { }

  ngOnInit(): void {
    if(this._AuthenticationService.isSeller == true){
      this.IsSeller = true;
    }
     this.PendingOrderstextunsubscribe = this._OrdershipmentService.GetPendingOrderstext.subscribe(res=>{
      if(res != undefined){
        if(res == ""){
          this.GetPendingOrderList();
        }else{
          this.GetSelectedField();
          this.returnSearch(res);
        } 
      }else{
        this.GetPendingOrderList();
      }
    });
    this.SDatePendingOrders = this._OrdershipmentService.GetSDatePendingOrders.subscribe(date=>{ 
      this.StartDate = date;
    });
    this.EDatePendingOrders =  this._OrdershipmentService.GetEDatePendingOrders.subscribe(date=>{
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
        status : this.PendingOrderStatus,
        start_date:this.StartDate,
        end_date:this.EndDate,
        page: this.PageNo == undefined ? 1 : this.PageNo,
        limit:  this.limit == undefined ? 10:this.limit
      }
      this._OrdershipmentService.GetOrderDetail(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.PendingOrderList = res.data.docs
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
            status:this.PendingOrderStatus
          }
          this._OrdershipmentService.SetGetPendingOrders(ordervalue);
        }
      })
  }

  returnSearch(res:any){
      const data = {
        status : this.PendingOrderStatus,
        searchBy: this.selecteddropdownitem,
        pattern:res,
        page: this.PageNo == undefined ? 1 : this.PageNo,
        limit:  this.limit == undefined ? 10:this.limit
      }
      this._OrdershipmentService.GetOrderDetail(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.PendingOrderList = res.data.docs;
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
            status:this.PendingOrderStatus
          }
          this._OrdershipmentService.SetGetPendingOrders(ordervalue);
        } 
      })
  }

  async GetPendingOrderList(){
    const data = {
      status : this.PendingOrderStatus,
      page: this.PageNo == undefined ? 1 : this.PageNo,
      limit:  this.limit == undefined ? 10:this.limit
    }
    await this._OrdershipmentService.GetOrderDetail(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.PendingOrderList = res.data.docs
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
          status:this.PendingOrderStatus
        }
        this._OrdershipmentService.SetGetPendingOrders(ordervalue);
      }else{
        this._SharedService.errorToast(res.message);
      } 
    })
  }

  PrintInvoice(item:any){
    let data = {
      orderNumber: this.sanitizer.sanitize(SecurityContext.HTML, item.orderNumber)
    }
    this._PendingOrderService.GetInvoice(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.invoiceform = res.data
        this._SharedService.successToast("Invoice Print Done")
        setTimeout(() => {
          const printContent = document.getElementById("InvoicePrint") as HTMLElement
          const WindowPrt:any = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
          WindowPrt.document.write(printContent.innerHTML);
          WindowPrt.document.close();
          WindowPrt.focus();
          WindowPrt.print();
          WindowPrt.close();
        }, 1000);
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
    })
  }

// for pagination
  SelectItemsPerPage(event:any){
    this.limit = event.target.value
    this.GetPendingOrderList();
  }
  onFirst(){
    if(this.hasPrevPage  == true){
      this.PageNo = 1
      this.GetPendingOrderList();
    }
  }

  onPrevious(){
    if(this.hasPrevPage  == true){
      this.PageNo = this.prevPage
      this.GetPendingOrderList();
    }
  }

  onNext(){
    if(this.hasNextPage  == true){
      this.PageNo = this.nextPage
      this.GetPendingOrderList();
    }
  }

  onLast(){
    if(this.hasNextPage  == true){
      this.PageNo = this.totalPages
      this.GetPendingOrderList();
    }
  }

  RequestPickupClick(item:any){
    // this._OrdershipmentService.SetRequestForPickupData(item)
    // this.Route.navigate(['/user-profile/Ordershipment/RequestPickup'])
    let PickupDetail = btoa(JSON.stringify(item));
    this.Route.navigate(['/user-profile/Ordershipment/RequestPickup'],{ queryParams: {PickupDetail} });
  }

  SelfShip(item:any){
    let SelfshipDetail = btoa(JSON.stringify(item));
    this.Route.navigate(['/user-profile/Ordershipment/SelfShip'],{ queryParams: {SelfshipDetail} });
  }

  selfdropclick(item:any){
    let SelfDropDetail = btoa(JSON.stringify(item));
    this.Route.navigate(['/user-profile/Ordershipment/SelfDrop'],{ queryParams: {SelfDropDetail} });
  }
  ngOnDestroy(){
    this._OrdershipmentService.SetSelectedField(undefined);
    this.PendingOrderstextunsubscribe.unsubscribe();
    this.SDatePendingOrders.unsubscribe();
    this.EDatePendingOrders.unsubscribe();
    this._OrdershipmentService.SetGetPendingOrders({});
    this._OrdershipmentService.SetSDatePendingOrders(undefined);
    this._OrdershipmentService.SetEDatePendingOrders(undefined);
  }
}
