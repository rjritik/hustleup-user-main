import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductListingsComponent } from './product-listings.component';
import { ActiveListingsComponent } from './active-listings/active-listings.component';
import { PendingListingsComponent } from './pending-listings/pending-listings.component';
import { FailedListingsComponent } from './failed-listings/failed-listings.component';
import { DeactivateListingsComponent } from './deactivate-listings/deactivate-listings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { AuthGuard } from 'src/app/main/auth/helpers';
import { OwlModule } from 'ngx-owl-carousel';
import { ProductLisingPaginationdirectiveDirective } from './product-listing-directive/product-lising-paginationdirective.directive';

 const routes: Routes = [
   {path:'',component:ProductListingsComponent,children:[
     {path:'',redirectTo:'ActiveListing',pathMatch: 'full'},
     {path:"ActiveListing",component:ActiveListingsComponent,canActivate:[AuthGuard]},
     {path:"PendingListing",component:PendingListingsComponent,canActivate:[AuthGuard]},
     {path:"FailedListing",component:FailedListingsComponent,canActivate:[AuthGuard]},
     {path:"DeactivateListing",component:DeactivateListingsComponent,canActivate:[AuthGuard]}
   ]}
 ]



@NgModule({
  declarations: [
    ActiveListingsComponent,
    PendingListingsComponent,
    FailedListingsComponent,
    DeactivateListingsComponent,
    ProductLisingPaginationdirectiveDirective
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatMenuModule,
    OwlModule
  ],
  providers:[ProductLisingPaginationdirectiveDirective]
})
export class ProductListingsModule { }
