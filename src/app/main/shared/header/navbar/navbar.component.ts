import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/main/auth/service';
import { NavbarService } from './navbar.service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy{
  navmenulist:any;
  changeText: boolean;
  MenuSubCategoryList:any=[];
  ProductType:any=[];
  navsearchunsubscribe:Subscription;
  producttypeclicked:boolean = false;
  
  constructor(private _NavbarService:NavbarService,   
              private _SharedService: SharedService,
              private _Router:Router) {this.changeText = false; }
  ngOnInit(): void{
    this.GetSubMenuAndProductType();
  }

  GetSubMenuAndProductType(){
    this.navsearchunsubscribe = this._NavbarService.getSubMenuAndProductType().subscribe((res:any)=>{
      if(res.status == 200){
      this.navmenulist = res.data
      }
      if(res.status == 404){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  titlehover(){
    this.producttypeclicked = false
  }

  ProductTypeClick(item:any){
    this._Router.navigate(['/ProductTypeSearch',btoa(item._id),btoa(item.title)]);
    this.producttypeclicked = true;
    // this._Router.navigate(['/search']);
    // localStorage.setItem("protypeid",btoa(JSON.stringify(item)))
  }

  ngOnDestroy(): void{
    this.navsearchunsubscribe.unsubscribe();
  }
}