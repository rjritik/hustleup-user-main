import { Component, OnInit } from '@angular/core';
import { HashtagsDetailsService } from '../hashtags-details.service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { BloguploadserviceService } from '../../blogs/bloguploadservice.service';


@Component({
  selector: 'app-hashtags-blogsdetail',
  templateUrl: './hashtags-blogsdetail.component.html',
  styleUrls: ['./hashtags-blogsdetail.component.css']
})
export class HashtagsBlogsdetailComponent implements OnInit {
  iconClickType:any;
  HashtagBlogdetailList:any=[];
  sideoverhide:any;
  blogdetailsopen:any;
  SingleBlogData:any;
  commentbox:any;
  sharepost:any;
  
  
  constructor(
    private _SharedService:SharedService,
    private _BloguploadserviceService:BloguploadserviceService,
    private _HashtagsDetailsService:HashtagsDetailsService
  ) { }


  ngOnInit(): void {
    this.GetBlogHashtagDetail()
  }

  GetBlogHashtagDetail(){
    const getdata:any = localStorage.getItem("hasgtagsdetail")
    const decodeddata = window.atob(getdata)
    const hashtagdata = JSON.parse(decodeddata)
    const data ={
      category:"postBlogs",
      hashtag:hashtagdata.hashtagName
    }
    this._HashtagsDetailsService.getsinglehashtagdetail(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.HashtagBlogdetailList = res.data
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      
    })
  }

  SaveUnsaveBlog(e:any){
    const data = {
      postId:e._id,
      isBookmarked:!e.isBookmarked
    };
    this._HashtagsDetailsService.bookmarkPostBlog(data).subscribe((res:any)=>{
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
    this.iconClickType = {iconClick:false}
    this.sideoverhide = false;
    this.blogdetailsopen = false;
    this.commentbox = false;
    this.sharepost = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };
}
