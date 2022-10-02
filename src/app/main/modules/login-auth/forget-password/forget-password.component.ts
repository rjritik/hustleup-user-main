import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { ForgetPasswordService } from './forget-password.service';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  findAccountForm:any = new FormGroup({
    userIdentityType: new FormControl(undefined, [Validators.required])
  });

  get f(){
    return this.findAccountForm;
  }

  constructor(
    private _AuthenticationService:AuthenticationService, 
    private _router:Router,
    private _forgetpasswordService:ForgetPasswordService, 
    private _sharedservice:SharedService,
    private sanitizer:DomSanitizer
  ) {
    // redirect to home if already logged in
    if (this._AuthenticationService.currentUserValue) {
      this._router.navigate(['/home']);
    }
  }

  ngOnInit(): void{
  }

  
  findAccount(f:any){
    if(this.findAccountForm.valid){
      let data = {
        userIdentityType : this.sanitizer.sanitize(SecurityContext.HTML, f.value.userIdentityType)
      }
      this._forgetpasswordService.findAccount(data).subscribe((res:any) =>{
        if(res.status === 200){
          localStorage.setItem('mYq3t6w9y$B&E)H@',CryptoJS.AES.encrypt(f.value.userIdentityType, environment.encryptedkey.trim()).toString());
          this._router.navigate(['/accounts/forget/otp']);
        }else{
          this._sharedservice.errorToast(res.message);
        }
      });
    }
    else{
      this.findAccountForm.markAllAsTouched();
    }
  }

}
