import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductProfileComponent } from './product-profile/product-profile.component';
import { VideoProfileComponent } from './video-profile/video-profile.component';
import { PostsProfileComponent } from './posts-profile/posts-profile.component';
import { BlogsProfileComponent } from './blogs-profile/blogs-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { OwlModule } from 'ngx-owl-carousel';
import { ProfileComponent } from './profile.component';
import { AuthGuard } from 'src/app/main/auth/helpers';
import { Role } from 'src/app/main/auth/models/role';
import {ThousandcounterModule} from '../../thousandcounter/thousandcounter.module';
import { HorizontalScrollMenuModule } from 'ngx-horizontal-scroll-menu';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { SharedModule } from 'src/app/main/shared/shared.module';

const routes: Routes = [
    {path:'',component:ProfileComponent,children:[
      {path:'',redirectTo:'productprofile',pathMatch: 'full'},
      {path:"productprofile",component:ProductProfileComponent,canActivate:[AuthGuard]},
      {path:"videoprofile",component:VideoProfileComponent,canActivate:[AuthGuard]},
      {path:"postsprofile",component:PostsProfileComponent,canActivate:[AuthGuard]},
      {path:"blogsprofile",component:BlogsProfileComponent,canActivate:[AuthGuard]}
    ]}
  ]

@NgModule({
  declarations: [
    ProductProfileComponent,
    VideoProfileComponent,
    PostsProfileComponent,
    BlogsProfileComponent
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
    OwlModule,
    ThousandcounterModule,
    HorizontalScrollMenuModule,
    PickerModule,
    SharedModule
  ]
})
export class ProfileModule { }