import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { Select2OptionData } from 'ng-select2';
import { Subscription } from 'rxjs';
import { ProductTypeSearchService } from './product-type-search.service';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from '../../auth/service';

@Component({
  selector: 'app-product-type-search',
  templateUrl: './product-type-search.component.html',
  styleUrls: ['./product-type-search.component.css']
})
export class ProductTypeSearchComponent implements OnInit,OnDestroy {
  filtersearchabs = false;
  SelectedProductTypeId:any=[]
  BrandList:any=[];
  ColorList:any=[];
  PricesList:any=[];
  RatingsList:any=[];
  DiscountList = [
    {maxValue:10},
    {maxValue:20},
    {maxValue:30},
    {maxValue:40},
    {maxValue:50},
  ];
  brandmore:boolean = true;
  colormore:boolean = true;
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
  NotAvailData = false;

  public Recommand:any = Array<Select2OptionData>();
  SelectRecommandation:any=''
    SearchedProductList:any=[];
    SlideOptions:any;
    searchresultfor:any;
    currencyUnit:any = getParamByISO(this._authentication.currentUserValue.countryCode, 'currency');

  constructor(private _ProductTypeSearchService:ProductTypeSearchService,private _SharedService:SharedService,private _Router: Router,private _ActivatedRoute:ActivatedRoute, private _authentication:AuthenticationService) {
    this._Router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    }

   }

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((params:any) => {
      let producttypeid = atob(params.get('producttypeid'));
      this.SelectedProductTypeId = [producttypeid]
      let name = atob(params.get('producttypename'));
      this.searchresultfor = name
      this.GetAllSearchListingByProductTypeIds()
    });
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
    this.SlideOptions = {nav:false, items: 1, loop:false,autoplay:false,autoplayTimeout:1000};
    
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

  GetAllSearchListingByProductTypeIds(){
    const data = {
      productTypeId:this.SelectedProductTypeId
    }
    this._ProductTypeSearchService.getAllSearchListingByProductTypeId(data).subscribe((res:any)=>{
      if(res.status == 200){
        res.data.forEach((element:any) => {
          if(element.title == "Brands")this.BrandList=element.title_data
          if(element.title == "Color")this.ColorList=element.title_data
          if(element.title == "Prices")this.PricesList=element.title_data
          if(element.title == "Ratings")this.RatingsList=element.title_data
        });  
        this.GetProductsLocalStorageData()  
      }
      if(res.status == 500){
        this.NotAvailData = true
        this._SharedService.errorToast(res.message)
      } 
    })
  }

  GetProductsLocalStorageData(){
    if(localStorage.getItem("ProductTypewiseData") != null){
      let getprotypewisedata:any = localStorage.getItem("ProductTypewiseData")
      let Endodedata = atob(getprotypewisedata)
      let localstoragedata = JSON.parse(Endodedata)
      console.log(localstoragedata,"localstoragedata")

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

      this.SelectRecommandation = localstoragedata.sortBy
      this.getProductTypewise()
    }else{
      this.getProductTypewise()
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
      productTypeId: this.SelectedProductTypeId,
      brandIdArray:this.BrandIdArray,
      priceArray:this.PriceArray,
      colorArray:this.colorArray,
      ratingsArray:this.ratingsArray,
      discountArray:this.discountArray,
      sortBy:this.SelectRecommandation
    }
    const encodedata = btoa(JSON.stringify(Apidata))
    localStorage.setItem("ProductTypewiseData",encodedata)
    this._ProductTypeSearchService.viewProductTypeWise(Apidata).subscribe((res:any)=>{
      if(res.status == 200) this.SearchedProductList = res.data
      if(res.status == 500) this._SharedService.errorToast(res.message)
    })
  }

  RecommandValue(event:any){
    this.SelectRecommandation=event
    this.getProductTypewise()
  }

  BackClick(){
    this._Router.navigate(['/home'])
  }

  SelectedProductClick(item:any){
    this._Router.navigate(['/product-detail',btoa(item._id)]);
  }

  ngOnDestroy(){
    localStorage.removeItem("ProductTypewiseData")
  }


}
