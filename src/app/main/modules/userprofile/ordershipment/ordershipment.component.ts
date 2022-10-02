import { Component, OnInit } from '@angular/core';
import { Select2OptionData } from 'ng-select2';
import { OrdershipmentService } from './ordershipment.service';

@Component({
  selector: 'app-ordershipment',
  templateUrl: './ordershipment.component.html',
  styleUrls: ['./ordershipment.component.css']
})
export class OrdershipmentComponent implements OnInit {
  today=new Date();
  StartDate:any;
  EndDate:any;
  DropdownItem:any=[];
  SelectedDropdownItem:any="Order Id"
  typedText:any;
  orderstatus:number;
  NewOrderscount:any = 0;
  PendingOrderscount:any = 0;
  ProcessedOrderscount:any = 0;
  DispatchedOrderscount:any = 0;
  CancelledReturnedcount:any = 0;
  constructor(private _OrdershipmentService:OrdershipmentService) { }

  ngOnInit(): void{
    this._OrdershipmentService.GetNewOrders.subscribe((res:any)=>{
      this.NewOrderscount = res.data;
      this.orderstatus = res.status;
    })
    this._OrdershipmentService.GetPendingOrders.subscribe((res:any)=>{
      this.PendingOrderscount = res.data;
      this.orderstatus = res.status;
    })
    this._OrdershipmentService.GetProcessedOrders.subscribe((res:any)=>{
      this.ProcessedOrderscount = res.data;
      this.orderstatus = res.status;
    })
    this._OrdershipmentService.GetDispatchedOrders.subscribe((res:any)=>{
      this.DispatchedOrderscount = res.data;
      this.orderstatus = res.status;
    })
    this._OrdershipmentService.GetCancelledReturned.subscribe((res:any)=>{
      this.CancelledReturnedcount = res.data;
      this.orderstatus = res.status;
    })
    this._OrdershipmentService.GetSelectedField.subscribe((res:any)=>{
      if(res == undefined){
        this.SelectedDropdownItem = "Order ID"
      }else{
        this.SelectedDropdownItem = res
      }
    })
    // this._OrdershipmentService.Gettext.subscribe((res:any)=>{
    //   this.typedText = res
    // })
    this.DropdownItem = [ "Order ID","SKU","Product ID","Buyer's Username"]
  }
  selected(item:any){
    this.SelectedDropdownItem = item
    this._OrdershipmentService.SetSelectedField(item);
  }

  typetextfunc(){
    this.StartDate = undefined;
    this.EndDate = undefined;
    if(this.orderstatus === 0){
      this._OrdershipmentService.SetNewOrderstext(this.typedText);
    }else if(this.orderstatus === 1){
      this._OrdershipmentService.SetPendingOrderstext(this.typedText);
    }else if(this.orderstatus === 2){
      this._OrdershipmentService.SetProcessedOrderstext(this.typedText); 
    }else if(this.orderstatus === 3){
      this._OrdershipmentService.SetDispatchedOrderstext(this.typedText); 
    }else if(this.orderstatus === 5){
      this._OrdershipmentService.SetCancelledReturnedtext(this.typedText); 
    }
  }

  onStartDate(event:any){
    this.StartDate = event.value
    this.typedText = undefined;
    if(this.orderstatus === 0){
      this._OrdershipmentService.SetSDateNewOrders(this.StartDate);
    }else if(this.orderstatus === 1){
      this._OrdershipmentService.SetSDatePendingOrders(this.StartDate);
    }else if(this.orderstatus === 2){
      this._OrdershipmentService.SetSDateProcessedOrders(this.StartDate); 
    }else if(this.orderstatus === 3){
      this._OrdershipmentService.SetSDateDispatchedOrders(this.StartDate); 
    }else if(this.orderstatus === 5){
      this._OrdershipmentService.SetSDateCancelledReturned(this.StartDate); 
    }
  }
  onEndDate(event:any){
    this.EndDate = event.value;
    this.typedText = undefined;
    if(this.orderstatus === 0){
      this._OrdershipmentService.SetEDateNewOrders(this.EndDate);
    }else if(this.orderstatus === 1){
      this._OrdershipmentService.SetEDatePendingOrders(this.EndDate);
    }else if(this.orderstatus === 2){
      this._OrdershipmentService.SetEDateProcessedOrders(this.EndDate); 
    }else if(this.orderstatus === 3){
      this._OrdershipmentService.SetEDateDispatchedOrders(this.EndDate); 
    }else if(this.orderstatus === 5){
      this._OrdershipmentService.SetEDateCancelledReturned(this.EndDate); 
    }
  }

  ngOnDestroy(){
  }
}
