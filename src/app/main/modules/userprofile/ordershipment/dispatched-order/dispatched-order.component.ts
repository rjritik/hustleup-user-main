import { Component, OnInit,OnDestroy } from '@angular/core';
import { OrdershipmentService } from '../ordershipment.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/main/shared/shared.service';
import {PendingOrderService} from '../pending-order/pending-order.service';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service';
declare var $:any;

@Component({
  selector: 'app-dispatched-order',
  templateUrl: './dispatched-order.component.html',
  styleUrls: ['./dispatched-order.component.css']
})
export class DispatchedOrderComponent implements OnInit,OnDestroy {
  DispatchedOrderStatus = 3;
  DispatchedOrderList:any=[];
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
  BuyerName:any;
  BuyerEmail:any;
  BuyerMobile:any;
  DispatchedOrderstextunsubscribe:any;
  SDateDispatchedOrders:any;
  EDateDispatchedOrders:any;  
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');
  IsSeller:boolean = false;

  constructor(
    private Route:Router,
    private _OrdershipmentService:OrdershipmentService,
    private _PendingOrderService:PendingOrderService,
    private _SharedService: SharedService,
    private _AuthenticationService:AuthenticationService
  ) { }

  ngOnInit(): void {
    if(this._AuthenticationService.isSeller == true){
      this.IsSeller = true;
    }
    this.DispatchedOrderstextunsubscribe = this._OrdershipmentService.GetDispatchedOrderstext.subscribe(res=>{
      if(res != undefined){
        if(res == ""){
          this.GetDispatchedOrderData();
        }else{
          this.GetSelectedField();
          this.returnSearch(res);
        } 
      }else{
        this.GetDispatchedOrderData();
      }
    })
    this.SDateDispatchedOrders = this._OrdershipmentService.GetSDateDispatchedOrders.subscribe(date=>{ 
      this.StartDate = date;
    });
    this.EDateDispatchedOrders =  this._OrdershipmentService.GetEDateDispatchedOrders.subscribe(date=>{
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
        status : this.DispatchedOrderStatus,
        start_date:this.StartDate,
        end_date:this.EndDate,
        page: this.PageNo == undefined ? 1 : this.PageNo,
        limit:  this.limit == undefined ? 10:this.limit
      }
      this._OrdershipmentService.GetOrderDetail(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.DispatchedOrderList = res.data.docs
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
            status:this.DispatchedOrderStatus
          }
          this._OrdershipmentService.SetGetDispatchedOrders(ordervalue);
        }
      })
  }

  returnSearch(res:any){
      const data = {
        status : this.DispatchedOrderStatus,
        searchBy:this.selecteddropdownitem,
        pattern:res,
        page: this.PageNo == undefined ? 1 : this.PageNo,
        limit:  this.limit == undefined ? 10:this.limit
      }
      this._OrdershipmentService.GetOrderDetail(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.DispatchedOrderList = res.data.docs
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
            status:this.DispatchedOrderStatus
          }
          this._OrdershipmentService.SetGetDispatchedOrders(ordervalue);
        } 
      })
  }  

  async GetDispatchedOrderData(){
    const data = {
      status : this.DispatchedOrderStatus,
      page: this.PageNo == undefined ? 1 : this.PageNo,
      limit:  this.limit == undefined ? 10:this.limit
    }
    this._OrdershipmentService.GetOrderDetail(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.DispatchedOrderList = res.data.docs
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
          status:this.DispatchedOrderStatus
        }
        this._OrdershipmentService.SetGetDispatchedOrders(ordervalue);
      }else{
        this._SharedService.errorToast(res.message);
      } 
    })
  }

  PrintInvoice(item:any){
    const data = {
      orderNumber:item.orderNumber
    }
    this._PendingOrderService.GetInvoice(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.invoiceform = res.data
        this._SharedService.successToast("Invoice Print Doone")
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
    this.GetDispatchedOrderData()
    
  }
  onFirst(){
    if(this.hasPrevPage  == true){
      this.PageNo = 1
      this.GetDispatchedOrderData()
    }
  }

  onPrevious(){
    if(this.hasPrevPage  == true){
      this.PageNo = this.prevPage
      this.GetDispatchedOrderData()
    }
  }

  onNext(){
    if(this.hasNextPage  == true){
      this.PageNo = this.nextPage
      this.GetDispatchedOrderData()
    }
  }

  onLast(){
    if(this.hasNextPage  == true){
      this.PageNo = this.totalPages
      this.GetDispatchedOrderData()
    }
  }


  CarrierDetailClick(item:any){
    let carrierDetail = btoa(JSON.stringify(item));
    this.Route.navigate(['/user-profile/Ordershipment/CarrierDetail'],{ queryParams: {carrierDetail}});
  }

  ContactBuyer(productitem:any){
    $('#contactbuyer').modal("show");
    this.BuyerName=productitem.user_details.username;
    this.BuyerEmail=productitem.user_details.email
    this.BuyerMobile=productitem.user_details.mobile
  }

  ngOnDestroy(){
    this.SDateDispatchedOrders.unsubscribe();
    this.EDateDispatchedOrders.unsubscribe();
    this.DispatchedOrderstextunsubscribe.unsubscribe();
    this._OrdershipmentService.SetSelectedField(undefined);
    this._OrdershipmentService.SetGetDispatchedOrders({});
    this._OrdershipmentService.SetSDateDispatchedOrders(undefined);
    this._OrdershipmentService.SetEDateDispatchedOrders(undefined);
  }

}
