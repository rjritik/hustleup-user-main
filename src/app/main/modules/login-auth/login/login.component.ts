import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/main/auth/service';
import { SharedService } from 'src/app/main/shared/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public returnUrl: string;

  constructor(private _AuthenticationService:AuthenticationService, 
              private _SharedService:SharedService,
              private _router:Router,
              private sanitizer:DomSanitizer) {
    // redirect to home if already logged in
    if (this._AuthenticationService.currentUserValue) {
      this._router.navigate(['/home']);
    }
   }

  ngOnInit(): void {
    window.addEventListener("keydown", (event) => {
      if(event.keyCode == 13){
        this.logginForm.markAllAsTouched();
      }
    }); 
  }

  logginForm:any = new FormGroup({
	  emailphone: new FormControl(undefined, [Validators.required,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    password: new FormControl(undefined, [Validators.required,Validators.minLength(6)]),
  });

  get f(){
    return this.logginForm;
  }

  loginform(f:any){
    if (f.valid) {
      let data = {
        data : this.sanitizer.sanitize(SecurityContext.HTML, f.value.emailphone),
        password : this.sanitizer.sanitize(SecurityContext.HTML, f.value.password)
      }
      this._AuthenticationService.login(data).subscribe(res =>{
        const logindata:any = res;
        if(logindata.status === 200){
          this._router.navigate(['/home']);
          this._SharedService.setupSocketConnection();
          this._SharedService.successToast(logindata.message);
        }
        else if(logindata.status === 401){
          this._router.navigate(['/accounts/otp']);
          this._SharedService.errorToast(logindata.message);
        }
        else{
          this._SharedService.errorToast(logindata.message);  
        }
      },error=>{
        console.log(error);
        this._SharedService.errorToast(error.message);
      })
    } else {
      this.logginForm.markAllAsTouched();
    }
  }
  
}