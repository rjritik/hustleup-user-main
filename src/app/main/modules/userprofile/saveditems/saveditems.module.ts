import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { NgSelect2Module } from 'ng-select2';
import { OwlModule } from 'ngx-owl-carousel';
import { AuthGuard } from 'src/app/main/auth/helpers';
import { SaveditemsComponent } from './saveditems.component';
import { ProductsavelistComponent } from './productsavelist/productsavelist.component';
import { PostimgsavelistComponent } from './postimgsavelist/postimgsavelist.component';
import { VideosavelistComponent } from './videosavelist/videosavelist.component';
import { BlogsavelistComponent } from './blogsavelist/blogsavelist.component';
import { ThousandcounterModule } from '../../thousandcounter/thousandcounter.module';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { SharedModule } from 'src/app/main/shared/shared.module';

const routes: Routes = [
  {path:'',component:SaveditemsComponent,children:[
    {path:'',redirectTo:'Productsavelist',pathMatch: 'full'},
    {path:"Productsavelist",component:ProductsavelistComponent,canActivate:[AuthGuard]},
    {path:"Postimgsavelist",component:PostimgsavelistComponent,canActivate:[AuthGuard]},
    {path:"Videosavelist",component:VideosavelistComponent,canActivate:[AuthGuard]},
    {path:"Blogsavelist",component:BlogsavelistComponent,canActivate:[AuthGuard]}
  ]}
]

@NgModule({
  declarations: [
    SaveditemsComponent,
    ProductsavelistComponent,
    PostimgsavelistComponent,
    VideosavelistComponent,
    BlogsavelistComponent],
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
    PickerModule,
    SharedModule
  ],
  exports:[
    RouterModule
  ]
})
export class SaveditemsModule { }
