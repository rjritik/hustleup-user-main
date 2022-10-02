import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/main/shared/shared.service';
import { SearchResultService } from '../../search-result.service';
import { Subscription } from 'rxjs';
import { HomeService } from '../../../home/home.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit,OnDestroy {
  searchresultfor:any='';
  SearchedUserData:any=[];
  public url:any = this._Router.url;
  selectedtitleunscribe:Subscription;
  selectedtitleboolean:boolean = false;

  constructor(private _SearchResultService:SearchResultService,private _SharedService:SharedService,private _Router:Router, private _HomeService:HomeService) {
    this.searchresultfor = this.url.substr(this.url.lastIndexOf('/') + 1);
    this.selectedtitleunscribe = this._SearchResultService.Getselectedtitle.subscribe((res:any)=>{
      this.searchresultfor = res;
      this.selectedtitleboolean = true;
      this.GetSearchedUserList();
    })
  }

  ngOnInit(): void {
    this._SearchResultService.SetActiveTabName('users');
    setTimeout(() => {
      if(this.selectedtitleboolean == false){
        this.GetSearchedUserList()
      }
    }, 100);
  }

  GetSearchedUserList(){
    const data = {
      pattern:this.searchresultfor,
      forSearch:"forSearch"
    }
    this._SearchResultService.searcheduserlist(data).subscribe((res:any)=>{
      if(res.status == 200) this.SearchedUserData = res.data
      if(res.status == 404) this._SharedService.errorToast(res.message)
      if(res.status == 500) this._SharedService.errorToast(res.message)
    })
  }

  UserFollow(item:any){
    const data = {
      userId: item._id,
      isFollowing: true
    }
    this._HomeService.followAccount(data).subscribe((res:any)=>{
      if(res.status == 200){
        item.isFollowing = true
        this._SharedService.successToast(res.message)
      }
      if(res.status == 500) this._SharedService.errorToast(res.message)
    })
  }
  UserUnfollow(item:any){
    const data = {
      userId: item._id,
      isFollowing: false
    }
    this._HomeService.followAccount(data).subscribe((res:any)=>{
      if(res.status == 200){
        item.isFollowing = false
        this._SharedService.successToast(res.message)
      }
      if(res.status == 500) this._SharedService.errorToast(res.message)
    })
  }
  ngOnDestroy(): void{
    this.selectedtitleunscribe.unsubscribe();
  }
}
