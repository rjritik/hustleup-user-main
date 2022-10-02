import { Component, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/main/shared/shared.service';
import { SearchResultService } from '../../search-result.service';
import { Select2OptionData } from 'ng-select2';
import { HomeService } from '../../../home/home.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/main/auth/service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy{
  iconClickType:any;
  public Recommand:any = Array<Select2OptionData>();
  SelectRecommandation:any=''
  SearchedPostsList:any=[];
  searchresultfor:any='';
  public url:any = this._Router.url;
  selectedtitleunscribe:Subscription;
  selectedtitleboolean:boolean = false;
  SelectedCategory:any=[]

  sideoverhide:any;
  postdetailsopen:any;
  SinglePostData:any;
  
  
  constructor(private _SearchResultService:SearchResultService,
              private _SharedService:SharedService,
              private _HomeService:HomeService,
              private _Router:Router,
              private _authentication:AuthenticationService) {
    this.searchresultfor = this.url.substr(this.url.lastIndexOf('/') + 1);
    this.selectedtitleunscribe = this._SearchResultService.Getselectedtitle.subscribe((res:any)=>{
      this.searchresultfor = res;
      this.selectedtitleboolean = true;
      this.GetSearchedPostsData();
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
    this._SearchResultService.SetActiveTabName('images');
    if(localStorage.getItem("postsrecommand") != null){
      let getrecommanddata:any = localStorage.getItem("postsrecommand");
      let Encoded = atob(getrecommanddata);
      this.SelectRecommandation = Encoded
    }
    
    setTimeout(() => {
      if(this.selectedtitleboolean == false){
        this.GetSearchedPostsData()
      }
    }, 100);
    
  }

  GetSearchedPostsData(){
    const data = {
      categoryNames:this.SelectedCategory,
      sortBy:this.SelectRecommandation,
      keyword:this.searchresultfor
    }
    this._SearchResultService.searchedpostlist(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.SearchedPostsList = res.data
      }
    })
  }

  RecommandValue(event:any){
    this.SelectRecommandation=event
    localStorage.setItem("postsrecommand",btoa(this.SelectRecommandation))
    this.GetSearchedPostsData()
  }

  //  side toggle method
  imgpostopen(data:any){
    this.postdetailsopen = !this.postdetailsopen;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
    this.SinglePostData = data;
  };

  
  closesidebar(){
    this.iconClickType = {iconClick:false}
    this.sideoverhide = false;
    this.postdetailsopen = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };

  ngOnDestroy(): void{
    this.selectedtitleunscribe.unsubscribe()
  }

}
