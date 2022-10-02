import { Component, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Select2OptionData } from 'ng-select2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyAddressService } from './my-address.service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UserprofileService } from '../userprofile.service';

@Component({
  selector: 'app-my-address',
  templateUrl: './my-address.component.html',
  styleUrls: ['./my-address.component.css'],
})
export class MyAddressComponent implements OnInit,OnDestroy {
  public addresscountry: any = Array<Select2OptionData>();
  isDefaultShow:boolean;
  NotavailAddress: boolean = true;
  addnewaddress: boolean = false;
  myaddressmain: boolean = true;
  editaddress: boolean = true;
  MyAddressList: any = [];
  _id: any;
  SetdefaultValue:boolean;
  countryName:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'countryName');
  oldPinCode:any;

  private checkPincodeSubject: Subject<string> = new Subject();
  isDeliveryAvailable:any;

  checkPincodeUnsub$: Subscription;
  subscriptions: Subscription[] = []


  addressform: any = new FormGroup({
    firstName: new FormControl(undefined, [Validators.required]),
    lastName: new FormControl(undefined, [Validators.required]),
    address: new FormControl(undefined, [Validators.required]),
    street: new FormControl(undefined, [Validators.required]),
    city: new FormControl(undefined, [Validators.required]),
    state: new FormControl(undefined, [Validators.required]),
    pincode: new FormControl(undefined, [
      Validators.required,
      Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$'),
    ]),
    country: new FormControl('', [Validators.required]),
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
    return this.addressform;
  }


  constructor(
    private _MyAddressService: MyAddressService,
    private _SharedService: SharedService,
    private sanitizer: DomSanitizer,
    private _AuthenticationService:AuthenticationService,
    private _UserprofileService: UserprofileService
  ) {}

  ngOnInit(): void {
    this.GetMyAddress();
    this.DebounceMethods();
    this.UnsubscribeMethods();
  }

  async GetMyAddress() {
    await this._MyAddressService.GetMyAddress().subscribe((res: any) => {
      if (res.status === 200) {
        this.MyAddressList = res.data;
        if (this.MyAddressList.length > 0) {
          this.NotavailAddress = false;
        }
      }
    });
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
    if(this.addressform.controls.pincode.status =="VALID") this.checkPincodeSubject.next(this.f.value.pincode);   
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
          this.addressform.patchValue({
            country:this.countryName,
            state:res.result[0].state,
            city:res.result[0].district
          });
        }else{
          this.addressform.patchValue({
            country:undefined,
            state:undefined,
            city:undefined
          });
          this._SharedService.errorToast("Something went wrong");
        }
      });  
    }
  }

  async AddMyAddress(f: any) {

    if (f.valid) {
      if(this.MyAddressList.length == 0){
        this.SetdefaultValue = true
      }else{
        if(f.value.isDefault == null){
          this.SetdefaultValue = false
        }else{
         this.SetdefaultValue = f.value.isDefault
        }
      }
      let data = {
        firstName : this.sanitizer.sanitize(SecurityContext.HTML, f.value.firstName),
        lastName : this.sanitizer.sanitize(SecurityContext.HTML, f.value.lastName),
        address : this.sanitizer.sanitize(SecurityContext.HTML, f.value.address),
        street : this.sanitizer.sanitize(SecurityContext.HTML, f.value.street),
        city : this.sanitizer.sanitize(SecurityContext.HTML, f.value.city),
        state : this.sanitizer.sanitize(SecurityContext.HTML, f.value.state),
        pincode : this.sanitizer.sanitize(SecurityContext.HTML, f.value.pincode),
        country : this.sanitizer.sanitize(SecurityContext.HTML, f.value.country),
        mobile : this.sanitizer.sanitize(SecurityContext.HTML, f.value.mobile),
        email : this.sanitizer.sanitize(SecurityContext.HTML, f.value.email),
        isDefault : this.SetdefaultValue
      };
      await this._MyAddressService.AddMyaddress(data).subscribe((res: any) => {
        if (res.status === 201) {
          this.MyAddressList.push(res.data);
          this._SharedService.successToast("Address added successfully");
          this.addressform.reset();
          if(this.MyAddressList.length > 1 && res.data.isDefault == true){
            this.MakeDefaultAddress(res.data)
          }
          this.addnewaddress = false;
          this.myaddressmain = true;
          this.NotavailAddress = false;
        }
      });
    } else {
      this.addressform.markAllAsTouched();
    }
  }

  async UpdateMyAddressForm(f: any) {
    if (f.valid) {
      let data = {
        firstName : this.sanitizer.sanitize(SecurityContext.HTML, f.value.firstName),
        lastName : this.sanitizer.sanitize(SecurityContext.HTML, f.value.lastName),
        address : this.sanitizer.sanitize(SecurityContext.HTML, f.value.address),
        street : this.sanitizer.sanitize(SecurityContext.HTML, f.value.street),
        city : this.sanitizer.sanitize(SecurityContext.HTML, f.value.city),
        state : this.sanitizer.sanitize(SecurityContext.HTML, f.value.state),
        pincode : this.sanitizer.sanitize(SecurityContext.HTML, f.value.pincode),
        country : this.sanitizer.sanitize(SecurityContext.HTML, f.value.country),
        mobile : this.sanitizer.sanitize(SecurityContext.HTML, f.value.mobile),
        email : this.sanitizer.sanitize(SecurityContext.HTML, f.value.email),
        addressId :  this._id,
      };
      await this._MyAddressService
        .UpdateMyaddress(data)
        .subscribe((res: any) => {
          if (res.status === 200) {
            let objIndex = this.MyAddressList.findIndex(
              (obj: any) => obj._id == this._id
            );
            (this.MyAddressList[objIndex].firstName = this.sanitizer.sanitize(SecurityContext.HTML, f.value.firstName)),
              (this.MyAddressList[objIndex].lastName = this.sanitizer.sanitize(SecurityContext.HTML, f.value.lastName)),
              (this.MyAddressList[objIndex].address = this.sanitizer.sanitize(SecurityContext.HTML, f.value.address)),
              (this.MyAddressList[objIndex].street = this.sanitizer.sanitize(SecurityContext.HTML, f.value.street)),
              (this.MyAddressList[objIndex].city = this.sanitizer.sanitize(SecurityContext.HTML, f.value.city)),
              (this.MyAddressList[objIndex].state = this.sanitizer.sanitize(SecurityContext.HTML, f.value.state)),
              (this.MyAddressList[objIndex].pincode = this.sanitizer.sanitize(SecurityContext.HTML, f.value.pincode)),
              (this.MyAddressList[objIndex].country = this.sanitizer.sanitize(SecurityContext.HTML, f.value.country)),
              (this.MyAddressList[objIndex].mobile = this.sanitizer.sanitize(SecurityContext.HTML, f.value.mobile)),
              (this.MyAddressList[objIndex].email = this.sanitizer.sanitize(SecurityContext.HTML, f.value.email)),
              (this.MyAddressList[objIndex].email = this.sanitizer.sanitize(SecurityContext.HTML, f.value.email))
              // console.log(this.MyAddressList[objIndex].isDefault,"this.MyAddressList[objIndex].isDefault")
              // console.log(f.value.isDefault,"f.value.isDefault")
              // if(f.value.isDefault == true){
              //   const data = {_id:this._id}
              //   this.MakeDefaultAddress(data)
              // }
          this._SharedService.successToast("Address Update Successfully");
            this.addressform.reset();
            this.addnewaddress = false;
            this.myaddressmain = true;
            this.editaddress = true;
          }
        });
    } else {
      this.addressform.markAllAsTouched();
    }
  }

  async RemoveAddress(item: any, index: any) {
    const data = { addressId: item._id };
    await this._MyAddressService.DeleteMyaddress(data).subscribe((res: any) => {
      if (res.status == 200) {
        this.MyAddressList.splice(index, 1);
        this._SharedService.successToast("Remove Address Successfully");
        if(this.MyAddressList.length == 1 ){
          this.MakeDefaultAddress(this.MyAddressList[0])
        }
        if (this.MyAddressList.length <= 0) {
          this.NotavailAddress = true;
          this.addressform.controls.isDefault.setValue(true);
        }
      }
    });
  }

  MakeDefaultAddress(item: any) {
    const data = { addressId: item._id };
    this._MyAddressService.MakeDefaultMyaddress(data).subscribe((res: any) => {
      if (res.status == 200) {
        this.MyAddressList.forEach((result: any, i: any) => {
          if (result._id == item._id) {
            return (result.isDefault = true);
          } else {
            return (result.isDefault = false);
          }
        });
          this._SharedService.successToast("Default Address Successfully");
      }
    });
  }

  EditMyAddress(item: any) {
    this._id = item._id;
    this.addressform.patchValue({
      firstName: this.sanitizer.sanitize(SecurityContext.HTML, item.firstName),
      lastName: this.sanitizer.sanitize(SecurityContext.HTML, item.lastName),
      address: this.sanitizer.sanitize(SecurityContext.HTML, item.address),
      street: this.sanitizer.sanitize(SecurityContext.HTML, item.street),
      city: this.sanitizer.sanitize(SecurityContext.HTML, item.city),
      state: this.sanitizer.sanitize(SecurityContext.HTML, item.state),
      pincode: this.sanitizer.sanitize(SecurityContext.HTML, item.pincode),
      country: this.sanitizer.sanitize(SecurityContext.HTML, item.country),
      mobile: this.sanitizer.sanitize(SecurityContext.HTML, item.mobile),
      email: this.sanitizer.sanitize(SecurityContext.HTML, item.email),
      isDefault: item.isDefault,
    });
    this.isDefaultShow = false;
    this.addnewaddress = true;
    this.myaddressmain = false;
    this.editaddress = false;
  }

  myaddress() {
    this.isDefaultShow = true;
    this.addnewaddress = true;
    this.myaddressmain = false;
  }

  CancelMyAddress() {
    this.addressform.reset();
    this.addnewaddress = false;
    this.myaddressmain = true;
  }

  ngOnDestroy(){
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }
}
