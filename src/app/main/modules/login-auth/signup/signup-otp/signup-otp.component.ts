import {  Component, ElementRef, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { Router } from '@angular/router';
import { SignupService } from '../signup.service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { getParamByISO } from 'iso-country-currency';

@Component({
  selector: 'app-signup-otp',
  templateUrl: './signup-otp.component.html',
  styleUrls: ['./signup-otp.component.css']
})
export class SignupOtpComponent implements OnInit{
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  selectedCountryCode :any;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  public countryName:any;


  phoneForm:any = new FormGroup({
  	phone: new FormControl(localStorage.getItem('mobile'),[Validators.required]),
	  mobileotp: new FormControl(undefined, [Validators.required,Validators.minLength(6),Validators.maxLength(6)]),
    createpassword: new FormControl(undefined, [Validators.required,Validators.minLength(6)]),
	  dob: new FormControl(undefined, [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]),
    gender: new FormControl('Male',[Validators.required]),
  });

  get f(){
    return this.phoneForm;
  }

  constructor(
    private router:Router, 
    private _SignupService:SignupService, 
    private _SharedService:SharedService,
    private _AuthenticationService:AuthenticationService,
    private sanitizer:DomSanitizer,
  ) {
    // redirect to home if already logged in
    if (this._AuthenticationService.currentUserValue) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void{
    const countryCode:any = localStorage.getItem("countryCode")
    this.countryName = getParamByISO(countryCode, 'countryName');
    for (const [key, value] of Object.entries(CountryISO)) {
      if(key.toLowerCase() == this.countryName.toLowerCase()){
        this.selectedCountryCode = value
      }
    }
  }

  ngAfterViewInit(){
  }





  signupotp(f:any){
    if(f.valid){
      debugger;
      let data:any = {
        email : this.sanitizer.sanitize(SecurityContext.HTML, localStorage.getItem("email")),
        otp : this.sanitizer.sanitize(SecurityContext.HTML, f.value.mobileotp),
        password : this.sanitizer.sanitize(SecurityContext.HTML, f.value.createpassword),
        age : f.value.age,
        gender : this.sanitizer.sanitize(SecurityContext.HTML, f.value.gender)
      }
      this._SignupService.activateAccount(data).subscribe((res:any)=>{
        if(res.status === 200){
          this.router.navigate(['/accounts/login']);
          this._SharedService.successToast(res.message);
          localStorage.removeItem("email");
          localStorage.removeItem("mobile");
          localStorage.removeItem("dialCode");
          localStorage.removeItem("countryCode");
        }
        else{
          this._SharedService.errorToast(res.message);
        }
      })
    }
    else if(!this.phoneForm.valid){
      this.phoneForm.markAllAsTouched();
    }
  }

  resendotp(){
    const data = {
      dialCode: this.sanitizer.sanitize(SecurityContext.HTML, localStorage.getItem('dialCode')),
      mobile: this.sanitizer.sanitize(SecurityContext.HTML, localStorage.getItem('mobile')),
    }
    try {
      this._SignupService.resendotp(data).subscribe((res:any)=>{
        if(res.status === 200){        
          this._SharedService.successToast(res.message); 
        }else{
          this._SharedService.errorToast(res.message);
        }
      }) 
    } catch (error) {
      this._SharedService.errorToast(error);
    }

  }

}

