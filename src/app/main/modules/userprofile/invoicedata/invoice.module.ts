import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicedataComponent } from './invoicedata.component';

@NgModule({
  declarations: [InvoicedataComponent],
  imports: [
    CommonModule
  ],
  exports:[
    InvoicedataComponent
  ]
})
export class InvoiceModule { }
