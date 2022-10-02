import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/main/shared/shared.service';
import { SearchResultService } from '../../search-result.service';
import { Select2OptionData } from 'ng-select2';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/main/auth/service';
import { BloguploadserviceService } from '../../../blogs/bloguploadservice.service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit,OnDestroy {
  iconClickType:any
  public Recommand:any = Array<Select2OptionData>();
  SelectRecommandation:any=''
  searchresultfor:any='';
  selectedtitleunscribe:Subscription;
  selectedtitleboolean:boolean = false;
  SelectedCategory:any=[];
  SearchedBlogsList:any=[];
  public url:any = this._Router.url;
  sideoverhide:any;
  blogdetailsopen:any;
  SingleBlogData:any

  constructor(private _SearchResultService:SearchResultService,
              private _SharedService:SharedService,
              private _BloguploadserviceService:BloguploadserviceService,
              private _Router:Router){
    this.searchresultfor = this.url.substr(this.url.lastIndexOf('/') + 1);
    this.selectedtitleunscribe = this._SearchResultService.Getselectedtitle.subscribe((res:any)=>{
      this.searchresultfor = res;
      this.selectedtitleboolean = true;
      this.GetSearchedBlogsData();
    })
  }

  ngOnInit(): void {
    this.Recommand = [
      {
        id: 'recent',
        text: 'Recent post-first'
      },
      {
        id: 'oldest',
        text: 'Oldest post-first'
      }
    ]
    this._SearchResultService.SetActiveTabName('blogs');
    if(localStorage.getItem("blogsrecommand") != null){
      let getrecommanddata:any = localStorage.getItem("blogsrecommand");
      let Encoded = atob(getrecommanddata);
      this.SelectRecommandation = Encoded
    } 
    setTimeout(() => {
      if(this.selectedtitleboolean == false){
        this.GetSearchedBlogsData()
      }
    }, 100);
  }

  GetSearchedBlogsData(){
    const data = {
      categoryNames:this.SelectedCategory,
      sortBy:this.SelectRecommandation,
      keyword:this.searchresultfor
    }
    this._SearchResultService.searchedbloglist(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.SearchedBlogsList = res.data
      }
    })
  }

  RecommandValue(event:any){
    this.SelectRecommandation=event
    localStorage.setItem("blogsrecommand",btoa(this.SelectRecommandation))
    this.GetSearchedBlogsData()
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
     this.SingleBlogData = data;
  };


  closesidebar(){
    this.iconClickType = {iconClick:false};
    this.sideoverhide = false;
    this.blogdetailsopen = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };

  ngOnDestroy(): void{
    this.selectedtitleunscribe.unsubscribe()
  }

}
