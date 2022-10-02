import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/main/auth/helpers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlModule } from 'ngx-owl-carousel';
import {PostProductComponent} from './post-product/post-product.component';
import {VideosProductComponent} from './videos-product/videos-product.component';
import {BlogsProductComponent} from './blogs-product/blogs-product.component';
import {ProductComponent} from './product.component';
import { ThousandcounterModule }from '../thousandcounter/thousandcounter.module'

const routes:Routes = [
    {
    path:'', component:ProductComponent,children:[
      { path: '', redirectTo: 'PostProduct', pathMatch: 'full' },
      {path:'PostProduct',component:PostProductComponent,canActivate:[AuthGuard]},
      {path:'VideoProduct',component:VideosProductComponent,canActivate:[AuthGuard]},
      {path:'BlogProduct',component:BlogsProductComponent,canActivate:[AuthGuard]}
    ]
    }
  ]



@NgModule({
  declarations: [ProductComponent,PostProductComponent, VideosProductComponent, BlogsProductComponent],
  imports: [
    ThousandcounterModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    OwlModule
  ]
})
export class ProductModule { }