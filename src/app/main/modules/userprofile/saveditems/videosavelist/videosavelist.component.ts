import { Component, OnInit, SecurityContext } from '@angular/core';
import { SharedService } from 'src/app/main/shared/shared.service';
import { UserprofileService } from '../../userprofile.service';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';


@Component({
  selector: 'app-videosavelist',
  templateUrl: './videosavelist.component.html',
  styleUrls: ['./videosavelist.component.css']
})
export class VideosavelistComponent implements OnInit {
  iconClickType:any;
  sideoverhide:any = false;
  getVideopostbookmarked:any;
  videodetailsopen:any;
  SingleVideoData:any;


 
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');

  constructor(private _UserprofileService:UserprofileService,
              private _SharedService:SharedService,
              private _AuthenticationService:AuthenticationService) { }

  ngOnInit(): void {
    this.GetSavedPostVideo()
  }

  GetSavedPostVideo(){
    this._UserprofileService.getBookmarkedPostVideo().subscribe(data=>{
      const response:any = data;
      if(response.status == 200){
        this.getVideopostbookmarked = response.data;
      }
      if(response.status == 404){
        this._SharedService.errorToast(response.message)
      }
    },(err=>{
      console.log(err, "err getBookmarkedPostVideo");   
    }));
  }

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
  }

  UnsavedWishlistPostVideo(item:any, index:number){
    const data = {
      postId:item._id,
      isBookmarked:false
    }
    this._UserprofileService.bookmarkPostVideo(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message);
        item.isBookmarked = false;
        this.getVideopostbookmarked.splice(index,1);
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    },(err)=>{
      console.log(err,"err wishlist");
    })
  }

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
