import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderModule } from '../../shared/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import {ThousandcounterModule} from '../../modules/thousandcounter/thousandcounter.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { OwlModule } from 'ngx-owl-carousel';
import { NgSelect2Module } from 'ng-select2';
import { ProductTypeSearchComponent} from './product-type-search.component'

const routes:Routes = [
  {
    path:'', component:ProductTypeSearchComponent
  }
]

@NgModule({
  declarations: [ProductTypeSearchComponent],
  imports: [
    CommonModule,
    HeaderModule,
    ThousandcounterModule,
    FormsModule,
    ReactiveFormsModule,
    OwlModule,
    NgSelect2Module,
    RouterModule.forChild(routes),
  ],
  exports:[
    RouterModule
  ]
})
export class ProductTypeSearchModule { }
