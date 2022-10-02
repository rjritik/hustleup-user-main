import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { HomeService } from 'src/app/main/modules/home/home.service';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-product-carousel',
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.css']
})
export class ProductCarouselComponent implements OnInit {
  SlideOptionsproduct:any;
  @Input() product:any;
  @Output() newItemEvent = new EventEmitter<string>();
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');

  constructor(private _HomeService:HomeService, private router:Router, private _SharedService:SharedService,private _AuthenticationService:AuthenticationService,){
    this.SlideOptionsproduct = {nav:false, items: 1, loop:false};
  }

  ngOnInit(): void{}

  BuyNow(item:any){
    this.newItemEvent.emit();
    this.router.navigate(['/product-detail',btoa(item._id)]);
  }

  Wishlist(item:any){
    const data = {
      productId:item._id,
      isWishlist:true
    }
    this._HomeService.wishlistproduct(data).subscribe((res:any)=>{
      if(res.status == 200){
        item.isWishlist = true;
        this._SharedService.successToast(res.message);
      }else{
        this._SharedService.errorToast(res.message);
      }
    },(err)=>{
      console.log(err,"err wishlist");
    })
  }

  Wishlistunsaved(item:any){
    const data = {
      productId:item._id,
      isWishlist:false
    }
    this._HomeService.wishlistproduct(data).subscribe((res:any)=>{
      if(res.status == 200){
        item.isWishlist = false;
        this._SharedService.successToast(res.message);
      }else{
        this._SharedService.errorToast(res.message);
      }
    },(err)=>{
      console.log(err,"err wishlist");
    })
  }
}
