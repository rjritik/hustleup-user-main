import { Component, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { SharedService } from 'src/app/main/shared/shared.service';
import { SelectAddressService } from './select-address.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UserprofileService } from '../../userprofile/userprofile.service';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service';
declare var $ :any;

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.component.html',
  styleUrls: ['./select-address.component.css']
})
export class SelectAddressComponent implements OnInit,OnDestroy{
  NotavailAddress: boolean = true;
  SetdefaultValue:boolean
  OrderAddressList:any = [];
  getpaymentsummary:any;
  oldPinCode:any;
  countryName:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'countryName');

  private checkPincodeSubject: Subject<string> = new Subject();
  isDeliveryAvailable:any;

  checkPincodeUnsub$: Subscription;
  subscriptions: Subscription[] = []

  OrderAddressForm: any = new FormGroup({
    firstname: new FormControl(undefined, [Validators.required]),
    lastname: new FormControl(undefined, [Validators.required]),
    address: new FormControl(undefined, [Validators.required]),
    street: new FormControl(undefined, [Validators.required]),
    city: new FormControl(undefined, [Validators.required]),
    state: new FormControl(undefined, [Validators.required]),
    pincode: new FormControl(undefined, [
      Validators.required,
      Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$'),
    ]),
    country: new FormControl(undefined, [Validators.required]),
    mobile: new FormControl(undefined, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    email: new FormControl(undefined, [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    isDefault: new FormControl(),
  });

  get f() {
    return this.OrderAddressForm;
  }

  constructor(
    private _SelectAddressService:SelectAddressService,
    private _SharedService: SharedService,
    private _router:Router,
    private sanitizer:DomSanitizer,
    private _UserprofileService:UserprofileService,
    private _AuthenticationService:AuthenticationService,
  ){}

  ngOnInit(): void {
    this._SharedService.shoppingcart.next("true");
    this.GetOrderedAddress();
    this.DebounceMethods();
    this.UnsubscribeMethods();
  }


  UnsubscribeMethods(){
    this.subscriptions.push(this.checkPincodeUnsub$);
  };

  DebounceMethods(){
    this.checkPincodeUnsub$ = this.checkPincodeSubject.pipe(debounceTime(500)).subscribe((searchPinValue:any) => {
      this.getPincodeAvailability(searchPinValue);
    });
  }

  checkPincode(){
    if(this.OrderAddressForm.controls.pincode.status =="VALID") this.checkPincodeSubject.next(this.f.value.pincode);   
  }

  getPincodeAvailability(pin:any){
    if(this.oldPinCode !== pin){
      this.oldPinCode = pin;
      const data = {
        pincode:pin,
        countrycode:this._AuthenticationService.currentUserValue.countryCode
      }
      this._UserprofileService.checkPostalPincode(data).subscribe((res:any) => {
        if(res.status && res.result.length){
          this.OrderAddressForm.patchValue({
            country:this.countryName,
            state:res.result[0].state,
            city:res.result[0].district
          });
        }else{
          this.OrderAddressForm.patchValue({
            country:undefined,
            state:undefined,
            city:undefined
          });
          this._SharedService.errorToast("Something went wrong");
        }
      });  
    }
  }

  AddNewAddress(){
    $('.modal#add-address-shopping').modal({
      backdrop: 'static',
      keyboard: false
    });
  }

  async GetOrderedAddress() {
    await this._SelectAddressService.GetMyAddress().subscribe((res: any) => {
      if (res.status === 200) {
        this.OrderAddressList = res.data;
        this.selectedaddress();
        if (this.OrderAddressList.length > 0) {
          this.NotavailAddress = false;
        }
      }
    });
  }

  async OrderAddAddress(f:any){
    if (f.valid) {
      if(this.OrderAddressList.length == 0){
        this.SetdefaultValue = true
      }else{
        if(f.value.isDefault == null){
          this.SetdefaultValue = false
        }else{
         this.SetdefaultValue = f.value.isDefault
        }
      }
      let data = {
        firstName: this.sanitizer.sanitize(SecurityContext.HTML , f.value.firstname),
        lastName: this.sanitizer.sanitize(SecurityContext.HTML , f.value.lastname),
        address: this.sanitizer.sanitize(SecurityContext.HTML , f.value.address),
        street: this.sanitizer.sanitize(SecurityContext.HTML , f.value.street),
        city: this.sanitizer.sanitize(SecurityContext.HTML , f.value.city),
        state: this.sanitizer.sanitize(SecurityContext.HTML , f.value.state),
        pincode: this.sanitizer.sanitize(SecurityContext.HTML , f.value.pincode),
        country: this.sanitizer.sanitize(SecurityContext.HTML , f.value.country),
        mobile: this.sanitizer.sanitize(SecurityContext.HTML , f.value.mobile),
        email: this.sanitizer.sanitize(SecurityContext.HTML , f.value.email),
        isDefault: this.SetdefaultValue,
      };
      this.OrderAddressList.push(data);
      $('#add-address-shopping').modal('hide');
      this.NotavailAddress = false;

      await this._SelectAddressService.AddMyaddress(data).subscribe((res: any) => {
        if (res.status === 201) {
          this.GetOrderedAddress()
          this._SharedService.successToast("Address added successfully");
          this.OrderAddressForm.reset();
          if(this.OrderAddressList.length > 1 && res.data.isDefault == true){
            this.MakeDefaultAddress(res.data)
          }
          this.NotavailAddress = false;
        }
      });
    } else {
      this.OrderAddressForm.markAllAsTouched();
    }
  }


  selectedaddress(){
    this.OrderAddressList.forEach((result: any, i: any) => {
      if (result.isDefault == true) {
        this._SharedService.isSelectedAddress.next(result);
      }
    });
  }

  async MakeDefaultAddress(item: any) {
    const data = { addressId: item._id };
    await this._SelectAddressService.MakeDefaultMyaddress(data).subscribe((res: any) => {
      if (res.status == 200) {
        this.OrderAddressList.forEach((result: any, i: any) => {
          if (result._id == item._id) {
            return (result.isDefault = true);
          } else {
            return (result.isDefault = false);
          }
        });        
        this.selectedaddress();
        this._SharedService.successToast("Default Address Successfully");
      }
    });
  }

  CancelAddress(){
    $('#add-address-shopping').modal('hide');
  }
  radioclick(item:any){
    console.log(item,"item")
  }

  ngOnDestroy(){
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

}
