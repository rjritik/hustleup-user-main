import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HashtagsDetailsService } from 'src/app/main/modules/hastags-details/hashtags-details.service';
import { SharedService } from '../../shared.service';
import { RightsidebarService } from './rightsidebar.service';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';

@Component({
  selector: 'app-rightsidebar',
  templateUrl: './rightsidebar.component.html',
  styleUrls: ['./rightsidebar.component.css']
})
export class RightsidebarComponent implements OnInit {
  TrendinghashtagsList:any=[]
  TrendingProductList:any=[]
  currencyUnit:any = getParamByISO(this._authentication.currentUserValue.countryCode, 'currency');

  constructor(private _HashtagsDetailsService:HashtagsDetailsService,
              private _RightsidebarService:RightsidebarService,
              private _SharedService:SharedService,
              private route:Router,
              private _authentication:AuthenticationService) { }

  ngOnInit(): void {
    this.GetTrendingHashtags();
    this.GetTrendingProducts();
    this.scrolling();
    $(window).scroll(this.scrolling);
  }

  scrolling(){
    var sticky = $('#stickyFix');
    let scroll:any = $(window).scrollTop();

    if (scroll >= 420) sticky.addClass('sticky-trending');
    else sticky.removeClass('sticky-trending');
    //    console.log("Scroll from Top: " + scroll.toString());
  };

  GetTrendingProducts(){
    this._RightsidebarService.gettrendingproduct().subscribe((res:any)=>{
      if(res.status == 200){
        this.TrendingProductList = res.data
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
    })
  }
  TrendingProductShowMore(){
    this.route.navigate(['/explore'])
  }

  GetTrendingHashtags(){
    const data = {
      trendingHashtag:'trendingHashtag'
    }
    this._HashtagsDetailsService.getAllHashtagDetail(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.TrendinghashtagsList = res.data
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  TrendingHashtagsShowMore(){
   this.route.navigate(['/hastags'])
  }
  ProductName(item:any){
    if(item.isCurrent == false){
    this.route.navigate(['/product-detail',btoa(item._id)]);
    }else{
      this._SharedService.InfoToast("this product is Yours")
    }
  }

  hashtagname(item:any){
    const itm =window.btoa(JSON.stringify(item));
    localStorage.setItem("hasgtagsdetail",itm);
    this.route.navigate(['/hashtags-details']);
  }

}
