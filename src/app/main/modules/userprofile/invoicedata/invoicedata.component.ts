import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-invoicedata',
  templateUrl: './invoicedata.component.html',
  styleUrls: ['./invoicedata.component.css']
})
export class InvoicedataComponent implements OnInit {
  @Input() PrintInvoicedata:any = [];

  constructor() { }

  ngOnInit(): void {
  }

}
