import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { ForgetPasswordService } from '../forget-password.service';
import { SharedService } from 'src/app/main/shared/shared.service';

@Component({
  selector: 'app-otp-validate',
  templateUrl: './otp-validate.component.html',
  styleUrls: ['./otp-validate.component.css']
})
export class OtpValidateComponent implements OnInit {
  userIdentityType:any = localStorage.getItem('mYq3t6w9y$B&E)H@');

  constructor(
    private _AuthenticationService:AuthenticationService, 
    private _router:Router, 
    private _ForgetPasswordService:ForgetPasswordService, 
    private _sharedservice:SharedService,
    private sanitizer:DomSanitizer
  ) {
    // redirect to home if already logged in
    if (this._AuthenticationService.currentUserValue) {
      this._router.navigate(['/home']);
    }else if(localStorage.getItem('mYq3t6w9y$B&E)H@') === null){
      this._router.navigate(['/accounts/forget-password']);
    }
  }

  validationOTPform:any = new FormGroup({
    validationOTP: new FormControl(undefined, [Validators.required,Validators.minLength(6),Validators.maxLength(6)],),
  });

  get f(){
    return this.validationOTPform;
  }

  ngOnInit(): void {
  }

  otpValidation(f:any){
    if(f.valid){
      let data = {
        userIdentityType : this.sanitizer.sanitize(SecurityContext.HTML, CryptoJS.AES.decrypt(this.userIdentityType, environment.encryptedkey.trim()).toString(CryptoJS.enc.Utf8)),
        otp : this.sanitizer.sanitize(SecurityContext.HTML, f.value.validationOTP)
      }
      this._ForgetPasswordService.otpvalidation(data).subscribe((res:any)=>{
        if(res.status === 200){
          this._sharedservice.successToast(res.message);
          this._router.navigate(['/accounts/reset']);
          localStorage.setItem('otp', CryptoJS.AES.encrypt(f.value.validationOTP, environment.encryptedkey.trim()).toString());
          
        }else{
          this._sharedservice.errorToast(res.message);
        }
      })
    }else{
      this.validationOTPform.markAllAsTouched();
    }
  }

}
