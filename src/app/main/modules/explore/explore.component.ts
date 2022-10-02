import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../auth/service';
import { SharedService } from '../../shared/shared.service';
import { HomeService } from '../home/home.service';
import { ProfileService } from '../userprofile/profile/profile.service';
import { ExploreService } from './explore.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
  postdetailsvideosData:any;
  ExploreList:any=[];
  SelectedCategory:any='';
  PageNo=1;
  Limit=10;
  itemclass ='text-style'
  postdetailsopen:any;
  commentbox:any;
  sideoverhide:any;
  postdetailsvideo:any;
  postvideoshare:any;
  postdetailsimages:any;
  postdetailsimagesData:any;
  totalDocs = 0;

  // onscroll load data
  sum = 1;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = "";
  windowOnScroll:boolean = true;
  MenuCategoryList:any[] = [
    {
      title:"all",_id:"all"
    },
    {
      title:"products",_id:"products"
    },
    {
      title:"Looks & Style",_id:"Looks & Style"
    },
    {
      title:"Beauty & Makeup",_id:"Beauty & Makeup"
    },
    {
      title:"Fashion & Apparel Design",_id:"Fashion & Apparel Design"
    },
    {
      title:"Decoration",_id:"Decoration"
    },
    {
      title:"Paint, Graphics & Designs",_id:"Paint, Graphics & Designs"
    },
    {
      title:"Health & Fitness",_id:"Health & Fitness"
    },
    {
      title:"Offer, Coupon & Code",_id:"Offer, Coupon & Code"
    },
    {
      title:"Fun & Entertainments",_id:"Fun & Entertainments"
    },
    {
      title:"Services",_id:"Services"
    },
    {
      title:"Electronic & Gadgets",_id:"Electronic & Gadgets"
    }
  ]

  constructor(private _ExploreService:ExploreService,private _authentication:AuthenticationService,private _SharedService:SharedService,private _ProfileService:ProfileService, private _HomeService:HomeService, private router:Router){
    this.GetExploreList(this.SelectedCategory,this.PageNo,this.Limit);
  }

  ngOnInit(): void{
    setTimeout(() => {
      let example = document.getElementsByClassName('text-style')[0]
      example.setAttribute('class', 'text-style active');
    }, 500);
    // this.FindMenuCategory();
  }

  // FindMenuCategory(){
  //   let currentUser = this._authentication.currentUserValue.countryCode;
  //   this._ProfileService.findMenuCategory(currentUser).subscribe((res:any)=>{
  //     if(res.status == 200){
  //       let bbb= [{title:"all",_id:"all"}]
  //       res.data.forEach((element:any) => {
  //         bbb.push(element)
  //       });
  //       this.MenuCategoryList = bbb;
  //     } 
  //     if(res.status == 500) this._SharedService.errorToast(res.message)
  //     if(res.status == 404) this._SharedService.errorToast(res.message)
  //     if(res.status == 401) this._SharedService.errorToast(res.message)
  //   });
  // }
  horizontalscroll(event:any){
    if(event.target?.__ngContext__ != undefined && event.target?.__ngContext__[23] != undefined){
      this.MenuCategoryList.forEach((element:any,i:any) => {
        if(element.title === event.target?.__ngContext__[23]){
          let example = document.getElementsByClassName('text-style')[i]
          example.setAttribute('class', 'text-style active');
        }else{
          let example = document.getElementsByClassName('text-style')[i]
          example.setAttribute('class', 'text-style');
        }
      });
      this.SelectedCategory = event.target?.__ngContext__[23] == "all"?'':event.target?.__ngContext__[23]
      this.PageNo = 1
      this.GetExploreList(this.SelectedCategory,this.PageNo,this.Limit)
    }
  }

  GetExploreList(advancecategoryname:any,pageno:any,limit:any){
    const data = {
      advanceCategory:advancecategoryname,
      page:pageno,
      limit:limit
    }
    this._ExploreService.getexploredata(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.ExploreList = res.data
        this.totalDocs = res.totalDocs;
      }
    })
  }

  addItems(){
    const data = {
      advanceCategory:this.SelectedCategory,
      page:this.PageNo += 1,
      limit:this.Limit
    }
    this._ExploreService.getexploredata(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.ExploreList = [...this.ExploreList, ...res['data']];
        this.totalDocs = res.totalDocs;
      }
    })
  }

  explorevideosidebaropen(data:any){
    this.postdetailsvideo = !this.postdetailsvideo;
    this.postdetailsvideosData = data;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
    // this.postvideoshare = data;
  }; 

  exploreimagesidebaropen(data:any){
    this.postdetailsimages = !this.postdetailsimages;
    this.postdetailsimagesData = data;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
    // this.postvideoshare = data;
  }; 

  closesidebar(){
    this.commentbox = false;
    this.postdetailsimages = false;
     this.sideoverhide = false;
     this.postdetailsvideo = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };

  follow(e:any){
    const data = {
      "userId":e?.userDetails?._id,
      "isFollowing": true
    }
    this._HomeService.followAccount(data).subscribe((res:any)=>{
      if(res.status === 200){
        e.isFollowing = true;
        e.userDetails.totalFollowers += 1;
      }
      this._SharedService.successToast(res.message);
    },(err)=>{
      console.log(err,"follow user error");
    });
  }

  unfollow(e:any){
    const data = {
      "userId":e?.userDetails?._id,
      "isFollowing": false
    }
    this._HomeService.followAccount(data).subscribe((res:any)=>{
      if(res.status === 200){
        e.isFollowing = false;
        e.userDetails.totalFollowers -= 1;
      }
      this._SharedService.successToast(res.message);
    },(err)=>{
      console.log(err,"follow user error");
    });
  }

  viewProduct(id:any){
    this.router.navigate(['/product-detail',btoa(id)]);
  }

  // onScroll(docsTotal:any){
  //   if(docsTotal !== this.totalDocs){
  //     this.addItems();
  //   }
  // }

  @HostListener('window:scroll', ['$event'])
  onScroll(e:any){
    if(!this.windowOnScroll){
        let exploreWidth:any = $(".explorewindow").width();
        if(e.target['scrollingElement'].scrollTop >= 100){
          $('ngx-horizontal-scroll-menu').addClass('fixed-header-explore');
          $("ngx-horizontal-scroll-menu").css("width", exploreWidth);
        }else{
          $('ngx-horizontal-scroll-menu').removeClass('fixed-header-explore');
          $("ngx-horizontal-scroll-menu").css('width','');
        }
        var docElement = $(document)[0].documentElement;
        var winElement = $(window)[0];
        if ((docElement.scrollHeight - winElement.innerHeight) == winElement.pageYOffset){
          if(this.ExploreList.length !== this.totalDocs){
            this.addItems();
          }
        }
    }else{
      this.windowOnScroll = false;
    }
  }
}
