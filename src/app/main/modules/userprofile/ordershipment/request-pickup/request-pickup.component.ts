import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { SharedService } from 'src/app/main/shared/shared.service';
import { OrdershipmentService } from '../ordershipment.service'
import { PendingOrderService } from '../pending-order/pending-order.service';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';

@Component({
  selector: 'app-request-pickup',
  templateUrl: './request-pickup.component.html',
  styleUrls: ['./request-pickup.component.css']
})
export class RequestPickupComponent implements OnInit {
  schedulepickdate = false;
  PackageWeight:any;
  today=new Date();
  public packageweight:any = Array<Select2OptionData>();
  public packagedimension:any = Array<Select2OptionData>();
  // public PickupDate:any = Array<Select2OptionData>();
  // public PickupTime:any = Array<Select2OptionData>();
  SelectedPickupDetail:any=[]
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');
  spinnerShow:boolean = false;
  orderTotalPrice:number = 0;

  constructor(
    private _ActivateRouteroute: ActivatedRoute,
    private Route:Router,
    private _PendingOrderService:PendingOrderService,
    private _SharedService: SharedService,
    private _AuthenticationService:AuthenticationService,
    private sanitizer:DomSanitizer
  ) { }

  ngOnInit(): void {
    this._ActivateRouteroute.queryParams.subscribe((data:any)=>{
      const getData = JSON.parse((atob(data.PickupDetail)))
      this.SelectedPickupDetail = getData.items
      const tempArray:any = [];
      this.SelectedPickupDetail.forEach((ele:any) => {
        tempArray.push(ele.totalPrice)
      });
      let initialValue = 0
      this.orderTotalPrice = tempArray.reduce((previousValue:any, currentValue:any) => previousValue + currentValue, initialValue);
    });
    this.packageweight = [
      {
        id: 'gm',
        text: 'Grams (g)'
      },
      {
        id: 'pounds',
        text: 'Pounds'
      },
      {
        id: 'kg',
        text: 'Kilograms'
      },
      {
        id: 'ounce',
        text: 'Ounce'
      },
      {
        id: 'stones',
        text: 'Stones'
      }
    ]
    this.packagedimension = [
      {
        id: 'cm',
        text: 'Centimeter (Cm)'
      },
      {
        id: 'meter',
        text: 'metres'
      },
      {
        id: 'mm',
        text: 'millimetres'
      },
      {
        id: 'inch',
        text: 'inches'
      },
    ]
    // this.PickupDate = [
    //   {
    //     id: 'Sat,Jun 27',
    //     text: 'Sat,Jun 27'
    //   },
    //   {
    //     id: 'Sun,Jun 28',
    //     text: 'Sun,Jun 28'
    //   },
    //   {
    //     id: 'Mon,Jun 29',
    //     text: 'Mon,Jun 29'
    //   },
    // ]
    // this.PickupTime = [
    //   {
    //     id: '10 AM - 1 PM',
    //     text: '10 AM - 1 PM'
    //   },
    //   {
    //     id: '10 AM - 5 PM',
    //     text: '10 AM - 5 PM'
    //   },
    //   {
    //     id: '1 PM - 9 PM',
    //     text: '1 PM - 9 PM'
    //   },
    // ]
    this.weightUnitValueChanged();
    this.dimensionUnitValueChanged();
  }
  PackageDetailForm: any = new FormGroup({
    weightUnit: new FormControl('gm', [Validators.required]),
    packageweight: new FormControl(undefined, [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(100000)]),
    dimensionUnit: new FormControl('cm', [Validators.required]),
    packagelength: new FormControl(undefined, [Validators.required,Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(1000)]),
    packagewidth: new FormControl(undefined, [Validators.required,Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(1000)]),
    packageheight: new FormControl(undefined, [Validators.required,Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(1000)]),
    waybillNumber: new FormControl(undefined),
    savedetail: new FormControl(false)
  });

  get f() {
    return this.PackageDetailForm;
  }

  // PickupForm: any = new FormGroup({
  //   pickupdate: new FormControl('', [Validators.required]),
  //   pickuptime: new FormControl('', [Validators.required]),
  // });
  // get pickupformRes() {
  //   return this.PickupForm;
  // }

  weightUnitValueChanged(){
    this.PackageDetailForm.get('weightUnit').valueChanges.subscribe((val:any) => {
      if(val == 'gm'){
        this.PackageDetailForm.controls['packageweight'].setValidators([Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(100000)]);  
      }else if(val == 'pounds'){
        this.PackageDetailForm.controls['packageweight'].setValidators([Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(220)]);  
      }else if(val == 'kg'){
        this.PackageDetailForm.controls['packageweight'].setValidators([Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(100)]);  
      }else if(val == 'ounce'){
        this.PackageDetailForm.controls['packageweight'].setValidators([Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(3520)]);  
      }else if(val == 'stones')  { 
        this.PackageDetailForm.controls['packageweight'].setValidators([Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(15.7)]);  
      }
      this.PackageDetailForm.controls['packageweight'].updateValueAndValidity();
    });
  }

  dimensionUnitValueChanged(){
    this.PackageDetailForm.get('dimensionUnit').valueChanges.subscribe((val:any) => {
      if(val == 'cm'){
        this.PackageDetailForm.controls['packagelength'].setValidators([Validators.required,Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(1000)]);  
        this.PackageDetailForm.controls['packagewidth'].setValidators([Validators.required,Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(1000)]);  
        this.PackageDetailForm.controls['packageheight'].setValidators([Validators.required,Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(1000)]);
      }else if(val == 'meter'){
        this.PackageDetailForm.controls['packagelength'].setValidators([Validators.required,Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(10)]);  
        this.PackageDetailForm.controls['packagewidth'].setValidators([Validators.required,Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(10)]);  
        this.PackageDetailForm.controls['packageheight'].setValidators([Validators.required,Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(10)]);
      }else if(val == 'mm'){
        this.PackageDetailForm.controls['packagelength'].setValidators([Validators.required,Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(10000)]);  
        this.PackageDetailForm.controls['packagewidth'].setValidators([Validators.required,Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(10000)]);  
        this.PackageDetailForm.controls['packageheight'].setValidators([Validators.required,Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(10000)]);
      }else if(val == 'inch'){
        this.PackageDetailForm.controls['packagelength'].setValidators([Validators.required,Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(393.40)]);  
        this.PackageDetailForm.controls['packagewidth'].setValidators([Validators.required,Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(393.40)]);  
        this.PackageDetailForm.controls['packageheight'].setValidators([Validators.required,Validators.pattern('^[0-9]+(.[0-9]{0,1})?$'),Validators.max(393.40)]);
      }
      this.PackageDetailForm.controls['packagelength'].updateValueAndValidity();
      this.PackageDetailForm.controls['packagewidth'].updateValueAndValidity();
      this.PackageDetailForm.controls['packageheight'].updateValueAndValidity();
    });
  }

  shipmentback(){
    this.Route.navigate(['/user-profile/Ordershipment/PendingOrder']);
  }

  // SchedulePickupClick(f:any){
  //   if(f.valid){
  //     this.PackageWeight = [
  //       {
  //         weightType: this.sanitizer.sanitize(SecurityContext.HTML, this.SelectedWeightUnit),
  //         weightValue:f.value.packageweight
  //       }
  //     ];
  //     this.packageDimension = [
  //       {
  //         dimensionType: this.sanitizer.sanitize(SecurityContext.HTML, this.SelectDimensionUnit),
  //         length:f.value.packagelength,
  //         width:f.value.packagewidth,
  //         height:f.value.packageheight
  //       }
  //     ]
  //     this.schedulepickdate = true
  //   }else{
  //     this.PackageDetailForm.markAllAsTouched()
  //   }
  // }

  RequestPickupClick(f:any){
    if(f.valid){
      if(f.value.packageweight !== 0 && f.value.packagelength !== 0 && f.value.packagewidth !== 0 && f.value.packageheight !== 0){
        this.spinnerShow = true;
        let data:any={   
          orderNumber:this.SelectedPickupDetail[0].orderNumber,
          status:2,
          invoiceId:this.SelectedPickupDetail[0].invoices_details[0]._id,
          packageWeight:[{
            weightType: this.sanitizer.sanitize(SecurityContext.HTML, f.value.weightUnit),
            weightValue:f.value.packageweight
          }],
          packageDimension:[{
            dimensionType: this.sanitizer.sanitize(SecurityContext.HTML, f.value.dimensionUnit),
            length:f.value.packagelength,
            width:f.value.packagewidth,
            height:f.value.packageheight
          }]
          // pickupDate:pickupformRes.value.pickupdate,
          // pickupTime:pickupformRes.value.pickuptime
        }
        if(this.orderTotalPrice> 50000){ 
          data.sellerEWayBillNumber=f.value.waybillNumber
        }
        this._PendingOrderService.CreateOrderPickup(data).subscribe((res:any)=>{
         this.spinnerShow = false;
          if(res.status == 201){
            this._SharedService.successToast(res.message)
            this.Route.navigate(['/user-profile/Ordershipment/ProcessedOrder']);
          }else{
            this._SharedService.errorToast(res.message)
          }
        })
      }else{
        this._SharedService.errorToast("Please enter valid Parameter Value");
      }
    }else{
      this.PackageDetailForm.markAllAsTouched()
    }
  }


}
