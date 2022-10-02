import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { SignupService } from '../signup.service';
import { getParamByISO } from 'iso-country-currency';

@Component({
  selector: 'app-business-otp',
  templateUrl: './business-otp.component.html',
  styleUrls: ['./business-otp.component.css']
})
export class BusinessOtpComponent implements OnInit {
	isChecked:any;
	separateDialCode = true;
	SearchCountryField = SearchCountryField;
	selectedCountryCode :any;
	CountryISO = CountryISO;
	PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
	public countryName:any;

	bussinessotpform:any = new FormGroup({
		phone: new FormControl(localStorage.getItem('mobile'),[Validators.required]),
		mobileotp: new FormControl(undefined, [Validators.required,Validators.minLength(6),Validators.maxLength(6)],),
	  	createpassword: new FormControl(undefined, [Validators.required,Validators.minLength(6)]),
	});
  
	get f(){
	  return this.bussinessotpform;
	}

	constructor(
		private _AuthenticationService:AuthenticationService, 
		private _router:Router,
		private _SignupService:SignupService,
		private _SharedService:SharedService,
		private sanitizer:DomSanitizer
	) {
		// redirect to home if already logged in
		if (this._AuthenticationService.currentUserValue) {
		  this._router.navigate(['/home']);
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
  


	businessotp(f:any){
		if(f.valid){
			let signupotpdata:any = {
			email : this.sanitizer.sanitize(SecurityContext.HTML, localStorage.getItem("email")),
			otp : this.sanitizer.sanitize(SecurityContext.HTML, f.value.mobileotp),
			password : this.sanitizer.sanitize(SecurityContext.HTML, f.value.createpassword)
			}
			this._SignupService.activateAccount(signupotpdata).subscribe((res:any)=>{
			  if(res.status === 200){
				this._router.navigate(['/accounts/login']);
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
		else if(!this.bussinessotpform.valid){
		this.bussinessotpform.markAllAsTouched();
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
		} catch (error){
		  this._SharedService.errorToast(error);
		}
	
	}	
	
	changeStatus(event:Event){
		this.isChecked = (<HTMLInputElement>event.target).checked;
	}

}
