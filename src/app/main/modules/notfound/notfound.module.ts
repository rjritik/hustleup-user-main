import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotfoundComponent } from './notfound.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../../shared/header/header.module';

const routes:Routes = [
  {
    path:'',
    component:NotfoundComponent
  }
]

@NgModule({
  declarations: [
    NotfoundComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    RouterModule.forChild(routes),
  ],
  exports:[
    RouterModule
  ]
})
export class NotfoundModule { }
