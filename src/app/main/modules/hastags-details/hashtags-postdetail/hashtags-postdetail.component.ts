import { Component, OnInit, SecurityContext } from '@angular/core';
import { SharedService } from 'src/app/main/shared/shared.service';
import { HashtagsDetailsService } from '../hashtags-details.service';
import { Router } from '@angular/router';
import { HomeService } from '../../home/home.service';


@Component({
  selector: 'app-hashtags-postdetail',
  templateUrl: './hashtags-postdetail.component.html',
  styleUrls: ['./hashtags-postdetail.component.css']
})
export class HashtagsPostdetailComponent implements OnInit {
  iconClickType:any;
  HashtagPostdetailList:any=[];
  postHashtagsdetailsopen:any;
  UserId:number;
  sideoverhide:any;
  postimages:any;
  commentbox: any;

  SinglePostData:any;
  sharepost:any;
  IsInfluencer:boolean = false;
  IsSeller:boolean = false;
  coffeeDetail:any;


  constructor(private _SharedService:SharedService,

    
              private _HashtagsDetailsService:HashtagsDetailsService,) { }


  ngOnInit(): void {
    this.GetPostHashtagDetail()
  }

  GetPostHashtagDetail(){
    const getdata:any = localStorage.getItem("hasgtagsdetail")
    const decodeddata = window.atob(getdata)
    const hashtagdata = JSON.parse(decodeddata)
    const data ={
      category:"postImages",
      hashtag:hashtagdata.hashtagName
    }
    this._HashtagsDetailsService.getsinglehashtagdetail(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.HashtagPostdetailList = res.data
        console.log(this.HashtagPostdetailList, "this.HashtagPostdetailList")
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      
    })
  }

  WishlistPostImage(subitem:any){
    const data = {
      postId:subitem._id,
      isBookmarked:true
  }
    this._HashtagsDetailsService.bookmarkPostImage(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message);
        subitem.isBookmarked = true;
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }

    },(err)=>{
      console.log(err,"err wishlist");
    })
  }

  UnsavedWishlistPostImage(subitem:any){
    const data = {
      postId:subitem._id,
      isBookmarked:false
    }
    this._HashtagsDetailsService.bookmarkPostImage(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.errorToast(res.message);
        subitem.isBookmarked = false;
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    },(err)=>{
      console.log(err,"err wishlist");
    })
  }

  imgpostopen(data:any){
    this.postHashtagsdetailsopen = !this.postHashtagsdetailsopen;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
    this.SinglePostData = {...data,withoutNavBar:true};
  };

  closesidebar(){
    this.iconClickType = {iconClick:false}
    this.sideoverhide = false;
    this.postHashtagsdetailsopen = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };
}



