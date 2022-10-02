import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelcreateboxComponent } from './channelcreatebox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ChannelcreateboxComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    ChannelcreateboxComponent
  ]
})
export class ChannelcreateboxModule { }
