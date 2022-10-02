import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/main/shared/shared.service';
import { ModulesService } from '../../modules.service';
import { Output, EventEmitter } from '@angular/core';
import { resolve } from 'dns';
import { rejects } from 'assert';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { getParamByISO } from 'iso-country-currency';
declare var $ :any;

@Component({
  selector: 'app-cartitem',
  templateUrl: './cartitem.component.html',
  styleUrls: ['./cartitem.component.css']
})
export class CartitemComponent implements OnInit {
  SlideOptions:any;
  ShopppingCartList:any=[];
  SelectedRemoveItem:any;
  Selectedindex:any;
  totalamount:any;
  cartlength:any = [];
  cartlengthnumber:number;
  finaldiscount:any;
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');

  // @Output() cartTotalPrice:any = new EventEmitter<string>();

  constructor(private _SharedService: SharedService,private _ModulesService:ModulesService,private _router:Router,private _AuthenticationService:AuthenticationService) {}

  ngOnInit(): void {
    this.SlideOptions = {nav:false, items: 1, loop:false,autoplay:false,autoplayTimeout:1000}; 
    this.GetShoppingCartList();
    this._SharedService.shoppingcart.next("false");
  }
  
  async GetShoppingCartList(){
    await this._ModulesService.getcartlist().subscribe((res:any)=>{
      if(res.status == 200){
        this.ShopppingCartList = res.data
        this.cartlength = [];
        this.ShopppingCartList.forEach((element:any) => {
          if(element.isSaved == false){
            this.cartlength.push(element)
          }
        });      
        this.cartlengthnumber = this.cartlength.length;
        this._SharedService.GetCart(this.cartlengthnumber);
        this._SharedService.SetCartRefresh({refresh: true});
        if(this.ShopppingCartList.length <= 0){
          this._router.navigate(['/home']);
        }
      }
    })
  }

  GetRemoveItem(item:any,index:any){
    this.SelectedRemoveItem = item
    this.Selectedindex = index
  }

  Remove(){
    const data = {
      cartId:this.SelectedRemoveItem._id
    }
    this._ModulesService.deletecartlist(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.GetShoppingCartList();
        $('#promo-coupon-remove').modal('hide');
        this._SharedService.successToast("Remove Item Successfully");
      }
      if(res.status ==404){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  MoveToSavedList(item:any){
    const data = {
      cartId:item._id,
      productId:item.productId,
      isSaved:true
    }
    this._ModulesService.moveToSaveList(data).subscribe((res:any)=>{
      if(res.status == 204){
        this.GetShoppingCartList();
        this._SharedService.successToast(res.message)
      }
      if(res.status == 500) this._SharedService.errorToast(res.message)
      if(res.status == 409) this._SharedService.InfoToast(res.message)
      if(res.status == 401) this._SharedService.errorToast(res.message)
      
    });
  }

  MoveToCart(item:any){
    const data = {
      cartId:item._id,
      productId:item.productId,
      isSaved:false
    }
    this._ModulesService.moveToSaveList(data).subscribe((res:any)=>{
      if(res.status == 204){
        this.GetShoppingCartList();
        this._SharedService.successToast(res.message)
      }
      if(res.status == 500) this._SharedService.errorToast(res.message)
      if(res.status == 409) this._SharedService.InfoToast(res.message)
      if(res.status == 401) this._SharedService.errorToast(res.message)
    });
  }

  IncreaseQty(item:any){
    if(item.quantity <  3){
      const data = {
        cartId:item._id,
        addCart:1,
        variationId:item.variationId
      }
      this._ModulesService.UpdateCart(data).subscribe((res:any)=>{
        if(res.status == 200){
          item.quantity = item.quantity + 1;
          this._SharedService.SetCartRefresh({refresh: true});
        }
      })
    }

  }

  DecreaseQty(item:any){
    if(item.quantity >1){
    const data = {
      cartId:item._id,
      addCart:0,
      variationId:item.variationId
    }
    this._ModulesService.UpdateCart(data).subscribe((res:any)=>{
      if(res.status == 200){
        item.quantity = item.quantity - 1;
        this._SharedService.SetCartRefresh({refresh: true});
      }
    })
    }
  }
}
