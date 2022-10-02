import { ConditionalExpr } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/main/auth/service';
import { UserprofileService } from '../userprofile.service';
import { SharedService } from '../../../shared/shared.service';
import { HomeService } from 'src/app/main/modules/home/home.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userprofiledata:any;
  IsUser:boolean = false;

  constructor(private _authentication:AuthenticationService,private _UserprofileService:UserprofileService,private _SharedService:SharedService, private _HomeService:HomeService) { }

  ngOnInit(): void {
    this._authentication.navbarsub.next(false);
    if(this._authentication.isUser == true){
      this.IsUser = true;
    }
    this.GetUserProfileDetail()
  }

  GetUserProfileDetail(){
    this._UserprofileService.viewUserDetail().subscribe((res:any)=>{
      if(res.status == 200){
        this.userprofiledata = res;
        this._SharedService.SetUserprofileId(this.userprofiledata.id)
      }
      if(res.status == 404){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    },(err =>{
      console.log(err, "err data");
   }));
  }

 

  followuser(e:any){
    e.isFollowing = true;
    const data = {
      "userId":e.id,
      "isFollowing": true
    }
    this._HomeService.followAccount(data).subscribe(res=>{
      const response:any = res;
      this._SharedService.successToast(response.message);
    },(err)=>{
      console.log(err,"follow user error");
    });
  }
}
