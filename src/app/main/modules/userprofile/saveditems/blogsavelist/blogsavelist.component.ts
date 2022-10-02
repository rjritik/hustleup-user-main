import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/main/shared/shared.service';
import { UserprofileService } from '../../userprofile.service';


@Component({
  selector: 'app-blogsavelist',
  templateUrl: './blogsavelist.component.html',
  styleUrls: ['./blogsavelist.component.css']
})
export class BlogsavelistComponent implements OnInit {
  iconClickType:any;
  getBookmarkedPostBlogs:any=[];
  sideoverhide:any;
  blogdetailsopen:any;
  SingleBlogData:any;

  


  constructor(private _UserprofileService:UserprofileService,
              private _SharedService:SharedService
             ) { }
  

  ngOnInit(): void {
    this.GetSavedPostBlog()
  }
   
  GetSavedPostBlog(){
    this._UserprofileService.getBookmarkedPostBlog().subscribe((res:any)=>{
      if(res.status === 200){
        this.getBookmarkedPostBlogs = res.data;
      }
      if(res.status == 404){
        this._SharedService.errorToast(res.message)
      }
    },(err=>{
      console.log(err, "err getBookmarkedPostImage");   
    }));
  }

  UnsavedWishlistPostBlog(item:any,index:number){
    const data = {
      postId:item._id,
      isBookmarked:false
  }
    this._UserprofileService.bookmarkPostBlog(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message);
        item.isBookmarked = false;
        this.getBookmarkedPostBlogs.splice(index , 1)
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    },(err)=>{
      console.log(err,"err wishlist");
    })
  }

  SaveUnsaveBlog(e:any){
    const data = {
      postId:e._id,
      isBookmarked:!e.isBookmarked
    };
    const index = this.getBlogPostIndex(e._id)
    this._UserprofileService.bookmarkPostBlog(data).subscribe((res:any)=>{
      if(res.status == 200){
        e.isBookmarked = !e.isBookmarked;
        this._SharedService.successToast(res.message);
      }
      if(res.status == 500) this._SharedService.errorToast(res.message);
      if(res.status == 404) this._SharedService.errorToast(res.message);
      this.getBookmarkedPostBlogs.splice(index,1);
      this.closesidebar();      
    },(err)=>{
      this._SharedService.errorToast(err);
    });
  };

  getBlogPostIndex(id:any){
    this.getBookmarkedPostBlogs.findIndex((blogPost:any) => { return blogPost._id==id})
  }

   blogpostopen(data:any){
    this.blogdetailsopen = !this.blogdetailsopen;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
    this.SingleBlogData = {...data,withoutNavBar:true};
  };

  closesidebar(){
    this.iconClickType = {iconclick:false};
    this.sideoverhide = false;
    this.blogdetailsopen = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };
}
