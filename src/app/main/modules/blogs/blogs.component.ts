import { Component, OnInit, SecurityContext, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from '../../shared/shared.service';
import { BloguploadserviceService } from './bloguploadservice.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../auth/service';
import { getParamByISO } from 'iso-country-currency';
import { HomeService } from '../home/home.service';
declare var $: any;

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
  public iconClickType:any;
  public singlePostBlogDetail:any
  public BlogData:any=[];
  public reportblogid:number;
  public sideoverhide:any;
  public blogdetailsopen:any;
  public IsInfluencer:boolean = false;
  public IsSeller:boolean = false;
  public windowOnScroll:boolean = true;
  public pageNo:number = 1;
  public limit:number = 10;
  public totalDocs = 0;
  public currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');
  public reportIssue:any = [
    {
      "issue":"Sale of illegal or regulated products / services"
    },
    {
      "issue":"Scam or fraud"
    },
    {
      "issue":"Intellectual Property Violation"
    },
    {
      "issue":"False Informations"
    },
    {
      "issue":"Suicide or self-injury"
    },
    {
      "issue":"Violence or dangerous activity"
    },
    {
      "issue":"Hate speech, bullying or harrashment"
    }
  ];

  constructor(
    private _BloguploadserviceService:BloguploadserviceService,
    private _HomeService:HomeService,
    private _SharedService:SharedService,
    private clipboard:Clipboard,
    private _authentication:AuthenticationService, 
    private _ActivatedRoute:ActivatedRoute,
    private _Router:Router,
    private sanitizer:DomSanitizer,
    private _AuthenticationService:AuthenticationService
  ){ }

  ngOnInit(): void {
    if(this._authentication.isInfluencer == true){
      this.IsInfluencer = true;
    }
    if(this._authentication.isSeller == true){
      this.IsSeller = true;
    }
    this.GetAllBlogs()
  }

  GetAllBlogs(){
    this._ActivatedRoute.queryParams.subscribe((params:any) => {
      if(params.id == null){
        this.getAllBlogData(this.pageNo, this.limit);
      }else{
        this.GetSingleBlogs(params.id)
      }
    },(err)=>{
      console.log(err);
    });
  }

  getAllBlogData(page:any, limit:any){
    const option = {
      page:page,
      limit:limit
    }
    this._BloguploadserviceService.getAllBlog(option).subscribe((res:any)=>{
      if(res.status == 200){
        this.totalDocs = res.totalDocs
        if(this.pageNo === 1){
          this.BlogData = res.data;
        }else{
          this.BlogData = [...this.BlogData, ...res.data];
        }
      }else{
        this._SharedService.errorToast(res.message);
      }
    },(err)=>{
      this._SharedService.errorToast(err.message);
    });
  }

  GetSingleBlogs(postid:any){
    const data = {
      postId:postid
    };
    this._BloguploadserviceService.getSinglePostBlog(data).subscribe((res:any)=>{
      if(res.status === 200){
        this.BlogData = [res.data]
      }else{
        this._Router.navigateByUrl('/blog');
      }
    },(err)=>{
      console.log(err,"postId params error");
    });
  }

  followANDunfollow(e:any){
    const data = {
      userId:e.userId,
      isFollowing: !e.isFollowing
    }
    this._HomeService.followAccount(data).subscribe((res:any)=>{
      if(res.status == 200){
        e.isFollowing = !e.isFollowing;
        this._SharedService.successToast(res.message);
      }
      if(res.status == 500) this._SharedService.errorToast(res.message);
      if(res.status == 404) this._SharedService.errorToast(res.message);
      
    },(err)=>{
      this._SharedService.errorToast(err);
    });
  }

  copylink(copydata:any){
    const blogimgurl = `http://localhost:4200/singleblog?id=${copydata}`;
    this.clipboard.copy(blogimgurl)
    this._SharedService.successToast("Link copied to clipboard.");
  };

  mutedaccount(e:any){
    const data = {
      userId: e.userId,
      isMuted: !e.isMuted
    }
    this._BloguploadserviceService.muteAccount(data).subscribe((res:any)=>{
      if(res.status === 200){
        e.isMuted = !e.isMuted
        this._SharedService.successToast(res.message);
      }else{
        this._SharedService.errorToast(res.message);
      };
    },(err)=>{
      this._SharedService.errorToast(err);
    });
  };

  BlogReportId(id:number){
    this.reportblogid = id;
  };

  reportBlog(data:any){
    data = {
      postId:this.reportblogid,
      reportIssue:data
    }
    this._BloguploadserviceService.addPostBlogReport(data).subscribe((res:any)=>{
      if(res.status === 201){
        $('#alertReport').modal('hide');
        $('#alertReported').modal('show');
      }else{
        this._SharedService.errorToast(res.massage)
      }
    },(err)=>{
      console.log(err,"error");
    });
  };

  LikeUnlikePostBlog(e:any){
    const data = {
      postId:e._id,
      isLiked:!e.isLiked
    }
    this._BloguploadserviceService.likeUnlikePostBlog(data).subscribe((res:any)=>{
      if(res.status == 200){
        e.isLiked = !e.isLiked;
        if(e.isLiked) e.totalLikes = e.totalLikes + 1;
        else e.totalLikes = e.totalLikes - 1;
        this._SharedService.successToast(res.message);
      }
      if(res.status == 500) this._SharedService.errorToast(res.message);
      if(res.status == 404) this._SharedService.errorToast(res.message);
    },(err)=>{
      this._SharedService.errorToast(err);
    });
  };


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

  postBlogOpen(data:any){
    this.blogdetailsopen = !this.blogdetailsopen;
    this.singlePostBlogDetail = data;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  };

  commentpost(item:any){
    this.iconClickType = {SinglePostData:item,type:"comment",iconClick:true}
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  };

  postshare(item:any){
    this.iconClickType = {SinglePostData:item,type:"sharePost",iconClick:true}
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  };

  PromoteClick(item:any){
    this.iconClickType = {SinglePostData:item,type:"userPromote",iconClick:true}
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  };

  CoffeeIconClick(item:any){
    this.iconClickType = {SinglePostData:item,type:"coffee",iconClick:true}
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  };

  closesidebar(){
    this.blogdetailsopen = false;
    this.iconClickType = {iconClick:false}
    this.sideoverhide = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };

  hashtagclick(hashtag:any){
    const itm =window.btoa(JSON.stringify({hashtagName:hashtag}));
    localStorage.setItem("hasgtagsdetail",itm);
    this._Router.navigate(['/hashtags-details/hashtags-blogdetails']);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(){
    if(!this.windowOnScroll){
        var docElement = $(document)[0].documentElement;
        var winElement = $(window)[0];
        if ((docElement.scrollHeight - winElement.innerHeight) == winElement.pageYOffset) {
          if(this.BlogData.length !== this.totalDocs){
            this.getAllBlogData(this.pageNo += 1, this.limit);
          }
        }
    }else{
      this.windowOnScroll = false;
    }
  }

  /* -----------------Comment End-----------------------------*/

}
