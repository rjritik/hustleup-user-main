import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../auth/service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  navbarsub:boolean = true;
  navbarsubunsubscribe:Subscription [] = [];
  menuShowingResponsive:boolean = false;
  slidebarToggle:boolean = false;
  
  constructor(private _authentication:AuthenticationService, 
              private _SharedService:SharedService){
    this.navbarsubunsubscribe.push(
      this._authentication.navbarsub.subscribe(res=>{
        this.navbarsub = res;
      }),
    )
  }

  ngOnInit(): void{
    if (window.innerWidth < 992) {
      this.menuShowingResponsive = true;
    }
    this.navbarsubunsubscribe.push(
      this._SharedService.getRightSidebarMobile.subscribe(res=>{
        this.slidebarToggle = res;    
    }),
    )
  }

  rightSliderBar(){
    this.slidebarToggle = !this.slidebarToggle;
    this._SharedService.getRightSidebar(this.slidebarToggle);
  }

  ngOnDestroy():void{
    this.navbarsubunsubscribe.forEach((subscribe) => subscribe.unsubscribe());
  }
}