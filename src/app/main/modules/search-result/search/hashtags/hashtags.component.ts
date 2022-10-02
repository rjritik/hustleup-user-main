import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IoTThingsGraph } from 'aws-sdk';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { SharedService } from 'src/app/main/shared/shared.service';
import { SearchResultService } from '../../search-result.service';

@Component({
  selector: 'app-hashtags',
  templateUrl: './hashtags.component.html',
  styleUrls: ['./hashtags.component.css']
})
export class HashtagsComponent implements OnInit,OnDestroy {
  searchresultfor:any='';
  SearchedHashtagsList:any=[];
  selectedtitleunscribe:Subscription;
  selectedtitleboolean:boolean = false;
  public url:any = this._Router.url;


  constructor(private _SearchResultService:SearchResultService,private _SharedService:SharedService,private _Router:Router) {
    this.searchresultfor = this.url.substr(this.url.lastIndexOf('/') + 1);
    this.selectedtitleunscribe = this._SearchResultService.Getselectedtitle.subscribe((res:any)=>{
      this.searchresultfor = res;
      this.selectedtitleboolean = true;
      this.GetSearchedHashtags();
    })
  }

  ngOnInit(): void {
    this._SearchResultService.SetActiveTabName('hashtags');
    setTimeout(() => {
      if(this.selectedtitleboolean == false){
        this.GetSearchedHashtags()
      }
    }, 100);
  }

  GetSearchedHashtags(){
    const data = {
      pattern:this.searchresultfor,
      fromSearch:"fromSearch"
    }
    this._SearchResultService.searchedhashtaglist(data).subscribe((res:any)=>{
      if(res.status == 200) this.SearchedHashtagsList = res.data
      if(res.status == 500) this._SharedService.errorToast(res.message)
    })
  }

  FollowHashtags(item:any){
    const data ={
      hashtagName:item.hashtagName,
      isFollowing: true
    }
    this._SearchResultService.followhashtags(data).subscribe((res:any)=>{
    
      if(res.status == 200){
        item.isFollowing = true
        this._SharedService.successToast(res.message)
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 404){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  FollowingHashtags(item:any){
    const data ={
      hashtagName:item.hashtagName,
      isFollowing: false
    }
    this._SearchResultService.followhashtags(data).subscribe((res:any)=>{
      if(res.status == 200){
      item.isFollowing = false
        this._SharedService.successToast(res.message)
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 404){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  ngOnDestroy(): void{
    this.selectedtitleunscribe.unsubscribe();
  }

}
