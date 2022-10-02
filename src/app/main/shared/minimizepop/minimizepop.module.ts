import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinimizepopComponent } from './minimizepop.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ThousandcounterModule } from '../../modules/thousandcounter/thousandcounter.module';
import { SharedModule } from '../shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    MinimizepopComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PickerModule,
    ThousandcounterModule,
    SharedModule,
    NgxSpinnerModule
  ],
  exports: [
    MinimizepopComponent
  ],
})
export class MinimizepopModule { }
