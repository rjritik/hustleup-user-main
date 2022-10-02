import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { ForgetPasswordService } from '../forget-password.service';
import { MustMatch } from './confirmed.validator';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/main/shared/shared.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  userIdentityType:any = localStorage.getItem('mYq3t6w9y$B&E)H@');

  resetPassword:any = this._FormBuilder.group({
    password: ['',[Validators.required, Validators.minLength(6)]],
    confirm_password: ['',Validators.required],}
    ,{
      validator: MustMatch('password', 'confirm_password')
  });

  get f(){
    return this.resetPassword;
  }

  constructor(
    private _AuthenticationService:AuthenticationService, 
    private _router:Router,
    private _FormBuilder:FormBuilder,
    private _ForgetPasswordService:ForgetPasswordService,
    private _sharedservice:SharedService,
    private sanitizer:DomSanitizer
  ) {
    // redirect to home if already logged in
    if (this._AuthenticationService.currentUserValue){
      this._router.navigate(['/home']);
    }else if(localStorage.getItem('mYq3t6w9y$B&E)H@') === null){
      this._router.navigate(['/accounts/forget-password']);
    }else if(localStorage.getItem('otp') === null){
      this._router.navigate(['/accounts/otpvalidate']);
    }
  }

  ngOnInit(): void {
  }

  resetpassword(f:any){
    if(f.valid){
      const data = {
        userIdentityType : this.sanitizer.sanitize(SecurityContext.HTML, CryptoJS.AES.decrypt(this.userIdentityType, environment.encryptedkey.trim()).toString(CryptoJS.enc.Utf8)),
        newPassword : this.sanitizer.sanitize(SecurityContext.HTML, f.value.confirm_password)
      }
      this._ForgetPasswordService.resetPasswords(data).subscribe((res:any)=>{
        if (res.status === 200) {
          this._sharedservice.successToast(res.message);
          this._router.navigate(['/accounts/resetdone']);
          localStorage.removeItem('mYq3t6w9y$B&E)H@');
          localStorage.removeItem('otp');
        }else{
          this._sharedservice.errorToast(res.message);
        }
      })
    }else{
      this.resetPassword.markAllAsTouched();
    }
  }


}
