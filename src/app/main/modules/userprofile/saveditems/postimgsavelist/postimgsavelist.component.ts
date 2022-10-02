import { Component, OnInit, SecurityContext } from '@angular/core';
import { SharedService } from 'src/app/main/shared/shared.service';
import { HomeService } from '../../../home/home.service';
import { UserprofileService } from '../../userprofile.service';


@Component({
  selector: 'app-postimgsavelist',
  templateUrl: './postimgsavelist.component.html',
  styleUrls: ['./postimgsavelist.component.css']
})
export class PostimgsavelistComponent implements OnInit {
  iconClickType:any;
  getImagepostbookmarked:any;
  getImagepost:any;
  sideoverhide:any;
  UserId:number;
  postdetailsopen:any;
  SinglePostData:any;
  IsInfluencer:boolean = false;
  IsSeller:boolean = false;

  
  constructor(private _UserprofileService:UserprofileService,
              private _SharedService:SharedService,
              private _HomeService:HomeService) { }

  ngOnInit(): void {
 this.GetSavedPostImage()
  }

  GetSavedPostImage(){
    this._UserprofileService.getBookmarkedPostImage().subscribe(data=>{
      const response:any = data;
      if(response.status == 200){
        this.getImagepostbookmarked = response.data;
      }
      if(response.status == 404){
        this._SharedService.errorToast(response.message)
      }
    },(err=>{
      console.log(err, "err getBookmarkedPostImage");   
    }));
  }

  WishlistPostImage(item:any){
    const data = {
      postId:item._id,
      isBookmarked:true
  }
    this._UserprofileService.bookmarkPostImage(data).subscribe((res:any)=>{
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

  UnsavedWishlistPostImage(item:any,index:number){
    const data = {
      postId:item._id,
      isBookmarked:false
  }
    this._UserprofileService.bookmarkPostImage(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message);
        item.isBookmarked = false;
        this.getImagepostbookmarked.splice(index , 1)
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    },(err)=>{
      console.log(err,"err wishlist");
    })
  }

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
}

