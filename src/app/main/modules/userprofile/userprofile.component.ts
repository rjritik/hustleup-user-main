import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../auth/service';
import { SharedService } from '../../shared/shared.service';
import { UserprofileService } from './userprofile.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit,OnDestroy {
  userpic:any;
  userdefaultimg:any;
  sideoverhide:any = false;
  seller:boolean = false;
  Influencer:boolean = false;
  user:boolean = false; 
  subscriptions: Subscription[] = [];
  sliderbarOpen:boolean = false;
  constructor(private _authentication:AuthenticationService,
              private _UserprofileService:UserprofileService,
              private _AuthenticationService:AuthenticationService, 
              private _SharedService:SharedService) { }

  ngOnInit(): void{
    this._authentication.navbarsub.next(false);
    this._UserprofileService.viewUserDetail().subscribe(res=>{
      const response:any = res;
      this.userpic = `${response.profilePic}`;
      if(this.userpic != 'undefined'){
        this.userdefaultimg = `${response.profilePic}`;
      }else{
        this.userdefaultimg = "./assets/images/defalutuser.png"
      }
    });

    if(this._AuthenticationService.isSeller == true){
      this.seller =true;
    }
    if(this._AuthenticationService.isInfluencer == true){
      this.Influencer = true;
    }
    if(this._AuthenticationService.isUser == true){
      this.user = true;
    }
    this.subscriptions.push(
      this._SharedService.GetLeftSidebarMobile.subscribe(async(res)=>{
        this.sliderbarOpen = res;
        this.sideoverhide = res;
        if(res){
         $('body').css({
           'overflow-y': 'hidden',
         });
         // this.sideRightOverHide = false;
         // this._SharedService.getRightSidebar(this.sideRightOverHide);
        }else{
         $('body').css({
           'overflow-y': 'auto',
         });
        }
     }),
    )
  }

  ngOnDestroy(){
    this._authentication.navbarsub.next(true);
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
    this._SharedService.GetLeftSidebar(false);
  }

  closesidebar(){
    this.sliderbarOpen = !this.sliderbarOpen;
    this.sideoverhide = !this.sideoverhide;
    this._SharedService.GetLeftSidebar(this.sideoverhide);
    $('body').css({
      'overflow-y': 'auto',
    });
  }

}