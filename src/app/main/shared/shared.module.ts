import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftsidebarComponent } from './sidebar/leftsidebar/leftsidebar.component';
import { RightsidebarComponent } from './sidebar/rightsidebar/rightsidebar.component';
import { RouterModule } from '@angular/router';
import { CartSidebarComponent } from './cart-sidebar/cart-sidebar.component';
import {ThousandcounterModule} from '../modules/thousandcounter/thousandcounter.module';
import { ProductCarouselComponent } from './product/product-carousel/product-carousel.component';
import { OwlModule } from 'ngx-owl-carousel';
import { ImgeasShowSidebarComponent } from './main-sidebar/imgeas-show-sidebar/imgeas-show-sidebar.component';
import { VideosShowSidebarComponent } from './main-sidebar/videos-show-sidebar/videos-show-sidebar.component';
import { ProductsShowSidebarComponent } from './main-sidebar/products-show-sidebar/products-show-sidebar.component';
import { BlogsShowSidebarComponent } from './main-sidebar/blogs-show-sidebar/blogs-show-sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ClickOutsideModule } from 'ng-click-outside';
import { CoffeeSidebarComponent } from './main-sidebar/coffee-sidebar/coffee-sidebar.component';
import { SharepostSidebarComponent } from './main-sidebar/sharepost-sidebar/sharepost-sidebar.component';
import { PromotepostSidebarComponent } from './main-sidebar/promotepost-sidebar/promotepost-sidebar.component';

@NgModule({
  declarations: [
    LeftsidebarComponent,
    RightsidebarComponent,
    CartSidebarComponent,
    ProductCarouselComponent,
    ImgeasShowSidebarComponent,
    VideosShowSidebarComponent,
    ProductsShowSidebarComponent,
    BlogsShowSidebarComponent,
    CoffeeSidebarComponent,
    SharepostSidebarComponent,
    PromotepostSidebarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ThousandcounterModule,
    OwlModule,
    FormsModule,
    ReactiveFormsModule,
    PickerModule,
    ClickOutsideModule
  ],
  exports:[
    LeftsidebarComponent,
    RightsidebarComponent,
    CartSidebarComponent,
    ProductCarouselComponent,
    ImgeasShowSidebarComponent,
    VideosShowSidebarComponent,
    ProductsShowSidebarComponent,
    BlogsShowSidebarComponent,
    CoffeeSidebarComponent,
    SharepostSidebarComponent,
    PromotepostSidebarComponent
  ],
})
export class SharedModule {}
