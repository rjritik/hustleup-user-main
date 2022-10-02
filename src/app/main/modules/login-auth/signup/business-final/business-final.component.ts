import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { SignupService } from '../signup.service';

@Component({
  selector: 'app-business-final',
  templateUrl: './business-final.component.html',
  styleUrls: ['./business-final.component.css']
})
export class BusinessFinalComponent implements OnInit {

  constructor(private _AuthenticationService:AuthenticationService, 
              private _router:Router,
              private _SignupService:SignupService,
              private _SharedService:SharedService,
              private sanitizer:DomSanitizer) {
    // redirect to home if already logged in
    if (this._AuthenticationService.currentUserValue) {
      this._router.navigate(['/home']);
    }
   }

   bussinessotpform:any = new FormGroup({
    gstnumber: new FormControl(undefined,[Validators.required,Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]),
		fileupload: new FormControl(undefined, [Validators.required]),
   });

   get f(){
     return this.bussinessotpform;
   }

   businessfinal(f:any){
		if(f.valid){
			let signupotpdata:any = {
        email : this.sanitizer.sanitize(SecurityContext.HTML, localStorage.getItem("email")),
        otp : this.sanitizer.sanitize(SecurityContext.HTML, f.value.mobileotp),
        password : this.sanitizer.sanitize(SecurityContext.HTML, f.value.createpassword)
			}
			this._SignupService.signupotp(signupotpdata).subscribe((res)=>{
			  const statussignotp:any = res;
			  if(statussignotp.status === 200){
          this._router.navigate(['/accounts/login']);
          this._SharedService.successToast(statussignotp.message);
          localStorage.removeItem('phone');
          localStorage.removeItem('email');
			  }else{
          this._SharedService.errorToast(statussignotp.message);
			  }
			})
		}
		else if(!this.bussinessotpform.valid){
		this.bussinessotpform.markAllAsTouched(); 
		}
   }

  ngOnInit(): void {
  }

}
