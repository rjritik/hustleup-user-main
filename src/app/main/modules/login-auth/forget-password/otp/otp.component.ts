import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/main/auth/service';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { ForgetPasswordService } from '../forget-password.service';
import { SharedService } from 'src/app/main/shared/shared.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {
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
    }else if(this.userIdentityType == null){
      this._router.navigate(['/accounts/forget-password']);
    }
  }

  sendOtpForm:any = new FormGroup({
    userIdentityType: new FormControl(undefined,[Validators.required]),
    receiveOtpOn: new FormControl('email',[Validators.required])
  });

  get f(){
    return this.sendOtpForm;
  }

  ngOnInit(): void {
    this.sendOtpForm.patchValue({
      userIdentityType:CryptoJS.AES.decrypt(this.userIdentityType, environment.encryptedkey.trim()).toString(CryptoJS.enc.Utf8)
    });
  }

  sendOtp(f:any){
    if(f.valid){
      let data = {
        userIdentityType : this.sanitizer.sanitize(SecurityContext.HTML, CryptoJS.AES.decrypt(this.userIdentityType, environment.encryptedkey.trim()).toString(CryptoJS.enc.Utf8)),
        type : this.sanitizer.sanitize(SecurityContext.HTML, f.value.receiveOtpOn)
      }
      this._ForgetPasswordService.forgotPassword(data).subscribe((res:any)=>{
        if(res.status === 200){
          this._sharedservice.successToast(res.message); 
          this._router.navigate(['/accounts/otpvalidate']);
        }else{
          this._sharedservice.errorToast(res.message);
        }
      });
    }else{
      this.sendOtpForm.markAllAsTouched();
    }
  }

}
