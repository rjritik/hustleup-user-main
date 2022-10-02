import { Component, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { Router } from '@angular/router';
import { SignupService } from './signup.service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { AuthenticationService } from 'src/app/main/auth/service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit,OnDestroy {
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  private verifyUserNameSubject: Subject<string> = new Subject()
  isUserNameExits:any;

  verifyUserNameUnsub$: Subscription;
  subscriptions: Subscription[] = []


  phoneForm:any = new FormGroup({
  	phone: new FormControl(undefined, [Validators.required]),
    email: new FormControl(undefined, [Validators.required,Validators.email]),
    username: new FormControl(undefined, [Validators.required,Validators.minLength(6),Validators.maxLength(32),Validators.pattern("^[a-zA-Z0-9-]+$")]),
  });

  constructor(
    private router:Router, 
    private _SignupService:SignupService,
    private _SharedService:SharedService,
    private _AuthenticationService:AuthenticationService,
    private sanitizer:DomSanitizer
  ) {
    // redirect to home if already logged in
    if (this._AuthenticationService.currentUserValue) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.DebounceMethods();
    this.UnsubscribeMethod();
  }

  DebounceMethods(){
    this.verifyUserNameUnsub$ = this.verifyUserNameSubject.pipe(debounceTime(500)).subscribe((searchTextValue:any) => {
      this.checkUserName(searchTextValue);
    });
  }

  UnsubscribeMethod(){
    this.subscriptions.push(this.verifyUserNameUnsub$);
  }

  typeUserName(f:any){
    const updatedName = f.value.username.replaceAll(' ', '-');
    this.phoneForm.get('username').setValue(updatedName);
    if(f.value.username && f.value.username.length > 5){
      this.verifyUserNameSubject.next(f.value.username.trim()); 
    }else{
      this.isUserNameExits = undefined;
    }
  }

  checkUserName(searchTextValue:any){
    const data = {
      pattern:searchTextValue
    }
    this._SignupService.varifyUserName(data).subscribe((res:any) => {
      if(res.status == 201){
        this.isUserNameExits = res.isUserNameExits
      }else{
        this._SharedService.errorToast(res.message)
      }
    });
  }
  
  get f(){
    return this.phoneForm;
  }

  signup(f:any){
    if(f.valid){
      const signupdata = {
        countryCode : this.sanitizer.sanitize(SecurityContext.HTML, f.value.phone.countryCode),
        username : this.sanitizer.sanitize(SecurityContext.HTML, f.value.username),
        email : this.sanitizer.sanitize(SecurityContext.HTML, f.value.email),
        mobile : this.sanitizer.sanitize(SecurityContext.HTML, f.value.phone.e164Number.split(f.value.phone.dialCode)[1]),
        dialCode : this.sanitizer.sanitize(SecurityContext.HTML, f.value.phone.dialCode),
        role : 3
      }
      this._SignupService.signup(signupdata).subscribe((res:any)=>{
        if(res.status === 200){
          this.router.navigate(['/accounts/otp']);
          localStorage.setItem("email",f.value.email);
          localStorage.setItem("mobile",f.value.phone.e164Number.split(f.value.phone.dialCode)[1]);
          localStorage.setItem("dialCode",f.value.phone.dialCode);
          localStorage.setItem("countryCode",f.value.phone.countryCode);
          this._SharedService.successToast(res.message);
        }
        else{
          this._SharedService.errorToast(res.message);
        }
      });
    }
    else if(!this.phoneForm.valid){
      this.phoneForm.markAllAsTouched();
    }
  }

  ngOnDestroy(){
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }
}
