import { Component, OnDestroy, OnInit,ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { SearchResultService } from './search-result.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit,OnDestroy {
  filtersearchabs = false;
  ProductTypeId:any=[];
  BrandList:any=[];
  ColorList:any=[];
  PricesList:any=[];
  RatingsList:any=[];
  brandmore:boolean = true;
  colormore:boolean = true;
  CategoriesList=[
    "Looks & Style",
    "Beauty & Makeup",
    "Fashion & Apparel Design",
    "Decoration",
    "Paint, Graphics & Designs",
    "Health & Fitness",
    "Offer, Coupon & Code",
    "Fun & Entertainments",
    "Products",
    "Services",
    "Others",
  ];
  DiscountList = [
    {maxValue:10},
    {maxValue:20},
    {maxValue:30},
    {maxValue:40},
    {maxValue:50},
  ];
  SelectedCategory:any=[];
  categorywiseresponse:any=[]
  activepagecheck:any;
  SearchedBrandtext:any='';
  SelectedBrand:any=[];
  BrandIdArray:any=[];
  SelectedPrice:any=[];
  PriceArray:any=[];
  SelectedColor:any=[];
  colorArray:any=[];
  SelectedRating:any=[];
  ratingsArray:any=[];
  SelectedDiscount:any=[];
  discountArray:any=[];
  minvalue_old:any;
  maxvalue_old:any;
  selectedtitleunscribe:Subscription;
  selectedprducttypeunscribe:Subscription;
  searchresultfor:any
  public url:any = this._Router.url;
  public activeRoute:any;
  public isProductDataAvailable:boolean = false;

  constructor(private _SearchResultService:SearchResultService,private _SharedService:SharedService,private cdr: ChangeDetectorRef,private _Router:Router) { 
    //----- refresh time call start-------------
    this.searchresultfor = this.url.substr(this.url.lastIndexOf('/') + 1);
    this.activeRoute = this.url.split("/").at(-2)
    //----- refresh time call end-------------
    //----- default product ave tyare   call start-------------
    this.selectedprducttypeunscribe = this._SearchResultService.GetProductTypeId.subscribe((res:any)=>{
        this.BrandList=[];
        this.ColorList=[];
        this.PricesList=[];
        this.RatingsList=[];
        this.isProductDataAvailable = false;
      // if(this.searchresultfor != res.keyword){
        this.ProductTypeId = res.producttypeid
        this.searchresultfor = res.keyword
        this.activeRoute =window.location.href.split("/")[window.location.href.split("/").length -2]
        if(this.ProductTypeId.length > 0) {
          this.GetAllSearchListingByProductTypeIds();
        }
      // }
    })
    //----- default product ave tyare   call end-------------
    //----- jyare main searchbar mathi value change  tyare  call start-------------
    this.selectedtitleunscribe = this._SearchResultService.Getselectedtitle.subscribe((res:any)=>{
      this.searchresultfor = res;
      this.activeRoute =window.location.href.split("/")[window.location.href.split("/").length -2]
    })
    //----- jyare main searchbar mathi value change  tyare  call end-------------

  }

  ngOnInit(): void {
      this.PriceForm.get("minprice").valueChanges.subscribe((x:any) => {
        this.valcheckvalid();
     })
      this.PriceForm.get("maxprice").valueChanges.subscribe((x:any) => {
        this.valcheckvalid();
    })

  }

  valcheckvalid(){
    if(this.PriceForm.valid){
    }else{
      let getindexs = this.PriceArray.findIndex((res:any,)=>res.minValue == this.minvalue_old && res.maxValue == this.maxvalue_old)
      if(getindexs != -1){
        this.SelectedPrice.splice(getindexs, 1);
        this.PriceArray.splice(getindexs, 1);
        this.getProductTypewise()
      }
      
    }
  }

  PriceForm: any = new FormGroup({
    minprice: new FormControl(undefined, [Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
    maxprice: new FormControl(undefined, [Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
  });

  get f() {
    return this.PriceForm;
  }

  productClick(){
    this.activeRoute =window.location.href.split("/")[window.location.href.split("/").length -2]
  }

  postsClick(){ 
    this.activeRoute =window.location.href.split("/")[window.location.href.split("/").length -2]
  }
  sizzlesClick(){
    this.activeRoute =window.location.href.split("/")[window.location.href.split("/").length -2]
  }

  blogsClick(){
    this.activeRoute =window.location.href.split("/")[window.location.href.split("/").length -2]
  }

  hashtagsClick(){
    this.activeRoute =window.location.href.split("/")[window.location.href.split("/").length -2]
  }

  usersClick(){
    this.activeRoute =window.location.href.split("/")[window.location.href.split("/").length -2]
  }

  GetAllSearchListingByProductTypeIds(){
    const data = {
      productTypeId:this.ProductTypeId,
      keyword:this.searchresultfor
    }
    this._SearchResultService.getAllSearchListingByProductTypeId(data).subscribe((res:any)=>{
      if(res.status == 200){
        if(res.data && res.data.length > 0) {
          this.isProductDataAvailable = true;
          res.data.forEach((element:any) => {
            if(element.title == "Brands")this.BrandList=element.title_data
            if(element.title == "Color")this.ColorList=element.title_data
            if(element.title == "Prices")this.PricesList=element.title_data
            if(element.title == "Ratings")this.RatingsList=element.title_data
          });  
        } else {
          this.isProductDataAvailable = false;
        }
        this.GetProductsLocalStorageData();
      }else{
        this._SharedService.errorToast(res.message);
      }
    })
  }

  GetProductsLocalStorageData(){
    if(localStorage.getItem("ProductTypewiseData") != null){
      let getprotypewisedata:any = localStorage.getItem("ProductTypewiseData")
      let Endodedata = atob(getprotypewisedata)
      let localstoragedata = JSON.parse(Endodedata)

      localstoragedata.brandIdArray.forEach((mainele:any,i:any) => {
        this.BrandList.forEach((element:any,j:any) => {
        if(mainele == element.brandId){
          this.SelectedBrand.push(element)
          this.BrandIdArray.push(element.brandId)
        }
        });
      });

      localstoragedata.priceArray.forEach((mainele:any,i:any) => {
        this.PricesList.forEach((element:any,j:any) => {
        if(mainele.minValue == element.minValue && mainele.maxValue == element.maxValue){
          this.SelectedPrice.push(element)
          this.PriceArray.push({minValue:element.minValue,maxValue:element.maxValue})
        }
        });
      });

      localstoragedata.colorArray.forEach((mainele:any,i:any) => {
        this.ColorList.forEach((element:any,j:any) => {
        if(mainele == element.colorId){
          this.SelectedColor.push(element)
          this.colorArray.push(element.colorId) 
        }
        });
      });

      localstoragedata.ratingsArray.forEach((mainele:any,i:any) => {
        this.RatingsList.forEach((element:any,j:any) => {
        if(mainele.minValue == element.minValue){
          this.SelectedRating.push(element)
          this.ratingsArray.push({minValue:element.minValue}) 
        }
        });
      });

      localstoragedata.discountArray.forEach((mainele:any,i:any) => {
        this.DiscountList.forEach((element:any,j:any) => {
        if(mainele.maxValue == element.maxValue){
          this.SelectedDiscount.push(element)
          this.discountArray.push({maxValue:element.maxValue}) 
        }
        });
      });
    }
  }

  CloseBrandSearch(){
    this.SearchedBrandtext = '';
    this.filtersearchabs = !this.filtersearchabs
  }

  BrandMoreClick(){
    this.brandmore = !this.brandmore
  }

  ColorMoreClick(){
    this.colormore = !this.colormore
  }

  BrandChange(checked:any, item:any) {
    if (checked.target.checked) {
      this.SelectedBrand.push(item);
    } else {
      this.SelectedBrand.splice(this.SelectedBrand.indexOf(item), 1);
    }
    this.BrandIdArray = []
    this.SelectedBrand.forEach((element:any) => {
      this.BrandIdArray.push(element.brandId) 
    });
    this.getProductTypewise()
  }

  BrandChecked(item:any) {
    if (this.SelectedBrand.indexOf(item) != -1) {
      return true;
    }
  }

  minmaxvalid(){
    
  }

  PriceChange(checked:any, item:any) {
    if (checked.target.checked) {
      this.SelectedPrice.push(item);
    } else {
      this.SelectedPrice.splice(this.SelectedPrice.indexOf(item), 1);
    }
    this.PriceArray = []
    this.SelectedPrice.forEach((element:any) => {
      this.PriceArray.push({minValue:element.minValue,maxValue:element.maxValue}) 
    }); 
    this.getProductTypewise()
  }

  PriceChecked(item:any) {
    if (this.SelectedPrice.indexOf(item) != -1) {
      return true;
    }
  }
  async SearchedPrice(f:any){
    if(f.valid){
      if(f.value.minprice < f.value.maxprice){
        const data = {
          minValue:f.value.minprice,
          maxValue:f.value.maxprice,
        }
        if(this.SelectedPrice.length === 0 && this.PriceArray.length === 0){
          this.SelectedPrice.push(data);
          this.PriceArray.push(data);
          this.minvalue_old = f.value.minprice;
          this.maxvalue_old = f.value.maxprice;
        }else{
          let getindex = this.PriceArray.findIndex((res:any,)=>res.minValue == this.minvalue_old && res.maxValue == this.maxvalue_old)
          if(getindex == -1){
              this.PriceArray.push(data);
              this.SelectedPrice.push(data);
              this.minvalue_old = f.value.minprice;
              this.maxvalue_old = f.value.maxprice;
          }else{
            this.SelectedPrice.splice(getindex, 1);
            this.PriceArray.splice(getindex, 1);
            this.PriceArray.push(data);
            this.SelectedPrice.push(data);
            this.minvalue_old = f.value.minprice;
            this.maxvalue_old = f.value.maxprice;
            }
        }
        await this.getProductTypewise()
      }else{
        this._SharedService.errorToast("minprice is highter than or same maxprice")
      }
    }else{
      this.PriceForm.markAllAsTouched()
    }

  }

  ColorChange(checked:any, item:any) {
    if (checked.target.checked) {
      this.SelectedColor.push(item);
    } else {
      this.SelectedColor.splice(this.SelectedColor.indexOf(item), 1);
    }
    this.colorArray = []
    this.SelectedColor.forEach((element:any) => {
      this.colorArray.push(element.colorId) 
    });
    this.getProductTypewise()
  }

  ColorChecked(item:any) {
    if (this.SelectedColor.indexOf(item) != -1) {
      return true;
    }
  }

  RatingChange(checked:any, item:any) {
    if (checked.target.checked) {
      this.SelectedRating.push(item);
    } else {
      this.SelectedRating.splice(this.SelectedRating.indexOf(item), 1);
    }
    this.ratingsArray = []
    this.SelectedRating.forEach((element:any) => {
      this.ratingsArray.push({minValue:element.minValue}) 
    });
    this.getProductTypewise()
  }

  RatingChecked(item:any) {
    if (this.SelectedRating.indexOf(item) != -1) {
      return true;
    }
  }

  DiscountChange(checked:any, item:any) {
    if (checked.target.checked) {
      this.SelectedDiscount.push(item);
    } else {
      this.SelectedDiscount.splice(this.SelectedDiscount.indexOf(item), 1);
    }
    this.discountArray = []
    this.SelectedDiscount.forEach((element:any) => {
      this.discountArray.push({maxValue:element.maxValue}) 
    });
   this.getProductTypewise()
  }

  DiscountChecked(item:any) {
    if (this.SelectedDiscount.indexOf(item) != -1) {
      return true;
    }
  }

  ProductClearAll(){
    this.SelectedBrand=[];
    this.BrandIdArray = [];
    this.SelectedPrice=[];
    this.PriceArray = [];
    this.SelectedColor=[];
    this.colorArray = [];
    this.SelectedRating=[];
    this.ratingsArray = [];
    this.SelectedDiscount=[];
    this.discountArray = [];
    this.getProductTypewise()
  }

  PriceClear(){
    this.SelectedPrice=[];
    this.PriceArray = [];
    this.PriceForm.reset()
    this.getProductTypewise()
  }
  ColorClear(){
    this.SelectedColor=[];
    this.colorArray = [];
    this.getProductTypewise()
  }
  RatingClear(){
    this.SelectedRating=[];
    this.ratingsArray = [];
    this.getProductTypewise()
  }
  DiscountClear(){
    this.SelectedDiscount=[];
    this.discountArray = [];
    this.getProductTypewise()
  }

  getProductTypewise(){
    const Apidata:any = {
      productTypeId: this.ProductTypeId,
      brandIdArray:this.BrandIdArray,
      priceArray:this.PriceArray,
      colorArray:this.colorArray,
      ratingsArray:this.ratingsArray,
      discountArray:this.discountArray
    }
    const encodedata = btoa(JSON.stringify(Apidata))
    localStorage.setItem("ProductTypewiseData",encodedata)

    this._SearchResultService.SetProductTypeWiseData(Apidata)
  }

  ngOnDestroy(){
    localStorage.removeItem("ProductTypewiseData");
    localStorage.removeItem("postsrecommand");
    localStorage.removeItem("videorecommand");
    localStorage.removeItem("productrecommand");
    localStorage.removeItem("blogsrecommand");
    this.selectedprducttypeunscribe.unsubscribe();
    this.selectedtitleunscribe.unsubscribe();

  } 

  ngAfterContentChecked(){
    this.cdr.detectChanges();
  }
}