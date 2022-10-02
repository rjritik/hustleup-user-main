import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserprofileComponent } from './userprofile.component';
import { ProfileComponent } from './profile/profile.component';
import { OrdershipmentComponent } from './ordershipment/ordershipment.component';
import { ProductListingsComponent } from './product-listings/product-listings.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { ReportEarningComponent } from './report-earning/report-earning.component';
import { MutedAccountsComponent } from './muted-accounts/muted-accounts.component';
import { CoffeeCollectionComponent } from './coffee-collection/coffee-collection.component';
import { MyAddressComponent } from './my-address/my-address.component';
import { PantextDetailsComponent } from './pantext-details/pantext-details.component';
import { BankPaymentDetailsComponent } from './bank-payment-details/bank-payment-details.component';
import { StoreDetailsComponent } from './store-details/store-details.component';
import { BrandDetailsComponent } from './brand-details/brand-details.component';
import { OfferPromocodeComponent } from './offer-promocode/offer-promocode.component';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { YourStoremapComponent } from './your-storemap/your-storemap.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ConvertintoBusinessaccountComponent } from './convertinto-businessaccount/convertinto-businessaccount.component';
import { InfluencerAccountComponent } from './influencer-account/influencer-account.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../../shared/header/header.module';
import { NgSelect2Module } from 'ng-select2';
import { AuthGuard } from '../../auth/helpers/auth.guard';
import { ImageCropperModule } from "ngx-image-cropper";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignaturePadModule } from 'angular2-signaturepad';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { PaginationDirective } from 'src/app/main/directives/pagination.directive';
import { OwlModule } from 'ngx-owl-carousel';
import { ReportEarningdatepipePipe } from './report-earning/report-earning-pipe/report-earningdatepipe.pipe';
import { NgxPrintModule } from 'ngx-print';
import { InvoiceModule } from '../userprofile/invoicedata/invoice.module';
import { ThousandcounterModule } from '../thousandcounter/thousandcounter.module';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from 'src/environments/environment';

const routes:Routes = [
  { path:'',component:UserprofileComponent,children:[
    { 
      path:'',
      loadChildren:() => import('./profile/profile.module').then(m=>m.ProfileModule),canActivate: [AuthGuard]
    },
    // { path:'',component:ProfileComponent,canActivate: [AuthGuard]},
    // { path:'Ordershipment',component:OrdershipmentComponent,canActivate: [AuthGuard]},
    // { path:'ProductListings',component:ProductListingsComponent,canActivate: [AuthGuard]},
    { path:'OrderHistory',component:OrderHistoryComponent,canActivate: [AuthGuard]},
    { path:'ReportEarning',component:ReportEarningComponent,canActivate: [AuthGuard]},
    { path:'MutedAccounts',component:MutedAccountsComponent,canActivate: [AuthGuard]},
    { path:'CoffeeCollection',component:CoffeeCollectionComponent,canActivate: [AuthGuard]},
    { path:'MyAddress',component:MyAddressComponent,canActivate: [AuthGuard]},
    { path:'PantextDetails',component:PantextDetailsComponent,canActivate: [AuthGuard]},
    { path:'BankPaymentDetails',component:BankPaymentDetailsComponent,canActivate: [AuthGuard]},
    { path:'StoreDetails',component:StoreDetailsComponent,canActivate: [AuthGuard]},
    { path:'BrandDetails',component:BrandDetailsComponent,canActivate: [AuthGuard]},
    { path:'OfferPromocode',component:OfferPromocodeComponent,canActivate: [AuthGuard]},
    { path:'UserRoles',component:UserRolesComponent,canActivate: [AuthGuard]},
    { path:'YourStoremap',component:YourStoremapComponent,canActivate: [AuthGuard]},
    { path:'EditProfile',component:EditProfileComponent,canActivate: [AuthGuard]},
    { path:'Businessaccount',component:ConvertintoBusinessaccountComponent,canActivate: [AuthGuard]},
    { path:'InfluencerAccount',component:InfluencerAccountComponent,canActivate: [AuthGuard]},
    { 
      path:'Saveditems',
      loadChildren:() => import('./saveditems/saveditems.module').then(m=>m.SaveditemsModule),canActivate: [AuthGuard]
    },
    {
      path:'Ordershipment',
      loadChildren:() => import('./ordershipment/ordershipment.module').then(m=>m.OrdershipmentModule),canActivate: [AuthGuard]
    },
    {
      path:'ProductListings',
      loadChildren:() => import('./product-listings/product-listings.module').then(m=>m.ProductListingsModule),canActivate: [AuthGuard]
    },
  ]},
]

@NgModule({
  declarations: [
    UserprofileComponent,
    ProfileComponent,
    OrdershipmentComponent,
    ProductListingsComponent,
    OrderHistoryComponent,
    ReportEarningComponent,
    MutedAccountsComponent,
    CoffeeCollectionComponent,
    MyAddressComponent,
    PantextDetailsComponent,
    BankPaymentDetailsComponent,
    StoreDetailsComponent,
    BrandDetailsComponent,
    OfferPromocodeComponent,
    UserRolesComponent,
    YourStoremapComponent,
    EditProfileComponent,
    ConvertintoBusinessaccountComponent,
    InfluencerAccountComponent,
    PaginationDirective,
    ReportEarningdatepipePipe
  ],
  imports: [
    CommonModule,
    NgSelect2Module,
    HeaderModule,
    RouterModule.forChild(routes),
    ImageCropperModule,
    FormsModule,
    ReactiveFormsModule,
    SignaturePadModule,
    NgxSpinnerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatMenuModule,
    OwlModule,
    NgxPrintModule,
    InvoiceModule,
    ThousandcounterModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.accessToken
    }),
  ],
  exports:[
    RouterModule,
  ],
  providers:[PaginationDirective]
})
export class UserprofileModule { }
