import { Component, OnInit, ViewChildren,OnDestroy, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from 'src/app/main/shared/shared.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewOrderService } from './new-order.service';
import { OrdershipmentService } from '../ordershipment.service';
import { Router } from '@angular/router';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
declare var $ :any;


@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit,OnDestroy{
  NewOrderStatus = 0;
  selecteddropdownitem:any;
  StartDate:any;
  EndDate:any;
  NewOrderList:any=[];
  today = new Date();
  ConfirmOrderArray:any=[];
  CancelOrderArray:any=[];
  index:any;
  Cancelindex:any;
  NotAvailNewOffer:boolean = false;
  PageNo:any;
  limit:any;
  totalPages:any;
  nextPage:any;
  hasNextPage:any;
  prevPage:any;
  hasPrevPage:any;
  docslength:any;
  NewOrderstextunsubscribe:any;
  SDateNewOrders:any;
  EDateNewOrders:any;
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');
  IsSeller:boolean = false;

  constructor(
    private _SharedService: SharedService,
    private _NewOrderService: NewOrderService,
    private _OrdershipmentService:OrdershipmentService,
    private Route:Router,
    private sanitizer:DomSanitizer,
    private _AuthenticationService:AuthenticationService
  ) { }

  ngOnInit(): void {
    if(this._AuthenticationService.isSeller == true){
      this.IsSeller = true;
    }
    this.NewOrderstextunsubscribe = this._OrdershipmentService.GetNewOrderstext.subscribe(res=>{
      if(res != undefined){
        if(res == ""){
          this.GetNewOrderList();
        }else{
          this.GetSelectedField();
          this.returnSearch(res);
        } 
      }else{
        this.GetNewOrderList();
      }
    });
    this.SDateNewOrders = this._OrdershipmentService.GetSDateNewOrders.subscribe(date=>{ 
    this.StartDate = date;
    });
    this.EDateNewOrders =  this._OrdershipmentService.GetEDateNewOrders.subscribe(date=>{
        this.EndDate = date;
        if(this.StartDate != undefined && this.EndDate != undefined){
          this.datewisedata();
        };
    });
  }
  ConfirmOrderForm: any = new FormGroup({
    InvoiceNumber: new FormControl(undefined, [Validators.required]),
    InvoiceDate: new FormControl(undefined, [Validators.required]),
  });
  get f(){
    return this.ConfirmOrderForm;
  }

  CancelOrderForm: any = new FormGroup({
    Reason: new FormControl(undefined,[Validators.required]),
  });

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
        status : this.NewOrderStatus,
        start_date:this.StartDate,
        end_date:this.EndDate,
        page: this.PageNo == undefined ? 1 : this.PageNo,
        limit:  this.limit == undefined ? 10:this.limit
      }
      this._OrdershipmentService.GetOrderDetail(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.NewOrderList = res.data.docs
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
            status:this.NewOrderStatus
          }
          this._OrdershipmentService.SetGetNewOrders(ordervalue);
        }
      })
  }

  returnSearch(searchtext:any){
      const data = {
        status : this.NewOrderStatus,
        searchBy:this.selecteddropdownitem,
        pattern:searchtext,
        page: this.PageNo == undefined ? 1 : this.PageNo,
        limit:  this.limit == undefined ? 10:this.limit
      }
      this._OrdershipmentService.GetOrderDetail(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.NewOrderList = res.data.docs
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
            status:this.NewOrderStatus
          }
          this._OrdershipmentService.SetGetNewOrders(ordervalue);
        }
      })
  }

  async GetNewOrderList(){
    const data = {
      status : this.NewOrderStatus,
      page: this.PageNo == undefined ? 1 : this.PageNo,
      limit:  this.limit == undefined ? 10:this.limit
    }
    this._OrdershipmentService.GetOrderDetail(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.NewOrderList = res.data.docs
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
          status:this.NewOrderStatus
        }
        this._OrdershipmentService.SetGetNewOrders(ordervalue);
      }else{
        this._SharedService.errorToast(res.message);
      }
    })
    if(this.NewOrderList.length >= 1){
      this.NotAvailNewOffer = false
    }
  }

  ConfirmOrderClick(item:any,index:any){
    this.ConfirmOrderArray = item.items;
    this.index = index+1
  }

  CancelOrderClick(item:any,index:any){
    this.CancelOrderArray = [item]
    this.Cancelindex = index
  }

  submitprint(f:any){
    if (f.valid) {
      let data = {
        orderNumber:this.ConfirmOrderArray[0].orderNumber,
        userId:this.ConfirmOrderArray[0].userId,
        invoiceNumber: this.sanitizer.sanitize(SecurityContext.HTML, f.value.InvoiceNumber),
        invoiceDate:f.value.InvoiceDate,
        status:1
      }
      this._NewOrderService.CreateInvoice(data).subscribe((res:any)=>{
        if(res.status == 201){
          this._SharedService.successToast(res.message)
          this.ConfirmOrderForm.reset();
          this.Route.navigate(['/user-profile/Ordershipment/PendingOrder']);
          $('#OrderShipmentsModel').modal('hide');
        }
        if(res.status == 409){
          this._SharedService.errorToast(res.message)
        }
        if(res.status == 500){
          this._SharedService.errorToast(res.message)
        }
      })
    } else {
      this.ConfirmOrderForm.markAllAsTouched();
    }
  }

  CancelOrder(CancelOrderForm:any){
    if (CancelOrderForm.valid) {
      let data = {
        "_id":this.CancelOrderArray[0]._id,
        "cancellationReason": this.sanitizer.sanitize(SecurityContext.HTML, CancelOrderForm.value.Reason),
        "cancellationComment":""
      };
      this._NewOrderService.cancelOrder(data).subscribe((res:any)=>{
        if(res.status == 200){
          this._SharedService.successToast(res.message);
          this.NewOrderList.splice(this.Cancelindex,1)
          $('#OrderShipmentsModelcancel').modal('hide');
          this._SharedService.successToast("Your Order is Canceled");
          this.CancelOrderForm.reset();
          this.Route.navigate(['/user-profile/Ordershipment/Cancel-Return']);
          if(this.NewOrderList.length <=0){
            this.NotAvailNewOffer = true
          }
        }else{
            console.log("cancelorder error...");
          }
        },err=>{
          console.log(err,"err");
        });
    } else {
      this.CancelOrderForm.markAllAsTouched();
    }
  }


  SelectItemsPerPage(event:any){
    this.limit = event.target.value
    this.GetNewOrderList();
  }
  onFirst(){
    if(this.hasPrevPage  == true){
      this.PageNo = 1
      this.GetNewOrderList();
    }
  }

  onPrevious(){
    if(this.hasPrevPage  == true){
      this.PageNo = this.prevPage
      this.GetNewOrderList();
    }
  }

  onNext(){
    if(this.hasNextPage  == true){
      this.PageNo = this.nextPage
        this.GetNewOrderList();
    }
  }

  onLast(){
    if(this.hasNextPage  == true){
      this.PageNo = this.totalPages
        this.GetNewOrderList();
    }
  }

  ngOnDestroy(){
    this.NewOrderstextunsubscribe.unsubscribe();
    this.SDateNewOrders.unsubscribe();
    this.EDateNewOrders.unsubscribe();
    this._OrdershipmentService.SetSelectedField(undefined);
    this._OrdershipmentService.SetGetNewOrders({});
    this._OrdershipmentService.SetSDateNewOrders(undefined);
    this._OrdershipmentService.SetEDateNewOrders(undefined);
  }

}
