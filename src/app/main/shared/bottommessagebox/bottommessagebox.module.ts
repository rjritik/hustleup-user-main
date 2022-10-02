import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottommessageboxComponent } from './bottommessagebox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ThousandcounterModule } from '../../modules/thousandcounter/thousandcounter.module';
import { NgxSpinnerModule } from 'ngx-spinner';
 
@NgModule({
  declarations: [
    BottommessageboxComponent
  ],
  imports:[
    CommonModule,
    FormsModule,
    PickerModule,
    ReactiveFormsModule,
    ThousandcounterModule,
    NgxSpinnerModule
  ],
  exports:[
    BottommessageboxComponent,
  ],
})
export class BottommessageboxModule { }
