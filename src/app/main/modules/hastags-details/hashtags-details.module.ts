import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/main/auth/helpers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlModule } from 'ngx-owl-carousel';
import { HashtagsProductdetailsComponent } from '../hastags-details/hashtags-productdetails/hashtags-productdetails.component';
import { HashtagsPostdetailComponent } from '../hastags-details/hashtags-postdetail/hashtags-postdetail.component';
import { HashtagsVideodetailComponent } from '../hastags-details/hashtags-videodetail/hashtags-videodetail.component';
import { HashtagsBlogsdetailComponent } from '../hastags-details/hashtags-blogsdetail/hashtags-blogsdetail.component';
import { HastagsDetailsComponent } from './hastags-details.component';
import { ThousandcounterModule } from '../thousandcounter/thousandcounter.module';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { SharedModule } from '../../shared/shared.module';

const routes:Routes = [
    {
    path:'', component:HastagsDetailsComponent,children:[
      { path: '', redirectTo: 'hashtags-productdetails', pathMatch: 'full' },
      {path:'hashtags-productdetails',component:HashtagsProductdetailsComponent,canActivate:[AuthGuard]},
      {path:'hashtags-postdetails',component:HashtagsPostdetailComponent,canActivate:[AuthGuard]},
      {path:'hashtags-videodetails',component:HashtagsVideodetailComponent,canActivate:[AuthGuard]},
      {path:'hashtags-blogdetails',component:HashtagsBlogsdetailComponent,canActivate:[AuthGuard]}
    ]
    }
  ]



@NgModule({
  declarations: [HastagsDetailsComponent,HashtagsProductdetailsComponent, HashtagsPostdetailComponent, HashtagsVideodetailComponent, HashtagsBlogsdetailComponent],
  imports: [
    SharedModule,
    ThousandcounterModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    OwlModule,
    PickerModule  ]
})
export class HashtagsDetailsModule { }

