import { Component, OnInit, SecurityContext } from '@angular/core';
import { SharedService } from 'src/app/main/shared/shared.service';
import { BloguploadserviceService } from '../../../blogs/bloguploadservice.service';
import { UserprofileService } from '../../userprofile.service';

@Component({
  selector: 'app-blogs-profile',
  templateUrl: './blogs-profile.component.html',
  styleUrls: ['./blogs-profile.component.css']
})
export class BlogsProfileComponent implements OnInit {
  iconClickType:any;
  UserId:number;
  getBlogPost:any=[];
  sideoverhide:any;
  blogdetailsopen:any;
  SingleBlogData:any
  
  constructor(private _UserprofileService:UserprofileService,
              private _SharedService:SharedService,
              private _BloguploadserviceService:BloguploadserviceService
            ) { }

  ngOnInit(): void {
    this._SharedService.GetUserProfileId.subscribe((userid:any)=>{
      this.UserId = userid
      this.GetAllPostBlogs()
    })
  }

  GetAllPostBlogs(){
    const data = {
      userId: this.UserId
    }
    this._UserprofileService.getAllPostBlogOfUser(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.getBlogPost = res.data;
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      },(err=>{
        this._SharedService.errorToast(err)   
      })
    );
  }

  SaveUnsaveBlog(e:any){
    const data = {
      postId:e._id,
      isBookmarked:!e.isBookmarked
    };
    this._BloguploadserviceService.bookmarkPostBlog(data).subscribe((res:any)=>{
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

  blogpostopen(data:any){
    this.blogdetailsopen = !this.blogdetailsopen;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
     this.SingleBlogData = {...data,withoutNavBar:true};
  };

  closesidebar(){
    this.iconClickType ={iconClick:false};
    this.sideoverhide = false;
    this.blogdetailsopen = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };

}
