import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../auth/service/authentication.service';
import { ModulesService } from '../../modules/modules.service';
import { SharedService } from '../shared.service';
import { Subscription } from 'rxjs';
import { getParamByISO } from 'iso-country-currency';
declare let $ :any;
declare let modal:any;

@Component({
  selector: 'app-cart-sidebar',
  templateUrl: './cart-sidebar.component.html',
  styleUrls: ['./cart-sidebar.component.css']
})
export class CartSidebarComponent implements OnInit,OnDestroy {
  cartshow:any = false;
  carthide:boolean = false;
  CartList:any=[];
  SelectedCartItem:any;
  SelectedIndex:any;
  isavailcartdata:boolean = true;
  totalamount:any;
  finaldiscount:any;
  cartlengthnumber:number;
  cartlengthsavednumber:number;

  cartSidebarUnsub$: Subscription;
  changeInProductDetailUnSub$: Subscription;
  routechangeUnsub$: Subscription;
  subscriptions: Subscription[] = []

  @Output() buttonclicked = new EventEmitter<any>();
  currencyUnit:any = getParamByISO(this._authentication.currentUserValue.countryCode, 'currency');

  constructor(private _ModulesService:ModulesService,private router:Router,private _SharedService:SharedService,private _authentication:AuthenticationService) {
  }

   ngOnInit(): void{
    if(this._authentication.isSeller == false){
      this.GetCartList();
      this.changeInProductDetailSubscribe();
      this.cartSideBarOpenSubscribe();
    };
  }

  changeInProductDetailSubscribe(){
    this.changeInProductDetailUnSub$ = this._SharedService.notifyObservable$.subscribe((res:any) => {
      if(res.refresh){
          // get your grid data again. Grid will refresh automatically
          this.GetCartList();
      };
    });
  }

  cartSideBarOpenSubscribe(){
    this.cartSidebarUnsub$ = this._SharedService.getCartSidebarOpen().subscribe((data:any)=>{
      if(data){
        this.cartshow = data.cartIconClick;
        this.carthide = data.cartIconClick;
      }
      if(data && data.cartIconClick) this.GetCartList();
    })
  }

  UnsubscribeMethod(){
    this.subscriptions.push(this.cartSidebarUnsub$);
    this.subscriptions.push(this.changeInProductDetailUnSub$);
    this.subscriptions.push(this.routechangeUnsub$);
  }

  GetCartList(){
    this._ModulesService.getcartlist().subscribe((res:any)=>{
      if(res.status == 200){
        this.CartList = res.data
        const cartlength = [];
        this.CartList.forEach((element:any) => {
          if(element.isSaved == false){
            cartlength.push(element)
          }
          if(element.isSaved == true){
            const cartlengthsaved = [];
            cartlengthsaved.push(element);
            this.cartlengthsavednumber = cartlengthsaved.length;
          }
        }); 
        this.cartlengthnumber = cartlength.length;
        this._SharedService.GetCart(this.cartlengthnumber);
        this.getTotal();
        if(this.cartlengthnumber >= 1){
          this.isavailcartdata = false;
        }else{
          this.isavailcartdata = true;
        }
        
      }

    })
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
          this.getTotal();
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
        this.getTotal();
      }
    })
  }
  }

  SelectedRemoveCartItem(item:any,i:any){
    this.SelectedCartItem = item
    this.SelectedIndex = i
  }

  RemoveFromCart(){
    const data = {
      cartId:this.SelectedCartItem._id
    }
    this._ModulesService.deletecartlist(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.GetCartList()
        this._SharedService.successToast(res.message);
        this.buttonclicked.emit({id:this.SelectedCartItem.productId,size:this.SelectedCartItem.size});
      }
      if(res.status ==404){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  getTotal(){
    let total = 0;
    let totals = 0;
    for (var i = 0; i < this.CartList.length; i++) {
      if(this.CartList[i].isSaved == false){
        if (this.CartList[i].basePrice) {
          total += this.CartList[i].basePrice * this.CartList[i].quantity;
          this.totalamount = total;
        }
        if (this.CartList[i].discount){
          totals += this.CartList[i].discount * this.CartList[i].quantity;
          this.finaldiscount = totals;
        }
      }
    }
  }

  cartclose(){
    const data = {
      cartIconClick:false
    }
    this._SharedService.setCartSideBarOpen(data);
  }

  ViewCart(){
    this.cartclose();
    this.router.navigate(['/shopping-cart']);
  }


  startshopping(){
    this.cartclose();
    this.router.navigate(["/home"])
  }
  MoveToSavedList(){
    const data = {
      cartId:this.SelectedCartItem._id,
      productId:this.SelectedCartItem.productId,
      isSaved:true
    }
    this._ModulesService.moveToSaveList(data).subscribe((res:any)=>{
      this.SelectedCartItem.isSaved = true;
      this.cartlengthnumber = this.cartlengthnumber - 1;
      this._SharedService.GetCart(this.cartlengthnumber);
      this.GetCartList();
      this.getTotal();
    });
  }

  BuyNowCart(){
    this.cartclose();
    this.router.navigate(['/shopping-cart/select-address']);
  }

  viewsavelist(){
    this.cartclose();
    this.router.navigate(['/shopping-cart']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

}
