import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/main/auth/service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.css']
})
export class PostProductComponent implements OnInit {
  PostProductdetailList:any=[];
  postproductdetailsopen:any;
  sideoverhide:any;
  postimages:any;

  constructor(private _ProductService:ProductService,private _SharedService:SharedService) { }

  ngOnInit(): void {
    this.GetPostProductDetail()
  }

  GetPostProductDetail(){
    const getdata:any = localStorage.getItem("productdetail")
    const decodeddata = window.atob(getdata)
    const detail = JSON.parse(decodeddata)
    const data ={
      productDetailsPost:"productDetailsPost",
      product_Id:detail._id,
      productId:detail.productId,
      
    }
    this._ProductService.productdetail(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.PostProductdetailList = res.data[0].post_details
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      } 
       if(res.status == 401){
        this._SharedService.errorToast(res.message)
      } 
    })
  }

  WishlistPostImage(item:any){
    const data = {
      postId:item._id,
      isBookmarked:true
  }
    this._ProductService.bookmarkPostImage(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message);
        item.isBookmarked = true;
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }

    },(err)=>{
      console.log(err,"err wishlist");
    })
  }

  UnsavedWishlistPostImage(item:any){
    const data = {
      postId:item._id,
      isBookmarked:false
    }
    this._ProductService.bookmarkPostImage(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.errorToast(res.message);
        item.isBookmarked = false;
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    },(err)=>{
      console.log(err,"err wishlist");
    })
  }

  imgpostopen(data:any){
    this.postproductdetailsopen = !this.postproductdetailsopen;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
    this.postimages = data.images;
  };

  closesidebar(){
    this.sideoverhide = false;
    this.postproductdetailsopen = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };

}
