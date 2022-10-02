import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/main/shared/shared.service';
import { SearchResultService } from '../../search-result.service';
import { Select2OptionData } from 'ng-select2';
import { ActivatedRoute, Router } from '@angular/router';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit,OnDestroy {
  public Recommand:any = Array<Select2OptionData>();
  SelectRecommandation:any=''
  SearchedProductList:any=[];
  SlideOptions:any;
  searchresultfor:any='';
  public url:any = this._Router.url;
  producttypewisedataunscribe:Subscription;
  selectedtitleunscribe:Subscription;
  selectedtitleboolean:boolean = false;

  SelectedProductTypeId:any=[];
  SelectedBrandIdArray:any=[];
  SelectedPriceArray:any=[];
  SelectedcolorArray:any=[];
  SelectedratingsArray:any=[];
  SelecteddiscountArray:any=[];
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');

  constructor(private _SearchResultService:SearchResultService,private _AuthenticationService:AuthenticationService,private _SharedService:SharedService,private _Router:Router) {
    this.searchresultfor = this.url.substr(this.url.lastIndexOf('/') + 1);
    this.selectedtitleunscribe = this._SearchResultService.Getselectedtitle.subscribe((res:any)=>{
      this.searchresultfor = res;
      this.selectedtitleboolean = true;
      this.GetSearchedProductData();
    });

    this.producttypewisedataunscribe = this._SearchResultService.GetProductTypeWiseData.subscribe((res:any)=>{
      this.SelectedProductTypeId = res.productTypeId
      this.SelectedBrandIdArray= res.brandIdArray
      this.SelectedPriceArray= res.priceArray
      this.SelectedcolorArray= res.colorArray
      this.SelectedratingsArray= res.ratingsArray
      this.SelecteddiscountArray= res.discountArray
      this.GetSearchedProductData();
    })
  }

  ngOnInit(): void {
    this.Recommand = [
      {
        id: 'most_popular',
        text: 'Most Popular'
      },
      {
        id: 'top_rated',
        text: 'Top Rated'
      },
      {
        id: 'highest_price',
        text: 'Highest Price'
      },
      {
        id: 'lowest_price',
        text: 'Lowest Price'
      },
    ]
    this.GetProductsLocalStorageData()
    setTimeout(() => {
      if(this.selectedtitleboolean == false){
        this.GetSearchedProductData()
      }
    }, 100);
    
    this._SearchResultService.SetActiveTabName('products');
    this.SlideOptions = {nav:false, items: 1, loop:false,autoplay:false,autoplayTimeout:1000};
  }
  GetProductsLocalStorageData(){
    if(localStorage.getItem("productrecommand") != null){
      let getrecommanddata:any = localStorage.getItem("productrecommand");
      let Encoded = atob(getrecommanddata);
      this.SelectRecommandation = Encoded
    }

    if(localStorage.getItem("ProductTypewiseData") != null){
      let getprotypewisedata:any = localStorage.getItem("ProductTypewiseData")
      let Endodedata = atob(getprotypewisedata)
      let localstoragedata = JSON.parse(Endodedata)

      this.SelectedBrandIdArray=localstoragedata.brandIdArray

      this.SelectedPriceArray=localstoragedata.priceArray

      this.SelectedcolorArray=localstoragedata.colorArray

      this.SelectedratingsArray=localstoragedata.ratingsArray

      this.SelecteddiscountArray=localstoragedata.discountArray
    }
  }

  GetSearchedProductData(){
    const data = {
      keyword:this.searchresultfor,
      sortBy:this.SelectRecommandation,
      productTypeId: this.SelectedProductTypeId,
      brandIdArray:this.SelectedBrandIdArray,
      priceArray:this.SelectedPriceArray,
      colorArray:this.SelectedcolorArray,
      ratingsArray:this.SelectedratingsArray,
      discountArray:this.SelecteddiscountArray
    }
    this._SearchResultService.viewProductTypeWise(data).subscribe((res:any)=>{
      if(res.status == 200) {
        this.SearchedProductList = res.data
        const senddata ={
          producttypeid:res.productTypeId,
          keyword:this.searchresultfor
        }
        this._SearchResultService.SetProductTypeId(senddata)
        this.SelectedProductTypeId=[];
        this.SelectedBrandIdArray=[];
        this.SelectedPriceArray=[];
        this.SelectedcolorArray=[];
        this.SelectedratingsArray=[];
        this.SelecteddiscountArray=[];
      }
      if(res.status == 500) this._SharedService.errorToast(res.message)
    })
  }

  RecommandValue(event:any){
    this.SelectRecommandation=event
    localStorage.setItem("productrecommand",btoa(this.SelectRecommandation))
    this.GetSearchedProductData()
  }

  ProductClick(item:any){
    const url = this._Router.createUrlTree(['/product-detail', btoa(item._id)]);
    window.open(url.toString(), '_blank');
  }

  ngOnDestroy(): void{
    this.producttypewisedataunscribe.unsubscribe();
    this.selectedtitleunscribe.unsubscribe()
  }
}
