import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/main/shared/shared.service';
import { HomeService } from '../../../home/home.service';
import { UserprofileService } from '../../userprofile.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';

@Component({
  selector: 'app-posts-profile',
  templateUrl: './posts-profile.component.html',
  styleUrls: ['./posts-profile.component.css']
})
export class PostsProfileComponent implements OnInit {
  iconClickType:any;
  getImagepost:any;
  postdetailsopen:any;
  sideoverhide:any;
  postcommentshare:any;
  UserId:number;
  postdetailsimages:any;
  postdetailsimagesData:any;
  postdetailsvideo: any;
  SinglePostData:any;
  IsInfluencer:boolean = false;
  IsSeller:boolean = false;


  constructor(private _UserprofileService:UserprofileService,
              private _SharedService:SharedService,
              private _HomeService:HomeService, 
              private _Router:Router,
              private clipboard: Clipboard,
              private _AuthenticationService:AuthenticationService,
              private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this._SharedService.GetUserProfileId.subscribe((userid:any)=>{
      this.UserId = userid
      this.GetAllPostImages()
    })
  }

  //  side toggle method

  imgpostopen(data:any){
    this.postdetailsopen = !this.postdetailsopen;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
    this.SinglePostData = {...data,withoutNavBar:true};
  };


  closesidebar(){
    this.iconClickType = {iconClick:false}
    this.sideoverhide = false;
    this.postdetailsopen = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };

  GetAllPostImages(){
    const data = {
      userId: this.UserId
    }
    this._UserprofileService.getAllPostImageOfUser(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.getImagepost = res.data;
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      },(err=>{
        console.log(err, "err getAllPostImageOfUser");   
      })
    );
  }

  SaveUnsavePost(e:any){
    const data = {
      postId:e._id,
      isBookmarked:!e.isBookmarked
    };
    this._HomeService.bookmarkPostImage(data).subscribe((res:any)=>{
      if(res.status == 200){
        e.isBookmarked = !e.isBookmarked;
        this._SharedService.successToast(res.message);
      }
      if(res.status == 500) this._SharedService.errorToast(res.message);
      if(res.status == 404) this._SharedService.errorToast(res.message);
      
    },(err)=>{
      this._SharedService.errorToast(err);
    });
  };

}

