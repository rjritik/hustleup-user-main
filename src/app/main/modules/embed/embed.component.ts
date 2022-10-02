import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from '../../auth/service/authentication.service';
import { SharedService } from '../../shared/shared.service';
import { EmbedService } from './embed.service';

@Component({
  selector: 'app-embed',
  templateUrl: './embed.component.html',
  styleUrls: ['./embed.component.css']
})
export class EmbedComponent implements OnInit {
  singleProductData:any;
  ShowWishBuyBtn:boolean = false
  SlideOptionsproduct:any;
  notFoundProduct:any = false;
  @Input() products:any;
  @Input() slider:any = true;
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');

  constructor(private _ActivatedRoute:ActivatedRoute, private _EmbedService:EmbedService, private router:Router, private _SharedService:SharedService,private _AuthenticationService:AuthenticationService) {
    this.SlideOptionsproduct = {nav:false, items: 1, loop:false};
    this._ActivatedRoute.paramMap.subscribe((params:any)=>{
      if(params.get('id')){
        this._ActivatedRoute.queryParams.subscribe((res:any)=>{
          if(res.showButton == 'true'){
            this.ShowWishBuyBtn = true;
          }else{
            this.ShowWishBuyBtn = false;
          }
        });
        let singleProductId:any;
        let influencerCheck = atob(params.get('id')).includes("influencerId");
        if(influencerCheck){
          singleProductId = JSON.parse(atob(params.get('id'))).productId;
        }else{
          singleProductId = atob(params.get('id'));
        }
        this._EmbedService.GetSingleProduct({productId:singleProductId}).subscribe((res:any)=>{
          if(res.status == 200){
            this.singleProductData = res['data'][0]
          }else if(!this.products){
            this.notFoundProduct = true;
          }
        },err=>{
          console.log(err,"err - embed");
        });
      }
    })
  }

  ngOnInit(): void{
    if(this.products){
      this._EmbedService.GetSingleProduct({productId:this.products}).subscribe((res:any)=>{
        if(res.status == 200){
          this.singleProductData = res['data'][0]
          this.ShowWishBuyBtn = true;
        }
      },err=>{
        console.log(err,"err - embed");
      });
    }
  }

  BuyNow(){
    this._ActivatedRoute.paramMap.subscribe((params:any)=>{
      if(params.get('id')){
        const URLCurrent = this.router['location']._platformLocation.location.origin
        window.open(URLCurrent + '/product-detail/' + params.get('id'), '_blank');
      }
    });
  }

  Wishlist(item:any){
    const data = {
      productId:item._id,
      isWishlist:true
    }
    this._EmbedService.wishlistproduct(data).subscribe((res:any)=>{
      this._SharedService.successToast(res.message);
      item.isWishlist = true;
    },(err)=>{
      console.log(err,"err wishlist");
    })
  }

  Wishlistunsaved(item:any){
    const data = {
      productId:item._id,
      isWishlist:false
    }
    this._EmbedService.wishlistproduct(data).subscribe((res:any)=>{
      this._SharedService.errorToast(res.message);
      item.isWishlist = false;
    },(err)=>{
      console.log(err,"err wishlist");
    })
  }

}
