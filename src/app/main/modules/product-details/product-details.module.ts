import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from './product-details.component';
import { HeaderModule } from '../../shared/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgxSlickJsModule } from 'ngx-slickjs';
import { NgSelect2Module } from 'ng-select2';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { DateagoProdPipe } from './dateago-prod.pipe';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { OwlModule } from 'ngx-owl-carousel';
import { ThousandcounterModule } from 'src/app/main/modules/thousandcounter/thousandcounter.module'

const routes:Routes = [
  {
    path:'',
    component:ProductDetailsComponent
  }
]

@NgModule({
  declarations: [
    ProductDetailsComponent,
    DateagoProdPipe,
  ],
  imports: [
    OwlModule,
    CommonModule,
    HeaderModule,
    SlickCarouselModule,
    NgSelect2Module,
    SharedModule,
    PickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStarRatingModule,
    ThousandcounterModule,
    NgxSlickJsModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  exports: [
    HeaderModule
  ]
})
export class ProductDetailsModule { }
