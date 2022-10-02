import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { SharedService } from 'src/app/main/shared/shared.service';
import { PendingOrderService } from '../pending-order/pending-order.service';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
declare var $ :any;

@Component({
  selector: 'app-self-ship',
  templateUrl: './self-ship.component.html',
  styleUrls: ['./self-ship.component.css']
})
export class SelfShipComponent implements OnInit {
  public courierpartner:any = Array<Select2OptionData>();
  exampleCourierPartner:any = Array<Select2OptionData>()
  SelectedSelfShipDetail:any=[]
  today=new Date()
  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');

  constructor(private Route:Router,
              private Activateroute:ActivatedRoute,
              private _PendingOrderService:PendingOrderService,
              private _SharedService: SharedService,
              private _AuthenticationService:AuthenticationService,
              private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this.Activateroute.queryParams.subscribe((data:any)=>{
      const getData = JSON.parse((atob(data.SelfshipDetail)))
      this.SelectedSelfShipDetail = getData.items
      console.log(this.SelectedSelfShipDetail,"this.SelectedSelfShipDetail")
    })
    this.GetCourierPartner()
  }
  ShippingForm: any = new FormGroup({
    carrierid: new FormControl('', [Validators.required]),
    trackingid: new FormControl(undefined, [Validators.required]),
    shipmentdate: new FormControl(undefined, [Validators.required]),
  });

  get f() {
    return this.ShippingForm;
  }

  AddCourierPartnerForm: any = new FormGroup({
    partnername: new FormControl(undefined, [Validators.required]),
    websiteurl: new FormControl(undefined, [Validators.required,Validators.pattern(this.reg)]),
  });

  get partnerform() {
    return this.AddCourierPartnerForm;
  }

  shipmentback(){
    this.Route.navigate(['/user-profile/Ordershipment/PendingOrder']);
  }

  ConfirmShipment(f:any){
    if(f.valid){
      let data ={
        status:3,
        orderNumber: this.sanitizer.sanitize(SecurityContext.HTML,this.SelectedSelfShipDetail[0].invoices_details[0].orderNumber),
        invoiceId:this.SelectedSelfShipDetail[0].invoices_details[0]._id,
        courierPartnerId:f.value.carrierid,
        trackingId: this.sanitizer.sanitize(SecurityContext.HTML,f.value.trackingid),
        shipmentDate:f.value.shipmentdate
    }  
      this._PendingOrderService.createorderselfship(data).subscribe((res:any)=>{
        if(res.status == 201){
          this.Route.navigate(['/user-profile/Ordershipment/DispatchedOrder']);
          this._SharedService.successToast(res.message)
        }
        if(res.status == 500){
          this._SharedService.errorToast(res.message)
        }
        if(res.status == 401){
          this._SharedService.successToast(res.message)
        }
      })
    }else{
      this.ShippingForm.markAllAsTouched()
    }
  }

  GetCourierPartner(){
    this._PendingOrderService.getcourierpartner().subscribe((res:any)=>{
      if(res.status == 200){
        res.data.forEach((ele:any) => {
          const example={
            id:ele._id,
            text:ele.courierPartnerName
          }
          this.exampleCourierPartner.push(example)
        });
        this.courierpartner = this.exampleCourierPartner 
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  AddCourierPartnerSubmit(partnerform:any){
    if(partnerform.valid){
      let data =  {
        courierPartnerName: this.sanitizer.sanitize(SecurityContext.HTML,partnerform.value.partnername),
        websiteName: this.sanitizer.sanitize(SecurityContext.HTML,partnerform.value.websiteurl)
      }
      this._PendingOrderService.addcourierpartner(data).subscribe((res:any)=>{
        if(res.status == 201){
          this.exampleCourierPartner=[]
          this.GetCourierPartner()
          $('#add-new-courier').modal('hide');
          this._SharedService.successToast(res.message)
        }
        if(res.status == 500){
          this._SharedService.errorToast(res.message)
        }
        if(res.status == 401){
          this._SharedService.errorToast(res.message)
        }
      })
      
    }else{
      this.AddCourierPartnerForm.markAllAsTouched()
    }
  }
}
