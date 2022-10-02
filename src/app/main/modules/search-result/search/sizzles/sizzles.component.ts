import { Component, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { SharedService } from 'src/app/main/shared/shared.service';
import { SearchResultService } from '../../search-result.service';
import { Select2OptionData } from 'ng-select2';
import { Subscription } from 'rxjs';
import { UserprofileService } from '../../../userprofile/userprofile.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/main/auth/service';

@Component({
  selector: 'app-sizzles',
  templateUrl: './sizzles.component.html',
  styleUrls: ['./sizzles.component.css']
})
export class SizzlesComponent implements OnInit,OnDestroy {
  iconClickType:any;
  public Recommand:any = Array<Select2OptionData>();
  SelectRecommandation:any=''
  searchresultfor:any='';
  selectedtitleunscribe:Subscription;
  selectedtitleboolean:boolean = false;
  SearchedVideosList:any=[];
  SelectedCategory:any=[];
  public url:any = this._Router.url;
  sideoverhide:any;
  videodetailsopen:any;
  SingleVideoData:any;
   
  constructor(private _SearchResultService:SearchResultService,
              private _SharedService:SharedService,
              private _UserprofileService:UserprofileService,
              private _Router:Router
            ){
    this.searchresultfor = this.url.substr(this.url.lastIndexOf('/') + 1);
    this.selectedtitleunscribe = this._SearchResultService.Getselectedtitle.subscribe((res:any)=>{
      this.searchresultfor = res;
      this.selectedtitleboolean = true;
      this.GetSearchedVideosData();
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
    this._SearchResultService.SetActiveTabName('videos');
    if(localStorage.getItem("videorecommand") != null){
      let getrecommanddata:any = localStorage.getItem("videorecommand");
      let Encoded = atob(getrecommanddata);
      this.SelectRecommandation = Encoded
    }
    setTimeout(() => {
      if(this.selectedtitleboolean == false){
        this.GetSearchedVideosData()
      }
    }, 100);
  }

  GetSearchedVideosData(){
    const data = {
      categoryNames:this.SelectedCategory,
      sortBy:this.SelectRecommandation,
      keyword:this.searchresultfor
    }
    this._SearchResultService.searchedvideolist(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.SearchedVideosList = res.data
      }
    })
  }

  RecommandValue(event:any){
    this.SelectRecommandation=event
    localStorage.setItem("videorecommand",btoa(this.SelectRecommandation))
    this.GetSearchedVideosData()
  }

  SavedUnsavedPostVideo(item:any){
    const data = {
      postId:item._id,
      isBookmarked:!item.isBookmarked
  }
    this._UserprofileService.bookmarkPostVideo(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message);
        item.isBookmarked = !item.isBookmarked;
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }

    },(err)=>{
      this._SharedService.errorToast(err)
    })
  }

  postvideoopen(data:any){
    this.videodetailsopen = !this.videodetailsopen;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
    this.SingleVideoData = data;
  };

  closesidebar(){
    this.iconClickType = {iconClick:false};
    this.sideoverhide = false;
    this.videodetailsopen = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };

  ngOnDestroy(): void{
    this.selectedtitleunscribe.unsubscribe()
  }

}
