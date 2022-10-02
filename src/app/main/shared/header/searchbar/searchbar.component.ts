import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { SearchResultService } from 'src/app/main/modules/search-result/search-result.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit,OnDestroy {
  withoutlogin:boolean;
  SearchedText:any;
  Getproductsunsubscribe:Subscription;
  ActiveTabSearchOn:any='';
  SearchViewData:any=[];
  popupclicked = false
  
  constructor(private _authentication:AuthenticationService,private _Router:Router,private _SearchResultService:SearchResultService,private _ActivatedRoute:ActivatedRoute) {
    this.Getproductsunsubscribe = this._SearchResultService.GetActiveTabName.subscribe((res:any)=>{
      this.ActiveTabSearchOn = res 
    })
    if (this._authentication.currentUserValue) {
      this.withoutlogin = true;
    }else{
      this.withoutlogin = false;
    }
   }

  ngOnInit(): void {
  this._ActivatedRoute.paramMap.subscribe((params:any) => {
    if(params.get('id') !== null) this._SearchResultService.Setselectedtitle(params.get('id').trim())
  });
  }
  TypedTextKeyup(){
    if(this.SearchedText?.length === 0 || this.SearchedText == ''|| this.SearchedText == undefined){
      this.popupclicked =  false;
    }else{
      this.popupclicked = true;
    }
    this.GetSearchList();
  }

  GetSearchList(){
    if(this.SearchedText.trim() != ''){
      const data = {
        keyword:this.SearchedText.trim(),
        // searchOn:this.ActiveTabSearchOn
      }
      this._SearchResultService.getSearchListPopup(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.SearchViewData = res.data
        }
      })
    }
  }

  SearchedIconclick(){
    // this.GetSearchList();
     this.CheckActiveRouteAndNavigate()
  }

  searchtextpopupclick(){
    this.popupclicked = false
    this.CheckActiveRouteAndNavigate()
  }


  showpopupitemclick(item:any){
    this.popupclicked = false
    this._SearchResultService.Setselectedtitle(this.SearchedText.trim())
    if(item.name == "Products") this._Router.navigate(['/search/product',this.SearchedText.trim()]); // { queryParams: { title:this.SearchedText.trim() } }
    if(item.name == "Images") this._Router.navigate([`/search/posts/${this.SearchedText.trim()}`]);
    if(item.name == "Videos") this._Router.navigate(['/search/sizzles',this.SearchedText.trim()]);
    if(item.name == "Blogs") this._Router.navigate(['/search/blogs',this.SearchedText.trim()]);
    if(item.name == "Users") this._Router.navigate(['/search/users',this.SearchedText.trim()]);
    if(item.name == "Hashtags") this._Router.navigate(['/search/hashtags',this.SearchedText.trim()]);
    // this.CheckActiveRouteAndNavigate()
  }

  CheckActiveRouteAndNavigate(){
    this.popupclicked = false;
    this._SearchResultService.Setselectedtitle(this.SearchedText.trim())
    if(this.ActiveTabSearchOn == '' || this.ActiveTabSearchOn == 'products'){
      this._Router.navigate(['/search/product',this.SearchedText.trim()]); // { queryParams: { title:this.SearchedText.trim() } }
    }
    if(this.ActiveTabSearchOn == 'images'){
      this._Router.navigate(['/search/posts',this.SearchedText.trim()]);
    }
    if(this.ActiveTabSearchOn == 'videos'){
      this._Router.navigate(['/search/sizzles',this.SearchedText.trim()]);
    }
    if(this.ActiveTabSearchOn == 'blogs'){
      this._Router.navigate(['/search/blogs',this.SearchedText.trim()]);
    }
    if(this.ActiveTabSearchOn == 'users'){
      this._Router.navigate(['/search/users',this.SearchedText.trim()]);
    }
    if(this.ActiveTabSearchOn == 'hashtags'){
      this._Router.navigate(['/search/hashtags',this.SearchedText.trim()]);
    }
  }

  ngOnDestroy(){
    this.popupclicked = false
    this.Getproductsunsubscribe.unsubscribe();
  }

}
