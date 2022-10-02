import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultComponent } from './search-result.component';
import { HeaderModule } from '../../shared/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './search/product/product.component';
import { PostsComponent } from './search/posts/posts.component';
import { SizzlesComponent } from './search/sizzles/sizzles.component';
import { BlogsComponent } from './search/blogs/blogs.component';
import { HashtagsComponent } from './search/hashtags/hashtags.component';
import { UsersComponent } from './search/users/users.component';
import {ThousandcounterModule} from '../../modules/thousandcounter/thousandcounter.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { OwlModule } from 'ngx-owl-carousel';
import { NgSelect2Module } from 'ng-select2';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { AuthGuard } from '../../auth/helpers';
import { SharedModule } from '../../shared/shared.module';

const routes:Routes = [
  {
    path:'', component:SearchResultComponent, children:[
      { path:'', pathMatch:'full', redirectTo:'product'},
      { path:'product/:id', component:ProductComponent,canActivate:[AuthGuard]},
      { path:'posts/:id', component:PostsComponent,canActivate:[AuthGuard]},
      { path:'sizzles/:id', component:SizzlesComponent,canActivate:[AuthGuard]},
      { path:'blogs/:id', component:BlogsComponent,canActivate:[AuthGuard]},
      { path:'hashtags/:id', component:HashtagsComponent,canActivate:[AuthGuard]},
      { path:'users/:id', component:UsersComponent,canActivate:[AuthGuard]},
    ]
  }
]

@NgModule({
  declarations: [SearchResultComponent, ProductComponent, PostsComponent, SizzlesComponent, BlogsComponent, HashtagsComponent, UsersComponent],
  imports: [
    CommonModule,
    HeaderModule,
    RouterModule.forChild(routes),
    ThousandcounterModule,
    FormsModule,
    ReactiveFormsModule,
    OwlModule,
    NgSelect2Module,
    PickerModule,
    SharedModule
  ],
  exports:[
    RouterModule
  ]
})
export class SearchResultModule { }