import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PendingOrderService } from '../pending-order/pending-order.service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { OrderhistoryService } from '../../order-history/orderhistory.service';

@Component({
  selector: 'app-self-drop',
  templateUrl: './self-drop.component.html',
  styleUrls: ['./self-drop.component.css']
})
export class SelfDropComponent implements OnInit {
  selectedfilename:any;
  UploadNoStatement:boolean;
  UploadformData:any = new FormData();
  SelectedSelfDropDetail:any=[];
  Isrequstcreatebtnshow:boolean = true;
  PrintInvoicedata:any=[];


  constructor(private Route:Router,
              private Activateroute:ActivatedRoute,
              private _PendingOrderService:PendingOrderService,
              private _SharedService: SharedService,
              private _OrderhistoryService:OrderhistoryService,
              private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this.Activateroute.queryParams.subscribe((data:any)=>{
      const getData = JSON.parse((atob(data.SelfDropDetail)))
      this.SelectedSelfDropDetail = getData.items
      this.VerifySelfDropData()
    });
  }

  // get f() {
  //   return this.DeliveryUploadForm;
  // }

  VerifySelfDropData(){
    let data= {
      orderNumber: this.sanitizer.sanitize(SecurityContext.HTML, this.SelectedSelfDropDetail[0].orderNumber)
    }
    this._PendingOrderService.varifyselfdropdata(data).subscribe((res:any)=>{
      if(res.status == 200){
        if(res.data != undefined){
          if(res.data.selfDropStatus == 0){
            this.Isrequstcreatebtnshow = false;
          }
          if(res.data.selfDropStatus == 1){
            this.Isrequstcreatebtnshow = true;
          }
        } 
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  RequestAcceptance(){
    let data= {
      orderNumber: this.sanitizer.sanitize(SecurityContext.HTML, this.SelectedSelfDropDetail[0].orderNumber) 
    }
    this._PendingOrderService.createselfdroprequest(data).subscribe((res:any)=>{
      if(res.status == 201 || res.status == 200){
        this.Isrequstcreatebtnshow = false;
        this._SharedService.successToast(res.message)
        this.selfDropNotificationRequestEmit(this.sanitizer.sanitize(SecurityContext.HTML, this.SelectedSelfDropDetail[0].orderNumber), 0)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 404){
        this._SharedService.successToast(res.message)
      }
    })
  }

  RequestCancel(){
    let data= {
      orderNumber: this.sanitizer.sanitize(SecurityContext.HTML, this.SelectedSelfDropDetail[0].orderNumber)
    }
    this._PendingOrderService.cancelselfdroprequest(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.Isrequstcreatebtnshow = true;
        this._SharedService.successToast(res.message)
        this.selfDropNotificationRequestEmit(this.sanitizer.sanitize(SecurityContext.HTML, this.SelectedSelfDropDetail[0].orderNumber), 1)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  selfDropNotificationRequestEmit(orderNumber:any, selfDropStatus:Number){
    const data = {
      orderNumber:orderNumber,
      selfDropStatus:selfDropStatus
    }
    this._SharedService.emit("create-remove-self-drop-notification",data)
  }

  print(){
    let data= {
      orderNumber: this.sanitizer.sanitize(SecurityContext.HTML,this.SelectedSelfDropDetail[0].orderNumber)
    }
    this._OrderhistoryService.GetInvoice(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.PrintInvoicedata = res.data
        this._SharedService.successToast("Invoice Print Done")
        setTimeout(() => {
          const printContent = document.getElementById("SelfDropInvoicePrint") as HTMLElement
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

  shipmentback(){
    this.Route.navigate(['/user-profile/Ordershipment/PendingOrder']);
  }

  //------------------------------------------- for upload delivery note start---------------------------------------------------------

  // onFileInput(input: any): void {
  //   function formatBytes(bytes: number): string {
  //     const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  //     const factor = 1024;
  //     let index = 0;

  //     while (bytes >= factor) {
  //       bytes /= factor;
  //       index++;
  //     }
  //     return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
  //   }
  //  const files = input.target.files[0];
  //  console.log(files,"files")
  // // this.UploadformData.append("PANFile",files);
  //   this.selectedfilename = `${files.name} (${formatBytes(files.size)})`;
  //   $("input.ng-touched.ng-dirty.ng-valid").parent('button').removeAttr("style");
  // }

  // Submit(f:any){
  //   if(!f.value.uploadphotoname){
  //     this.UploadNoStatement = true;
  //   }else{
  //     this.UploadNoStatement = false;
  //   }
  //   if(f.valid){
  //     const data = {
  //       uploadphotoname:f.value.uploadphotoname
  //     }
  //     console.log(data,"data")
  //     this.uploaddelivary = false;
  //   }else{
  //     this.DeliveryUploadForm.markAllAsTouched()
  //     setTimeout(() => {
  //       $("input.ng-pristine.ng-invalid.ng-touched").parent('button').css({"border":"1px solid red"});
  //     }, 100);
  //   }
  // }

  //------------------------------------------- for upload delivery note end--------------------------------------------------------

}
