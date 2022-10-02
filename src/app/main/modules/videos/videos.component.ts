import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Plyr from 'plyr';
import { SharedService } from '../../shared/shared.service';
import { VideosService } from './videos.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { PostVideoService } from 'src/app/main/store/effects/video/post-video.service'
import { AuthenticationService } from '../../auth/service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { getParamByISO } from 'iso-country-currency';
import { HomeService } from '../home/home.service';
declare var $: any;

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})

export class VideosComponent implements OnInit, OnDestroy{
  iconClickType:any;
  pageNo:number = 1;
  limit:number = 10;
  public player:any;
  homedata:any;
  singlePostData:any;
  reportPostId:any;
  singlepost:any;
  sideoverhide:any;
  productshop:any;
  IsSeller:boolean = false;
  IsInfluencer:boolean = false;
  IsUser:boolean = false;
  taggedProductList:any=[];
  taggedUserList:any=[];
  reportIssue:any = [
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

  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;
  windowOnScroll:boolean = true;
  totalDocs = 0;
  currencyUnit:any = getParamByISO(this._authentication.currentUserValue.countryCode, 'currency');

  constructor(
    private _PostVideoService:PostVideoService,
    private _VideosService:VideosService,
    private _Homeservice:HomeService,
    private _SharedService:SharedService,
    private _ActivatedRoute:ActivatedRoute,
    private router:Router,
    private clipboard: Clipboard,
    private _authentication:AuthenticationService
  ) {};

  ngOnInit(): void {
    if(this._authentication.isSeller == true){
      this.IsSeller = true;
    }
    if(this._authentication.isInfluencer == true){
      this.IsInfluencer = true
    }
    if(this._authentication.isUser == true){
      this.IsUser = true;
    }
    this._ActivatedRoute.queryParams.subscribe(params => {
      this.singlepost = params.id;
      if(params.id == null){
         // --------------------ngrx Start---------------------
        // const observer =  this._PostVideoService.getPostVideo();
        // const getPostVideoLoading$ = observer[0];
        // const getPostVideoLoaded$ = observer[1];
        // const getPostVideoError$ = observer[2];
        // const getPostVideoData$ = observer[3];

        // getPostVideoData$.subscribe(res=>{
        //   this.homedata = res;
        // });
         // --------------------ngrx End---------------------

        this.getAllPostVideo(this.pageNo,this.limit);
      }else{
        this.getSinglePostVideo(params.id)
      }
    },(err)=>{
      console.log(err);
    });
    const controls = [
      'play-large', // The large play button in the center
      'mute', // Toggle mute
      'fullscreen',
    ];
    setTimeout(() => {
      if(this.singlepost == undefined){
        for (let i = 0; i < this.homedata.data?.length; i++){
          this.player = new Plyr('#plyrID'+i, { captions: { active: true},controls });
        } 
      }else{
        this.player = new Plyr('#plyrIDsingle', { captions: { active: true},controls });
      }
      // this.player.pause();
      let vid:any = document.getElementById(`plyrID0`);
      vid?.play();
    }, 1000);
  };

  getAllPostVideo(pageNo:number,limit:number){
    const datas = {
      page:pageNo, 
      limit:limit
    }
    this._VideosService.getAllPostVideo(datas).subscribe((res:any)=>{
      if(res.status ===200){
        this.totalDocs = res.totalDocs
        if(this.pageNo === 1){
          this.homedata = res.data;
        }else{
          this.homedata = [...this.homedata, ...res.data];
        }
      }else{
        this._SharedService.errorToast(res.message);
      }
      },(error)=>{
        console.log(error);
    });
  }

  getSinglePostVideo(postId:any){
    const data = {
      postId
    };
    this._VideosService.getSinglePostVideo(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.singlePostData = res.data;
      }else{
        this.router.navigateByUrl('/video');
      }
    },(err)=>{
      console.log(err,"postId params error");
    });
  };

  followUnfollowTaggedUser(e:any){
    const data = {
      userId: e._id,
      isFollowing: !e.isFollowing
    }
    this._Homeservice.followAccount(data).subscribe((res:any)=>{
      if(res.status == 200){
        e.isFollowing = !e.isFollowing;
        this._SharedService.successToast(res.message);
        this.getAllPostVideo(this.pageNo,this.limit);
      }
      if(res.status == 500) this._SharedService.errorToast(res.message);
      if(res.status == 404) this._SharedService.errorToast(res.message);
      
    },(err)=>{
      this._SharedService.errorToast(err);
    });
  }

  followuser(e:any){
    e.isFollowing = true;
    const data = {
      "userId":e.userId,
      "isFollowing": true
    }
    this._Homeservice.followAccount(data).subscribe(res=>{
      const response:any = res;
      this._SharedService.successToast(response.message);
    },(err)=>{
      console.log(err,"follow user error");
    });
  };

  copylink(copydata:any){
    const postVideoUrl = `http://localhost:4200/singlevideo?id=${copydata}`;
    this.clipboard.copy(postVideoUrl);
    this._SharedService.successToast("Link copied to clipboard.");
  };

  mutedaccount(e:any){
    const data = {
      "userId": e,
      "isMuted": false
    }
    this._VideosService.muteAccount(data).subscribe(res=>{
      const response:any = res;
      if(response.status === 200){
        this._SharedService.successToast(response.message);
        const option = {
          page:1, 
          limit:10
        }
        this._VideosService.getAllPostVideo(option).subscribe((res:any)=>{  
          this.homedata = res.data;
          },(error)=>{
            console.log(error);
        });
      }else{
        this._SharedService.errorToast(response);  
      };
    },(err)=>{
      this._SharedService.errorToast(err);
    });
  };

  openReportModal(e:any){
    this.reportPostId = e;
  };

  addPostReport(reportIssueName:any){
    const data = {
      postId:this.reportPostId,
      reportIssue:reportIssueName
    }
    this._VideosService.addPostVideoReport(data).subscribe((res:any)=>{
      if(res.status === 201){
        $('#alertReport').modal('hide');
        $('#alertReported').modal('show');
      }else{
        this._SharedService.errorToast(res.message)
      }
    },(err)=>{
      console.log(err,"error");
    });
  };

  likepost(e:any){
    e.isLiked = true;
    e.totalLikes = e.totalLikes + 1;
    const data = {
      "postId":e._id,
      "isLiked":true
    }
    this._VideosService.likeUnlikePostImages(data).subscribe(res=>{
      // console.log(res,"like response");
    },(err)=>{
      console.log(err);
    });
  };

  unlikepost(e:any){
    e.isLiked = false;
    e.totalLikes = e.totalLikes - 1;
    const data = {
      "postId":e._id,
      "isLiked":false
    }
    this._VideosService.likeUnlikePostImages(data).subscribe(res=>{
      // console.log(res,"unlike response");
    },(err)=>{
      console.log(err);
    });
  };

  savepost(e:any){
    e.isBookmarked = true;
    const data = {
      "postId":e._id,
      "isBookmarked":true
    };
    this._VideosService.bookmarkPostVideo(data).subscribe(res=>{
      const repsonse:any = res;
      this._SharedService.successToast(repsonse.message);
    },(err)=>{
      console.log(err);
    });
  };

  unsavepost(e:any){
    e.isBookmarked = false;
    const data = {
      "postId":e._id,
      "isBookmarked":false
    };
    this._VideosService.bookmarkPostVideo(data).subscribe(res=>{  
      const repsonse:any = res;
      this._SharedService.errorToast(repsonse.message);
    },(err)=>{
      console.log(err);
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

  promoteposts(item:any){
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

  shoppop(videoId:any){
    const data = { videoId:videoId }
    this._VideosService.getPostsIVideoWiseTaggedProducts(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.taggedProductList = res.data.productsList;
        this.taggedUserList = res.data.userList;
      }else{
        this._SharedService.errorToast(res.message);
      }
    },(err)=>{
      console.log(err,"shopproduct err");
    });    
    this.productshop = !this.productshop;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  };

  Wishlist(item:any){
    const data = {
      productId:item._id,
      isWishlist:true
    }
    this._VideosService.wishlistproduct(data).subscribe((res:any)=>{
      this._SharedService.successToast(res.message);
      item.isWishlist = true;
    },(err)=>{
      console.log(err,"err wishlist");
    })
  };

  Wishlistunsaved(item:any){
    const data = {
      productId:item._id,
      isWishlist:false
    }
    this._VideosService.wishlistproduct(data).subscribe((res:any)=>{
      this._SharedService.errorToast(res.message);
      item.isWishlist = false;
    },(err)=>{
      console.log(err,"err wishlist");
    })
  };
  
  BuyNow(item:any){
    this.closesidebar();
    this.router.navigate(['/product-detail',btoa(item._id)]);
  }

  hashtagclick(hashtag:any){
    const itm =window.btoa(JSON.stringify({hashtagName:hashtag}));
    localStorage.setItem("hasgtagsdetail",itm);
    this.router.navigate(['/hashtags-details/hashtags-videodetails']);
  }

  currentIndex(index:any,data:any){
    // if(index == 0){
    //   let vid:any = document.getElementById(`plyrID${index}`);
    //   vid?.play();
    //   var approxTime = 0
    //   vid.ontimeupdate = ()=>{
    //     var currentTime = Math.floor(vid.currentTime);
    //     if (currentTime !== approxTime) {
    //       approxTime = currentTime;
    //       if (approxTime === 5) {
    //         console.log(data,"data")
    //           this.CallTotalViewApi(data)
    //       }
    //     }
    //   };
    // }else{
      let vid:any = document.getElementById(`plyrID${index}`);
      let vidbefore:any = document.getElementById(`plyrID${(index-1)}`);
      let vidafter:any = document.getElementById(`plyrID${(index+1)}`);
      vid?.play();
      vidafter?.pause();
      vidbefore?.pause();
      var approxTime = 0
      vid.ontimeupdate = () =>{
        var currentTime = Math.floor(vid.currentTime);
        if (currentTime !== approxTime) {
          approxTime = currentTime;
          if (approxTime === 5) {
            this.CallTotalViewApi(data)
          }
        }
      };
      
    // }
  }

  CallTotalViewApi(data:any){
    if(data.isViewed == false){
      const dataobject = {
        postId:data._id
      }
      this._VideosService.addViewerIdToPostVideo(dataobject).subscribe((res:any)=>{
        if(res.status == 200){
          data.isViewed = true         
        }
        if(res.status == 500) {  
          this._SharedService.errorToast(res.message)        
        }
      })
    }
  }

  closesidebar(){
    this.iconClickType = {iconClick:false}
    this.sideoverhide = false;
    this.productshop = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };

  @HostListener('window:scroll', ['$event'])
  onScroll(){
    if(!this.windowOnScroll){
        var docElement = $(document)[0].documentElement;
        var winElement = $(window)[0];
        if ((docElement.scrollHeight - winElement.innerHeight) == winElement.pageYOffset) {
          if(this.homedata.length !== this.totalDocs){
            this.getAllPostVideo(this.pageNo += 1, this.limit);
          }
        }
    }else{
      this.windowOnScroll = false;
    }
  }

  ngOnDestroy(): void {
    // $('body').css({
    //   'overflow-y': 'auto',
    // });
  }

}