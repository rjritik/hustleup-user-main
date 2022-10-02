import { Component, OnInit, SecurityContext } from '@angular/core';
import { UserprofileService } from '../../userprofile.service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';

@Component({
  selector: 'app-video-profile',
  templateUrl: './video-profile.component.html',
  styleUrls: ['./video-profile.component.css']
})
export class VideoProfileComponent implements OnInit {
  iconClickType:any;
  getVideopost:any;
  sideoverhide:any;
  UserId:number;
  videodetailsopen:any;
  SingleVideoData:any;

  constructor(private _UserprofileService:UserprofileService,
              private _SharedService:SharedService,
              private _AuthenticationService:AuthenticationService) { }

  ngOnInit(): void {
    this._SharedService.GetUserProfileId.subscribe((userid:any)=>{
      this.UserId = userid
      this.GetAllPostVideos()
    })
  };

  GetAllPostVideos(){
    const data = {
      userId: this.UserId
    }
    this._UserprofileService.getAllPostVideoOfUser(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.getVideopost = res.data;
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }  
    },(err)=>{
      console.log(err, "getAllPostVideoOfUser");
    });
  };

  WishlistPostVideo(item:any){
    const data = {
      postId:item._id,
      isBookmarked:true
  }
    this._UserprofileService.bookmarkPostVideo(data).subscribe((res:any)=>{
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
  };

  UnsavedWishlistPostVideo(item:any){
    const data = {
      postId:item._id,
      isBookmarked:false
    }
    this._UserprofileService.bookmarkPostVideo(data).subscribe((res:any)=>{
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
  };

  postvideoopen(data:any){
    this.videodetailsopen = !this.videodetailsopen;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
    this.SingleVideoData = {...data,withoutNavBar:true};
  };
  
  closesidebar(){
    this.iconClickType = {iconClick:false};
    this.sideoverhide = false;
    this.videodetailsopen = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };
}
