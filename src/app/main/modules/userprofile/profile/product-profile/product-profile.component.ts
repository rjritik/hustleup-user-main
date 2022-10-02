import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-product-profile',
  templateUrl: './product-profile.component.html',
  styleUrls: ['./product-profile.component.css']
})
export class ProductProfileComponent implements OnInit {
  IsUser:boolean = false;
  IsInfluencer:boolean = false;
  ProductList:any=[];
  SlideOptions:any;
  MenuCategoryList:any;
  SelectedMenuCategoryId:any = "all"
  SelectedMenucategoryIdForInfluencer:any = "all"
  itemclass ='text-style'
  currencyUnit:any = getParamByISO(this._authentication.currentUserValue.countryCode, 'currency');

  constructor(private _authentication:AuthenticationService,private route:Router,private _ProfileService:ProfileService,private _SharedService:SharedService) { }

  ngOnInit(): void {
    setTimeout(() => {
      let example = document.getElementsByClassName('text-style')[0]
     example.setAttribute('class', 'text-style active');
    }, 500);
    this.FindMenuCategory()
    this.SlideOptions = {nav:false, items: 1, loop:false,autoplay:false,autoplayTimeout:1000};
    if(this._authentication.isUser == true){
      this.route.navigate(['/user-profile/postsprofile'])
      this.IsUser = true;
    }
    if(this._authentication.isInfluencer == true){
      this.IsInfluencer = true
       this.GetInfluencerPromotedProduct(this.SelectedMenucategoryIdForInfluencer)
    }
    if(this._authentication.isSeller == true){
      this.GetAllProductSellerwise(this.SelectedMenuCategoryId)
    }
  }

  FindMenuCategory(){
    let currentUser = this._authentication.currentUserValue.countryCode;
    this._ProfileService.findMenuCategory(currentUser).subscribe((res:any)=>{
      if(res.status == 200){
        let bbb= [{title:"all",_id:"all"}]
        res.data.forEach((element:any) => {
          bbb.push(element)
        });
        this.MenuCategoryList = bbb;
      } 
      if(res.status == 500) this._SharedService.errorToast(res.message)
      if(res.status == 404) this._SharedService.errorToast(res.message)
      if(res.status == 401) this._SharedService.errorToast(res.message)
    });

  }
  
  GetInfluencerPromotedProduct(id:any){
    const data={
      menuCategoryId: id
    }
    this._ProfileService.getAllPromoterProduct(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.ProductList = res.data
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
      
    });
  }

  GetAllProductSellerwise(id:any){
    const data={
      menuCategoryId: id
    }
    this._ProfileService.getAllProductSellerwise(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.ProductList = res.data
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
      
    });
  }

  Wishlist(item:any){
    const data = {
      productId:item._id,
      isWishlist:true
    }
    this._ProfileService.wishlistproduct(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message);
        item.isWishlist = true;
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
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
    this._ProfileService.wishlistproduct(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message);
        item.isWishlist = false;
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
    },(err)=>{
      console.log(err,"err wishlist");
    })
  }
  horizontalscroll(event:any){
    if(event.target?.__ngContext__ != undefined && event.target?.__ngContext__[23] != undefined){
      this.MenuCategoryList.forEach((ele:any,i:number) => {
        if(ele.title == event.target?.__ngContext__[23]){
          if(this._authentication.isSeller == true){
            this.GetAllProductSellerwise(ele._id)
          }
          if(this._authentication.isInfluencer == true){
            this.GetInfluencerPromotedProduct(ele._id)
          }
          let example = document.getElementsByClassName('text-style')[i]
          example.setAttribute('class', 'text-style active');
        }else{
          let example = document.getElementsByClassName('text-style')[i]
          example.setAttribute('class', 'text-style');
        }
      });
    }
  }
}