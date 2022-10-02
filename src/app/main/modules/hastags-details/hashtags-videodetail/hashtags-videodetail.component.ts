import { Component, OnInit, SecurityContext } from '@angular/core';
import { SharedService } from 'src/app/main/shared/shared.service';
import { HashtagsDetailsService } from '../hashtags-details.service';
import { UserprofileService } from '../../userprofile/userprofile.service';
import { VideosService } from '../../videos/videos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hashtags-videodetail',
  templateUrl: './hashtags-videodetail.component.html',
  styleUrls: ['./hashtags-videodetail.component.css']
})
export class HashtagsVideodetailComponent implements OnInit {
  iconClickType:any
  HashtagVideodetailList:any=[];
  videoHashtagsdetailsopen:any;
  sideoverhide:any;
  postvideo:any;

  constructor(private _SharedService:SharedService,
              private _HashtagsDetailsService:HashtagsDetailsService,) { }



  ngOnInit(): void {
    this.GetVideoHashtagDetail();
  }

  GetVideoHashtagDetail(){
    const getdata:any = localStorage.getItem("hasgtagsdetail")
    const decodeddata = window.atob(getdata)
    const hashtagdata = JSON.parse(decodeddata)
    const data ={
      category:"postVideos",
      hashtag:hashtagdata.hashtagName
    }
    this._HashtagsDetailsService.getsinglehashtagdetail(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.HashtagVideodetailList = res.data
        console.log(this.HashtagVideodetailList , "this.HashtagVideodetailList")
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      
    })
  }

  WishlistPostVideo(subitem:any){
    const data = {
      postId:subitem._id,
      isBookmarked:true
  }
    this._HashtagsDetailsService.bookmarkPostVideo(data).subscribe((res:any)=>{
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

  UnsavedWishlistPostVideo(subitem:any){
    const data = {
      postId:subitem._id,
      isBookmarked:false
    }
    this._HashtagsDetailsService.bookmarkPostVideo(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message);
        subitem.isBookmarked = false;
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    },(err)=>{
      console.log(err,"err wishlist");
    })
  }

  postvideoopen(data:any){
    this.videoHashtagsdetailsopen = !this.videoHashtagsdetailsopen;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
    this.postvideo = {...data,withoutNavBar:true};
  }; 
  
  closesidebar(){
      this.iconClickType = {iconClick:false};
      this.sideoverhide = false;
      this.videoHashtagsdetailsopen = false;
      $('body').css({
        'overflow-y': 'auto',
      });
  };
}
