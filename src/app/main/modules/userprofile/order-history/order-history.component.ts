import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { AuthenticationService } from 'src/app/main/auth/service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { OrderhistoryService } from './orderhistory.service';
declare var $ :any;

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  public Reasons:any = Array<Select2OptionData>();
  orderhistoryreturn = false;
  orderhistorymain = true;
  OrderHistoryList:any=[];
  NotAvailOrderList:boolean = true
  IsUser:boolean = false;
  invoiceform:any=[];
  IsRequest:boolean;
  orderhistoryid:any;
  SellerName:any;
  SellerEmail:any;
  SellerMobile:any;
  SellerWebsite:any;
  PageNo:any;
  limit:any;
  totalPages:any;
  nextPage:any;
  hasNextPage:any
  prevPage:any;
  hasPrevPage:any;
  docslength:any;
  constructor(private _OrderhistoryService:OrderhistoryService,
              private _AuthenticationService:AuthenticationService,
              private _SharedService: SharedService,
              private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    if(this._AuthenticationService.isUser == true){
      this.IsUser = true
    }else{
      this.IsUser = false
    }
    this.GetOrderHistoryList();
    this.Reasons = [
      {
        id: 'Ordered out of excitement and realised its of no need',
        text: 'Ordered out of excitement and realised its of no need'
      },
      {
        id: 'Recipient not available at the estimated time/day of delivery',
        text: 'Recipient not available at the estimated time/day of delivery'
      },
      {
        id: 'Found the same product on another website or a shop at a lower price',
        text: 'Found the same product on another website or a shop at a lower price'
      },
      {
        id: 'Changed my mind and opt for another product/brand instead',
        text: 'Changed my mind and opt for another product/brand instead'
      },
      {
        id: 'Product is taking too long to be delivered',
        text: 'Product is taking too long to be delivered'
      },
      {
        id: 'My reason is not listed above',
        text: 'My reason is not listed above'
      },
    ]
  }

  ReturnForm: any = new FormGroup({
    reasontype: new FormControl('', [Validators.required]),
    comment: new FormControl(undefined, [Validators.required])
  });

  get f() {
    return this.ReturnForm;
  }


  GetOrderHistoryList(){
    const data = {
      page: this.PageNo == undefined ? 1 : this.PageNo,
      limit:  this.limit == undefined ? 10:this.limit
    }
    this._OrderhistoryService.getorderhistory(data).subscribe((res:any)=>{
      this.OrderHistoryList = res.data.docs
      this.PageNo = res.data.page
      this.limit = res.data.limit
      this.totalPages = res.data.totalPages
      this.nextPage = res.data.nextPage
      this.prevPage = res.data.prevPage
      this.hasNextPage = res.data.hasNextPage
      this.hasPrevPage = res.data.hasPrevPage
      this.docslength = res.data.totalDocs
      if(this.OrderHistoryList.length >=1){
        this.NotAvailOrderList = false;
      }
    })
  }

  ContactSeller(item:any){
    $('#contactseller').modal("show");
    this.SellerName=item.seller_details.username;
    this.SellerEmail=item.seller_details.email;
    this.SellerMobile=item.seller_details.mobile;
    this.SellerWebsite=item.seller_details.website;
  }

  PrintInvoice(item:any){
    const data = {
      orderNumber:item.orderNumber
    }
    this._OrderhistoryService.GetInvoice(data).subscribe((res:any)=>{
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

  CancelOrder(data:any){
    this.orderhistoryid = data._id;
    this.orderhistoryreturn = true;
    this.orderhistorymain = false;
    this.IsRequest = false;
  }

  ConfirmCancelOrder(f:any){
    if(f.valid){
      let data = {
        "_id":this.orderhistoryid,
        "cancellationReason": this.sanitizer.sanitize(SecurityContext.HTML, f.value.reasontype),
        "cancellationComment": this.sanitizer.sanitize(SecurityContext.HTML, f.value.comment)
      }
      this._OrderhistoryService.cancelOrder(data).subscribe((res:any)=>{
        if(res.status == 200){
          this._SharedService.successToast(res.message);
          this.GetOrderHistoryList();
          this.orderhistoryreturn = false;
          this.orderhistorymain = true;
        }
        if(res.status == 500){
          this._SharedService.errorToast(res.message);
        }
        if(res.status == 401){
          this._SharedService.errorToast(res.message);
        }
      },err=>{
        console.log(err,"err");
      });
    }else{
      this.ReturnForm.markAllAsTouched();
    }
  }

  returnorder(data:any){
    this.orderhistoryid = data._id;
    this.orderhistoryreturn = true;
    this.orderhistorymain = false;
    this.IsRequest = true;
  }

  RequestForReturn(f:any){
    if(f.valid){
      let data = {
        "_id":this.orderhistoryid,
        "cancellationReason": this.sanitizer.sanitize(SecurityContext.HTML, f.value.reasontype),
        "cancellationComment": this.sanitizer.sanitize(SecurityContext.HTML, f.value.comment)
      }
      this._OrderhistoryService.returnOrder(data).subscribe((res:any)=>{
        if(res.status == 204){
          this._SharedService.successToast(res.message);
          this.GetOrderHistoryList();
          this.orderhistoryreturn = false;
          this.orderhistorymain = true;
        }
        if(res.status == 500){
          this._SharedService.errorToast(res.message);
        }
        if(res.status == 403){
          this._SharedService.errorToast(res.message);
        }
        if(res.status == 401){
          this._SharedService.errorToast(res.message);
        }
      },err=>{
        console.log(err);
      })
    }else{
      this.ReturnForm.markAllAsTouched();
    }
  }

  returnordercancel(){
    this.orderhistoryreturn = false;
    this.orderhistorymain = true;
  }

  // for pagination
  SelectItemsPerPage(event:any){
    this.limit = event.target.value
    this.GetOrderHistoryList();
  }
  onFirst(){
    if(this.hasPrevPage  == true){
      this.PageNo = 1
      this.GetOrderHistoryList();
    }
  }

  onPrevious(){
    if(this.hasPrevPage  == true){
      this.PageNo = this.prevPage
      this.GetOrderHistoryList();
    }
  }

  onNext(){
    if(this.hasNextPage  == true){
      this.PageNo = this.nextPage
      this.GetOrderHistoryList();
    }
  }

  onLast(){
    if(this.hasNextPage  == true){
      this.PageNo = this.totalPages
      this.GetOrderHistoryList();
    }
  }

}
