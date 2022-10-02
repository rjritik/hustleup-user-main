import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessComponent } from './signup/business/business.component';
import { BusinessOtpComponent } from './signup/business-otp/business-otp.component';
import { ExternalComponent } from './signup/external/external.component';
import { ExternalOtpComponent } from './signup/external-otp/external-otp.component';
import { SignupOtpComponent } from './signup/signup-otp/signup-otp.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from '../login-auth/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { OwlModule } from 'ngx-owl-carousel'; 
import { OwlcarouselComponent } from './owlcarousel/owlcarousel.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { OtpComponent } from './forget-password/otp/otp.component';
import { UserNotfoundComponent } from './forget-password/user-notfound/user-notfound.component';
import { OtpValidateComponent } from './forget-password/otp-validate/otp-validate.component';
import { ResetDoneComponent } from './forget-password/reset-done/reset-done.component';
import { ResetComponent } from './forget-password/reset/reset.component';
import { SignupService } from './signup/signup.service';

const routes:Routes = [
  {
    path:'', redirectTo:'/accounts/login', pathMatch:'full'
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'signup',
    component:SignupComponent,      
  },
  {
    path:'otp',
    component:SignupOtpComponent 
  },
  {
    path:'business',
    component:BusinessComponent
  },
  {
    path:'businessotp',
    component:BusinessOtpComponent
  },
  {
    path:'external',
    component:ExternalComponent
  },
  {
    path:'externalotp',
    component:ExternalOtpComponent
  },  
  {
    path:'forget-password',
    component:ForgetPasswordComponent
  },
  {
    path:'forget/otp',
    component:OtpComponent
  },
  {
    path:'userfound',
    component:UserNotfoundComponent
  },
  {
    path:'otpvalidate',
    component:OtpValidateComponent
  },
  {
    path:'reset',
    component:ResetComponent
  },
  {
    path:'resetdone',
    component:ResetDoneComponent
  }  
]

@NgModule({
  declarations: [LoginComponent,BusinessComponent,BusinessOtpComponent,ExternalComponent,ExternalOtpComponent,SignupComponent,SignupOtpComponent,OwlcarouselComponent,
    ForgetPasswordComponent, OtpComponent, UserNotfoundComponent, OtpValidateComponent, ResetDoneComponent, ResetComponent 
  ],
  imports: [
    CommonModule,
    NgxIntlTelInputModule,
    FormsModule,
    SharedModule,
    OwlModule,
		ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  providers:[
    SignupService
  ]
})
export class LoginAuthModule{ }