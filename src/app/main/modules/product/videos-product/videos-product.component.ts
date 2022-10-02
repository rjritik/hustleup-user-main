import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/main/auth/service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-videos-product',
  templateUrl: './videos-product.component.html',
  styleUrls: ['./videos-product.component.css']
})
export class VideosProductComponent implements OnInit {
  VideoProductdetailList:any=[];
  videoproductdetailsopen:any;
  sideoverhide:any;
  postvideo:any;

  constructor(private _ProductService:ProductService,private _SharedService:SharedService) { }

  ngOnInit(): void {
    this.GetVideoProductDetail()
  }

  GetVideoProductDetail(){
    const getdata:any = localStorage.getItem("productdetail")
    const decodeddata = window.atob(getdata)
    const detail = JSON.parse(decodeddata)
    const data ={
      productDetailsVideo:"productDetailsVideo",
      product_Id:detail._id,
      productId:detail.productId,
      
    }
    this._ProductService.productdetail(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.VideoProductdetailList = res.data[0].video_details
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      } 
       if(res.status == 401){
        this._SharedService.errorToast(res.message)
      } 
    })
  }

  WishlistPostVideo(item:any){
    const data = {
      postId:item._id,
      isBookmarked:true
  }
    this._ProductService.bookmarkPostVideo(data).subscribe((res:any)=>{
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

  UnsavedWishlistPostVideo(item:any){
    const data = {
      postId:item._id,
      isBookmarked:false
    }
    this._ProductService.bookmarkPostVideo(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message);
        item.isBookmarked = false;
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    },(err)=>{
      console.log(err,"err wishlist");
    })
  }

  postvideoopen(data:any){
    this.videoproductdetailsopen = !this.videoproductdetailsopen;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
    this.postvideo = data;
  }; 
  
  closesidebar(){
    this.sideoverhide = false;
    this.videoproductdetailsopen = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };

}
