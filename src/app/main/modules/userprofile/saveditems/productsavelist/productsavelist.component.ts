import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { UserprofileService } from '../../userprofile.service';

@Component({
  selector: 'app-productsavelist',
  templateUrl: './productsavelist.component.html',
  styleUrls: ['./productsavelist.component.css']
})
export class ProductsavelistComponent implements OnInit {
  getWishlistProduct:any;
  userroles:boolean;
  SlideOptionsproduct:any = {nav:false, items: 1, loop:false}
  sideoverhide:any;
  currencyUnit:any = getParamByISO(this._authentication.currentUserValue.countryCode, 'currency');

  constructor(private _UserprofileService:UserprofileService,private _SharedService:SharedService,private _authentication:AuthenticationService,private route:Router) { }

  ngOnInit(): void {
    if(this._authentication.isUser == true){
      this.userroles = true;
     this.GetWishlistProducts()
    }
    if(this._authentication.isSeller == true || this._authentication.isInfluencer == true){
      this.route.navigate(['/user-profile/Saveditems/Postimgsavelist'])
    }
  }

  GetWishlistProducts(){
    this._UserprofileService.getWishlistProduct().subscribe(data =>{
      const response:any = data;
      if(response.status == 200){
        this.getWishlistProduct = response.data;
      }
      if(response.status == 500){
        this._SharedService.errorToast(response.message)
      }

    },(err=>{
      console.log(err);
    }));
  }

  Wishlist(item:any){
    const data = {
      productId:item._id,
      isWishlist:true
    }
    this._UserprofileService.wishlistproduct(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message);
        item.isWishlist = true;
      }
      if(res.status == 500){
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
    this._UserprofileService.wishlistproduct(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message);
        item.isWishlist = false;
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    },(err)=>{
      console.log(err,"err wishlist");
    })
  }

  productLink(id:any){
    this.route.navigate(['/product-detail',btoa(id)]);
  }

}