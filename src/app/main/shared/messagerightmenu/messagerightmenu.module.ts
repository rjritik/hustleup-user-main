import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagerightmenuComponent } from './messagerightmenu.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    MessagerightmenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[
    MessagerightmenuComponent
  ]
})
export class MessagerightmenuModule{ }
