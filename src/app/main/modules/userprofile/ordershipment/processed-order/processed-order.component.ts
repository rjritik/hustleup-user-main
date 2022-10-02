import { Component, OnInit,OnDestroy, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OrdershipmentService } from '../ordershipment.service';
import { SharedService } from 'src/app/main/shared/shared.service';
import {PendingOrderService} from '../pending-order/pending-order.service'
import { Router } from '@angular/router';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';

@Component({
  selector: 'app-processed-order',
  templateUrl: './processed-order.component.html',
  styleUrls: ['./processed-order.component.css']
})
export class ProcessedOrderComponent implements OnInit,OnDestroy {
  ProcessedOrderStatus = 2;
  ProcessedOrderData:any=[];
  invoiceform:any=[];
  selecteddropdownitem:any
  SearchedText:any
  StartDate:any
  EndDate:any
  PageNo:any;
  limit:any;
  totalPages:any;
  nextPage:any;
  hasNextPage:any
  prevPage:any;
  hasPrevPage:any;
  docslength:any;
  ProcessedOrderstextunsubscribe:any;
  SDateProcessedOrders:any;
  EDateProcessedOrders:any;  
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');
  IsSeller:boolean = false;
  constructor(
    private _OrdershipmentService:OrdershipmentService,
    private _PendingOrderService:PendingOrderService,
    private _SharedService: SharedService,
    private _AuthenticationService:AuthenticationService,
    private Route:Router,
    private sanitizer:DomSanitizer
  ) { }

  ngOnInit(): void {
    if(this._AuthenticationService.isSeller == true){
      this.IsSeller = true;
    }
     this.ProcessedOrderstextunsubscribe = this._OrdershipmentService.GetProcessedOrderstext.subscribe(res=>{
      if(res != undefined){
        if(res == ""){
          this.GetProcessedOrderData();
        }else{
          this.GetSelectedField();
          this.returnSearch(res);
        } 
      }else{
        this.GetProcessedOrderData();
      }
    })
    this.SDateProcessedOrders = this._OrdershipmentService.GetSDateProcessedOrders.subscribe(date=>{ 
      this.StartDate = date;
    });
    this.EDateProcessedOrders =  this._OrdershipmentService.GetEDateProcessedOrders.subscribe(date=>{
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
        status : this.ProcessedOrderStatus,
        start_date:this.StartDate,
        end_date:this.EndDate,
        page: this.PageNo == undefined ? 1 : this.PageNo,
        limit:  this.limit == undefined ? 10:this.limit
      }
      this._OrdershipmentService.GetOrderDetail(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.ProcessedOrderData = res.data.docs
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
            status:this.ProcessedOrderStatus
          }
          this._OrdershipmentService.SetGetProcessedOrders(ordervalue);
        }
      })
  }

  returnSearch(res:any){
      const data = {
        status : this.ProcessedOrderStatus,
        searchBy:this.selecteddropdownitem,
        pattern:res,
        page: this.PageNo == undefined ? 1 : this.PageNo,
        limit:  this.limit == undefined ? 10:this.limit
      }
      this._OrdershipmentService.GetOrderDetail(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.ProcessedOrderData = res.data.docs
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
            status:this.ProcessedOrderStatus
          }
          this._OrdershipmentService.SetGetProcessedOrders(ordervalue);
        } 
      })
  }

  async GetProcessedOrderData(){
    const data = {
      status : this.ProcessedOrderStatus,
      page: this.PageNo == undefined ? 1 : this.PageNo,
      limit:  this.limit == undefined ? 10:this.limit
    }
    this._OrdershipmentService.GetOrderDetail(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.ProcessedOrderData = res.data.docs
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
          status:this.ProcessedOrderStatus
        }
        this._OrdershipmentService.SetGetProcessedOrders(ordervalue);
      } else{
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
        // console.log(this.PrintInvoicedata,"PriontInvoicedata")
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

  ReschedulePickupClick(item:any){
    // this._OrdershipmentService.SetRequestForPickupData(item)
    // this.Route.navigate(['/user-profile/Ordershipment/RequestPickup'])
    let ReschedulePickupDetail = btoa(JSON.stringify(item));
    this.Route.navigate(['/user-profile/Ordershipment/Reschedule-Pickup'],{ queryParams: {ReschedulePickupDetail} });
  }
// for pagination
  SelectItemsPerPage(event:any){
    this.limit = event.target.value
    this.GetProcessedOrderData()
  }
  onFirst(){
    if(this.hasPrevPage  == true){
      this.PageNo = 1
      this.GetProcessedOrderData()
    }
  }

  onPrevious(){
    if(this.hasPrevPage  == true){
      this.PageNo = this.prevPage
      this.GetProcessedOrderData()
    }
  }

  onNext(){
    if(this.hasNextPage  == true){
      this.PageNo = this.nextPage
      this.GetProcessedOrderData()
    }
  }

  onLast(){
    if(this.hasNextPage  == true){
      this.PageNo = this.totalPages
      this.GetProcessedOrderData()
    }
  }

  ngOnDestroy(){
    this.ProcessedOrderstextunsubscribe.unsubscribe();
    this.SDateProcessedOrders.unsubscribe();
    this.EDateProcessedOrders.unsubscribe();
    this._OrdershipmentService.SetSelectedField(undefined);
    this._OrdershipmentService.SetGetProcessedOrders({});
    this._OrdershipmentService.SetSDateProcessedOrders(undefined);
    this._OrdershipmentService.SetEDateProcessedOrders(undefined);
  }

}
