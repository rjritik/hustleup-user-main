import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared.service';
import { NavbarService } from '../navbar/navbar.service';

@Component({
  selector: 'app-navbarsub',
  templateUrl: './navbarsub.component.html',
  styleUrls: ['./navbarsub.component.css']
})
export class NavbarsubComponent implements OnInit{
  navmenulist:any;
  menuOpen:number = -1;
  subMenuOpen:number = -1;

  constructor(private _NavbarService:NavbarService, private _SharedService:SharedService, private _Router:Router) { }

  ngOnInit(): void{
    this.GetSubMenuAndProductType();
  }

  GetSubMenuAndProductType(){
    this._NavbarService.getSubMenuAndProductType().subscribe((res:any)=>{
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

  menuMain(indexMenu:number){
    if(indexMenu === this.menuOpen){
      this.menuOpen = -1;
    }else{
      this.menuOpen = indexMenu;
    }
  }

  subMenu(indexSubMenu:number){
    if(indexSubMenu === this.subMenuOpen){
      this.subMenuOpen = -1;
    }else{
      this.subMenuOpen = indexSubMenu;
    }
  }

  ProductTypeClick(item:any){
    this._Router.navigate(['/ProductTypeSearch',btoa(item._id),btoa(item.title)]);
  }
}
