import { Component, OnInit } from '@angular/core';
import { ProductListingService } from './product-listing.service';

@Component({
  selector: 'app-product-listings',
  templateUrl: './product-listings.component.html',
  styleUrls: ['./product-listings.component.css']
})
export class ProductListingsComponent implements OnInit {
  DropdownItem:any=[];
  orderstatus:number;
  SelectedDropdownItem:any="Product ID";
  typedText:any;
  GetActivelistcount:number = 0;
  GetPendinglistcount:number = 0;
  GetFailedlistcount:number = 0;
  GetDeactivatedlistcount:number = 0;
  Activelistcountunsubscribe:any;
  Pendinglistcountunsubscribe:any;
  Failedlistcountunsubscribe:any;
  Deactivatedlistcountunsubscribe:any;
  constructor(private _ProductListingService:ProductListingService) {
    this._ProductListingService.GetSelectedField.subscribe((res:any)=>{
      if(res == undefined){
        this.SelectedDropdownItem = "Product ID"
      }else{
        this.SelectedDropdownItem = res;
      }
    })
    this.Activelistcountunsubscribe =this._ProductListingService.GetActivelistcount.subscribe(res=>{ 
      this.GetActivelistcount = res.data;
      this.orderstatus = res.status;
    });
    this.Pendinglistcountunsubscribe =this._ProductListingService.GetPendinglistcount.subscribe(res=>{ 
      this.GetPendinglistcount = res.data; 
      this.orderstatus = res.status;
    });
    this.Failedlistcountunsubscribe =this._ProductListingService.GetFailedlistcount.subscribe(res=>{ 
      this.GetFailedlistcount = res.data; 
      this.orderstatus = res.status;
    });
    this.Deactivatedlistcountunsubscribe =this._ProductListingService.GetDeactivatedlistcount.subscribe(res=>{ 
      this.GetDeactivatedlistcount = res.data; 
      this.orderstatus = res.status;
    });
   }

  ngOnInit(): void{
    this.DropdownItem = ["Product ID","Product Name","Seller SKU"]
  }
  selected(item:any){
    this.SelectedDropdownItem = item
    this._ProductListingService.SetSelectedField(item)
  }
  typetextfunc(){
    if(this.orderstatus === 1){
      this._ProductListingService.SettextActivelist(this.typedText);
    }else if(this.orderstatus === 0){
      this._ProductListingService.SettextPendinglist(this.typedText);
    }else if(this.orderstatus === 2){
      this._ProductListingService.SettextFailedlist(this.typedText); 
    }else if(this.orderstatus === 3){
      this._ProductListingService.SettextDeactivatedlist(this.typedText); 
    }
  }

  // ngOnDestroy(){
  //   this.Activelistcountunsubscribe.unsubscribe();
  //   this.Pendinglistcountunsubscribe.unsubscribe();
  //   this.Failedlistcountunsubscribe.unsubscribe();
  //   this.Deactivatedlistcountunsubscribe.unsubscribe();
  // }
}