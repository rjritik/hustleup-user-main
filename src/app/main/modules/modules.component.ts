import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModulesService } from './modules.service';
import { Router} from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit, OnDestroy {
  sliderbarOpen:boolean = false;
  rightSliderBarOpen:boolean = false;
  sideoverhide:boolean = false;
  sideRightOverHide:boolean = false;
  menuShowingResponsive:boolean = false;
  cartSideOverHide:boolean = false;

  GetLeftSidebarMobileUnsub$: Subscription;
  getRightSidebarMobileUnsub$: Subscription;
  cartSidebarUnsub$: Subscription;
  subscriptions: Subscription[] = []

  constructor(private _SharedService:SharedService){ }

  ngOnInit(): void{
    if (window.innerWidth < 992){
      this.menuShowingResponsive = true;
    }
    this.GetLeftSidebarMobileSubscribe();
    this.getRightSidebarMobileSubscribe();
    this.cartSideBarOpenSubscribe();
    this.UnsubscribeMethod();
  }

  GetLeftSidebarMobileSubscribe(){
    this.GetLeftSidebarMobileUnsub$ = this._SharedService.GetLeftSidebarMobile.subscribe(async(res)=>{
      this.sliderbarOpen = res;
      this.sideoverhide = res;
      if(res){
       $('body').css({
         'overflow-y': 'hidden',
       });
      }else{
       $('body').css({
         'overflow-y': 'auto',
       });
      }
   })
  }

  getRightSidebarMobileSubscribe(){
    this.getRightSidebarMobileUnsub$ = this._SharedService.getRightSidebarMobile.subscribe(async(res)=>{
      this.sideRightOverHide = res;
      this.rightSliderBarOpen = res;
      if(res){
        $('body').css({
          'overflow-y': 'hidden',
        });
      }else{
        $('body').css({
          'overflow-y': 'auto',
        });
       }
    })
  }
  
  cartSideBarOpenSubscribe(){
    this.cartSidebarUnsub$ = this._SharedService.getCartSidebarOpen().subscribe((data:any)=>{
      if(data){
          this.cartSideOverHide = data.cartIconClick;
        if(data.cartIconClick){
          $('body').css({
            'overflow-y': 'hidden',
          });
        }else{
          $('body').css({
            'overflow-y': 'auto',
          });
        }
      }
    });
  }

  UnsubscribeMethod(){
    this.subscriptions.push(this.GetLeftSidebarMobileUnsub$);
    this.subscriptions.push(this.getRightSidebarMobileUnsub$);
    this.subscriptions.push(this.cartSidebarUnsub$);
  }

  closesidebar(){
    this.sliderbarOpen = !this.sliderbarOpen;
    this.sideoverhide = !this.sideoverhide;
    this._SharedService.GetLeftSidebar(this.sideoverhide);
    $('body').css({
      'overflow-y': 'auto',
    });
  };

  closeRihgtSidebar(){
    this.rightSliderBarOpen = !this.rightSliderBarOpen;
    this.sideRightOverHide = !this.sideRightOverHide;
    this._SharedService.getRightSidebar(this.sideRightOverHide);
    $('body').css({
      'overflow-y': 'auto',
    });
  }

  closeCartSidebar(){
    this.cartSideOverHide = false;
    const data = {
      cartIconClick:false
    }
    this._SharedService.setCartSideBarOpen(data);
    $('body').css({
      'overflow-y': 'auto',
    });
  }

  ngOnDestroy(): void{
    this._SharedService.GetLeftSidebar(false);
    this._SharedService.getRightSidebar(false);
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }
}