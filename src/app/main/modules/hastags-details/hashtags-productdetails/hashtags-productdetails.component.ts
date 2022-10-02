import { Component, OnInit } from '@angular/core';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { UserprofileService } from '../../userprofile/userprofile.service';
import { HashtagsDetailsService } from '../hashtags-details.service';

@Component({
  selector: 'app-hashtags-productdetails',
  templateUrl: './hashtags-productdetails.component.html',
  styleUrls: ['./hashtags-productdetails.component.css']
})
export class HashtagsProductdetailsComponent implements OnInit {
  HashtagProductdetailList:any=[];
  SlideOptions:any;
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');

  constructor(private _HashtagsDetailsService:HashtagsDetailsService,private _SharedService:SharedService, private _UserprofileService:UserprofileService,private _AuthenticationService:AuthenticationService,) { }

  ngOnInit(): void {
    this.SlideOptions = {nav:false, items: 1, loop:false,autoplay:false,autoplayTimeout:1000};
    this.GetProductHashtagDetail()
  }

  GetProductHashtagDetail(){
    const getdata:any = localStorage.getItem("hasgtagsdetail")
    const decodeddata = window.atob(getdata)
    const hashtagdata = JSON.parse(decodeddata)
    const data ={
      category:"products",
      hashtag:hashtagdata.hashtagName
    }
    this._HashtagsDetailsService.getsinglehashtagdetail(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.HashtagProductdetailList = res.data
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      
    })
  }

  WishlistProduct(subitem:any){
    const data = {
      productId:subitem._id,
      isWishlist:true
    }
    this._HashtagsDetailsService.wishlistproduct(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message);
        subitem.isWishlist = true;
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }

    },(err)=>{
      console.log(err,"err wishlist");
    })
  }

  UnsavedWishlistProduct(subitem:any){
    const data = {
      productId:subitem._id,
      isWishlist:false
    }
    this._HashtagsDetailsService.wishlistproduct(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.errorToast(res.message);
        subitem.isWishlist = false;
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    },(err)=>{
      console.log(err,"err wishlist");
    })
  }

}
