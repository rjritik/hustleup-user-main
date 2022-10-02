import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/main/auth/service';
import { UserprofileService } from 'src/app/main/modules/userprofile/userprofile.service';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-leftsidebar',
  templateUrl: './leftsidebar.component.html',
  styleUrls: ['./leftsidebar.component.css']
})
export class LeftsidebarComponent implements OnInit {
  IsUserNdInfluencer:boolean = false;
  
  constructor(private _authentication:AuthenticationService, private _UserprofileService:UserprofileService, private _SharedService:SharedService, public router:Router){ }

  ngOnInit(): void {
    if(this._authentication.isUser == true || this._authentication.isInfluencer == true){
      this.IsUserNdInfluencer = true;
    }else{
      this.IsUserNdInfluencer = false;
    }
  }
  
}
