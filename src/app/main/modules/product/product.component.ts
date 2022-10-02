import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../auth/service';
import { SharedService } from '../../shared/shared.service';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  productdata:any

  constructor(private _authentication:AuthenticationService,private _ProductService:ProductService,private _SharedService:SharedService) { }

  ngOnInit(): void {
    this._authentication.navbarsub.next(false);
    const getdata:any = localStorage.getItem("productdetail")
    const decodeddata = window.atob(getdata)
    const detail = JSON.parse(decodeddata)
    this.productdata = detail
  }

  FollowProduct(){
    const data ={
      productId:this.productdata._id,
      isFollow: true
    }
    this._ProductService.followUnfollowProduct(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.productdata.isFollowing = true
        const itm =window.btoa(JSON.stringify(this.productdata));
        localStorage.setItem("productdetail",itm);
        this._SharedService.successToast(res.message)
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  UnfollowProduct(){
    const data ={
      productId:this.productdata._id,
      isFollow: false
    }
    this._ProductService.followUnfollowProduct(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.productdata.isFollowing = false
        const itm =window.btoa(JSON.stringify(this.productdata));
        localStorage.setItem("productdetail",itm);
        this._SharedService.successToast(res.message)
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    })
  }

}
