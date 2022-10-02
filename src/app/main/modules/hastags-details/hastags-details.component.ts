import { Component, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from '../../auth/service';
import { SharedService } from '../../shared/shared.service';
import { HashtagsDetailsService } from './hashtags-details.service';

@Component({
  selector: 'app-hastags-details',
  templateUrl: './hastags-details.component.html',
  styleUrls: ['./hastags-details.component.css']
})
export class HastagsDetailsComponent implements OnInit,OnDestroy {
  hashtagdetaildata:any=[]

  constructor(private _HashtagsDetailsService:HashtagsDetailsService,
              private _SharedService:SharedService,
              private _authentication:AuthenticationService,
              private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this._authentication.navbarsub.next(false);
    this.GetHashtagDetail()
  }

  GetHashtagDetail(){
    const getdata:any = localStorage.getItem("hasgtagsdetail")
    const decodeddata = window.atob(getdata)
    const detail = JSON.parse(decodeddata)
    let data={
      hashtagName: this.sanitizer.sanitize(SecurityContext.HTML, detail.hashtagName)
    }
    this._HashtagsDetailsService.getHashtagCounterAndFollowing(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.hashtagdetaildata = res.data
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  FollowHashtags(item:any){
    let data ={
      hashtagName: this.sanitizer.sanitize(SecurityContext.HTML, item.hashtagName),
      isFollowing: true
    }
    this._HashtagsDetailsService.followhashtags(data).subscribe((res:any)=>{
      console.log(res,"res---=--  ")
    
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
    let data ={
      hashtagName: this.sanitizer.sanitize(SecurityContext.HTML, item.hashtagName),
      isFollowing: false
    }
    this._HashtagsDetailsService.followhashtags(data).subscribe((res:any)=>{
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

  ngOnDestroy(): void {
    localStorage.removeItem("hasgtagsdetail") 
    this._authentication.navbarsub.next(true);
  }

}
