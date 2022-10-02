import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Select2OptionData } from 'ng-select2';
import { FormControl, FormGroup, Validators,FormArray } from '@angular/forms';
import { AddproductService } from '../addproduct/addproduct.service';
import { AuthenticationService } from 'src/app/main/auth/service';
import { ImagesuploadService } from '../imagesupload/imagesupload.service';
import { VideouploadService } from '../videoupload/videoupload.service';
import { SharedService } from '../../shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {NgxImageCompressService, UploadResponse} from 'ngx-image-compress';
import { MatChipInputEvent } from '@angular/material/chips/chip-input';
import * as Plyr from 'plyr';
import { Router } from '@angular/router';
import { StyleRenderer, lyl, WithStyles } from '@alyle/ui';
import { ImgCropperConfig, ImgCropperEvent, LyImageCropper, ImgCropperErrorEvent, ImgCropperLoaderConfig } from '@alyle/ui/image-cropper';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { I } from '@angular/cdk/keycodes';
import { getParamByISO } from 'iso-country-currency';
import { Subscription } from 'rxjs';

declare var $:any;

const STYLES = () => ({
  cropper: lyl `{
    width: 375px
    height: 500px
  }`,
  sliderContainer: lyl `{
    text-align: center
    width: 375px
    margin: 14px
  }`
});

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css'],
  providers: [
    StyleRenderer
  ]
})

export class AddproductComponent implements OnInit,OnDestroy {
  quantitysoldfrom=11;
  quantitysoldto= 0;
  payperunit:number| undefined;
  public exampleData:any = Array<Select2OptionData>();
  public productcode:any = Array<Select2OptionData>();
  public warrantyperdayddata:any = Array<Select2OptionData>();
  public returnitemday:any = Array<Select2OptionData>();
  public promotemarket:any = Array<Select2OptionData>();
  public agerestriction:any = Array<Select2OptionData>();
  public targetfor:any = Array<Select2OptionData>();
  public countryoforigin:any = Array<Select2OptionData>();
  exampleDatabrand:any = Array<Select2OptionData>();
  formdataproduct:any = new FormData();
  userserachbarreference = false;
  tagprod = false;
  userfind = false;
  productfind = false;
  nonreturnableallow = false;
  NonReturnable:any;
  public player:any;
  brandname:any;
  productnobrand:any = false;
  isProductBrandSelected:boolean = false;
  selectcatogorymenu:any;
  selectcatogorymenusub:any;
  selectcatogorytype:any;
  SubCategorynotfound:any;
  producttypenotfound:any;
  productTypevalue:any;
  addcolor:any;
  colorarrraylist:any;
  colors:any = [];
  ShowSelectedColorname:any
  productsize:any;
  addsizelist:any;
  activeindex:any = 0;
  sizeactiveindex:any = 0;
  activeindexmore:any = 0;
  highlightsarray:any = FormArray;
  searchkeyworditem:any = FormArray;
  items:any = FormArray;
  addmorespecificarray:any = FormArray;
  variationarraylist:any = FormArray;
  multiplefile:any = [];
  multiplefilemore:any = [];
  format:any;
  url:any;
  onSelectimages:any;
  quantityunitarray:any = FormArray;
  influencerscondition:boolean;
  subcategory:any;
  menusubcategory:any;
  productnobrandvalue:any;
  SellerWiseProductList:any=[];

  // images-upload
  previewmain:any;
  previewmainvideo:any;
  usersearch:any;
  usersearchdata:any = [];
  addphotos:any = [];
  usersearchmore:any;
  usersearchdatamore:any = [];
  Addmorephotos:any = [];
  hashtag:string[] = [];
  videouploadformate:any = [];
  addphotoscover:any = [];
  usersearchdatavideo:any = [];
  usersearchvideo:any;
  getUsersboolean:boolean = false;
  getProductboolean:boolean = false;
  sizevariationheadershow:boolean = false;
  selectedListingProduct:any;
  IsAvailProductId:boolean = true;
  sizeavail:any
  LinkProducts:any=[];
  selected:any = [];
  isDisabled = false;
  imgResultBeforeCompression:any
  imgResultAfterCompression:any
  imgResultMultiple:any=[];
  pushimage:any=[];
  Extrapushimage:any=[];
  title = "CodeSandbox";
  tags = [];
  productsearch:any;
  productsearchdata:any=[];
  productsearchmore:any;
  productsearchdatamore:any=[];
  productsearchvideo:any;
  productsearchdatavideo:any=[];

  // images upload data
  classes = this.sRenderer.renderSheet(STYLES);
  croppedImage?: string;
  scale: any;
  ready: boolean;
  minScale: number;
  step: string;
  @ViewChild(LyImageCropper) cropper: LyImageCropper;
  myConfig: ImgCropperConfig = {
    // autoCrop: true,
    width: 375, // Default `250`
    height: 500, // Default `200`
    fill: '#ff2997', // Default transparent if type == png else #000
    type: 'image/png', // Or you can also use `image/jpeg`
    responsiveArea: true
  };
  originalDataURLStore:any;
  originalDataURLStoremore:any;
  cropimagereturn:any = false;
  multipleimgcheck:boolean = true;
  multipleimgremovecheck:boolean = true;
  productremoveindex:number;
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');
  influencerPrice: any = [
    {
      quantitysoldfrom: 1,
      quantitysoldto: 10,
      payperunit: undefined
    }
  ];
  isFormSubmited: boolean = false;

  GetEditListUnsub$: Subscription;
  subscriptions: Subscription[] = []

  constructor(
    private _AddproductService:AddproductService,
    private _AuthenticationService:AuthenticationService, 
    private _ImagesuploadService:ImagesuploadService, 
    private _SharedService:SharedService, 
    private _VideouploadService:VideouploadService,
    private spinner:NgxSpinnerService,
    private router:Router,
    private imageCompress: NgxImageCompressService,
    private cdr: ChangeDetectorRef,readonly sRenderer: StyleRenderer,
    private sanitizer:DomSanitizer
  ) { }

  ngOnInit(): void {
   
    this.GetColorList()
    this.productcode = [
      {
        id: 'GTIN',
        text: 'GTIN'
      },
      {
        id: 'EAN',
        text: 'EAN'
      },
      {
        id: 'GCID',
        text: 'GCID'
      },
      {
        id: 'UPC',
        text: 'UPC'
      },
      {
        id: 'ASIN',
        text: 'ASIN'
      }
    ];
    this.warrantyperdayddata = [
      {
        id: 'Days',
        text: 'Days'
      },
      {
        id: 'Weeks',
        text: 'Weeks'
      },
      {
        id: 'Months',
        text: 'Months'
      },
      {
        id: 'Years',
        text: 'Years'
      },
    ];
    this.returnitemday = [
      {
        id: 'Days',
        text: 'Days'
      }
    ];    
    this.promotemarket = [
      {
        id: true,
        text: 'Allow'
      },
      {
        id: false,
        text: 'Disallow'
      },
    ];
    this.agerestriction = [
      {
        id: true,
        text: 'Show to all age'
      },
      {
        id: false,
        text: 'Show to +18 age only'
      },
    ];
    this.targetfor = [
      {
        id: 'All',
        text: 'All'
      },
      {
        id: 'Men',
        text: 'Men'
      },
      {
        id: 'Women',
        text: 'Women'
      },
      {
        id: 'Teenage Boys',
        text: 'Teenage Boys'
      },
      {
        id: 'Teenage Girls',
        text: 'Teenage Girls'
      },
      {
        id: 'Baby & Kids',
        text: 'Baby & Kids'
      },
    ];
    this.countryoforigin = [
      {
        id: 'Usa',
        text: 'Usa'
      },
      {
        id: 'India',
        text: 'India'
      },
      {
        id: 'Canada',
        text: 'Canada'
      },
    ];
    const controls = [
      'play-large', // The large play button in the center
      'mute', // Toggle mute
      'fullscreen',
    ];
    this.player = new Plyr('#plyrvideo', { captions: { active: true},controls });
    this._AddproductService.getBrandDetailsBySeller().subscribe(res=>{
      const response:any = res;
      response.data.map((data:any)=>{
        const example = {
          id: data._id,
          text: data.brandName,
          sellerid:data.sellerId,
          countrycode:data.countryCode
        }
        this.exampleDatabrand.push(example);
      });
      },(err)=>{
    });
    setTimeout(() => {
      this.exampleData = this.exampleDatabrand;
    }, 2000);
    let currentUser = this._AuthenticationService.currentUserValue.countryCode;
    this._AddproductService.findMenuCategory(currentUser).subscribe((res:any)=>{
       this.selectcatogorymenu = res.data;
    });
    this.productsize = [
      {
        formalname:'Medium',
        Symbolsize:'M',
      },
      {
        formalname:'Small',
        Symbolsize:'S',
      },
      {
        formalname:'Large',
        Symbolsize:'L',
      },
      {
        formalname:'32 Gigabytes',
        Symbolsize:'32GB',
      },      
      {
        formalname:'Extra Large',
        Symbolsize:'XL',
      },
      {
        formalname:'Extra Small',
        Symbolsize:'XS',
      },
      {
        formalname:'Extra Extra Large',
        Symbolsize:'XXL',
      }
    ]
    this.ProductSellerWise()
    this.productpatchvalue()
    this.UnsubscribeMethod();
  }

  ngOnDestroy(): void{
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  UnsubscribeMethod(){
    this.subscriptions.push(this.GetEditListUnsub$);
  }

  ProductSellerWise(){
    this._AddproductService.productsellerwise().subscribe((res:any)=>{
      if(res.status == 200){
        this.SellerWiseProductList = res.data
        this.SellerWiseProductList.forEach((ele:any)=>{
          return ele['checkedbool'] = false
        })
      }
    })
  }

  get f1(){
    return this.infoAttributes;
  }
  get f2(){
    return this.addNewSize;
  }
  get f3(){
    return this.pricingshipping;
  }
  
  infoAttributes:any = new FormGroup({
    productname: new FormControl("",[Validators.required]),
    productid: new FormControl("",[Validators.required]),
    productcode: new FormControl("",[Validators.required]),
    writeproductscode: new FormControl("",[Validators.required]),
    warrantyperiod: new FormControl("",[Validators.required,Validators.pattern('^[0-9]*$')]),
    warrantydays: new FormControl("",[Validators.required]),
    returnitemperiod: new FormControl("",[Validators.required,Validators.pattern('^[0-9]*$'),Validators.min(0),Validators.max(10)]),
    returnitemdays: new FormControl("",[Validators.required]),
    searchkeywords: new FormArray([this.searchkeywordsItem()]),
    highlights: new FormArray([this.highlightsItem()]),
    addmorespecific: new FormArray([this.addmoreItem()]),
    description: new FormControl(""),
    nonreturnableitems: new FormControl(false),
    variations: new FormArray([]),
  });

  addNewSize:any = new FormGroup({
    newsizeformal: new FormControl("",[Validators.required]),
    newsizesymbol: new FormControl("",[Validators.required]),
  });

  pricingshipping:any = new FormGroup({
    salestax: new FormControl("",[Validators.pattern('^[0-9]*$'),Validators.required]),
    maximumorderquantity: new FormControl("",[Validators.pattern('^[0-9]*$'),Validators.required]),
    minimumorderquantity: new FormControl("",[Validators.pattern('^[0-9]*$'),Validators.required]),
    hsncode: new FormControl("",[Validators.pattern('^[0-9]*$'),Validators.required]),
    agerestriction: new FormControl("",[Validators.required]),
    targetfor: new FormControl("",[Validators.required]),
    countryoforigin: new FormControl("",[Validators.required]),
    domesticshippingcharges: new FormControl("",[Validators.pattern('^[0-9]*$')]),
    influencerspromotemarket: new FormControl("",[Validators.required]),
    // influencerspromote: new FormArray([this.quantityunit()]),
  });

 // -------------------------------product patch value start-----------------------------------------------------------

  productpatchvalue(){
    this.GetEditListUnsub$ = this._SharedService.GetEditList.subscribe((res:any)=>{
      if(res){
        this.selectedListingProduct = res
        this.infoAttributes.patchValue({
          productname:this.selectedListingProduct?.productName,
          productid: this.selectedListingProduct?.productId,
          productcode: this.selectedListingProduct?.productCode,
          writeproductscode:this.selectedListingProduct?.writeproductscode,
          warrantyperiod:this.selectedListingProduct?.warrantyperiod,
          warrantydays: this.selectedListingProduct?.warrantydays,
          returnitemperiod:this.selectedListingProduct?.returnitemperiod,
          returnitemdays:this.selectedListingProduct?.returnitemdays,
          // searchkeywords: this.selectedListingProduct.productName,
          // highlights:this.selectedListingProduct.productName,
          // addmorespecific: this.selectedListingProduct.productName,
          description: this.selectedListingProduct?.description,
        })
        this.colorarrraylist=this.selectedListingProduct?.color_details._id
        this.ShowSelectedColorname=this.selectedListingProduct?.color_details.colorName
        this.Variationpatch();
        this.Searchpatch();
        this.highlightsPatch();
        this.addmorespecificationpatch();
        this.pricingshipping.patchValue({
          salestax:this.selectedListingProduct?.salesTax,
          maximumorderquantity: this.selectedListingProduct?.maximumorderquantity,
          minimumorderquantity: this.selectedListingProduct?.minimumorderquantity,
          hsncode:this.selectedListingProduct?.hsnCode,
          agerestriction:this.selectedListingProduct?.isAgeRestricted,
          targetfor: this.selectedListingProduct?.targetFor,
          countryoforigin:this.selectedListingProduct?.countryOfOrigin,
          domesticshippingcharges:this.selectedListingProduct?.domesticShippingCharges,
          influencerspromotemarket: this.selectedListingProduct?.isPromotable ? 'true' : "false",
        // influencerspromote: this.selectedListingProduct.description,
        })
        if(this.selectedListingProduct?.isPromotable == true){
          const abc = this.selectedListingProduct?.influencerspromoters;
          const lastObj = abc.pop();
          this.influencerPrice = abc
          this.quantitysoldfrom = lastObj.quantitysoldfrom
          this.payperunit = lastObj.payperunit
        }
        // this.influencerspromotepatch()
      }
    })
  }

  Variationpatch() {
    const control = <FormArray>this.infoAttributes.get('variations');
    this.selectedListingProduct?.variations.forEach((x:any) => {
        control.push(this.VariationPatchValues(x.MRP, x.discount,x.sellerSku,x.sellingPrice,x.stockQuantity,x.variationTitle))
    })
  }

  VariationPatchValues(MRP:any, discount:any,sellerSku:any,sellingPrice:any,stockQuantity:any,variationTitle:any) {
    return new FormGroup ({
      variationTitle: new FormControl(variationTitle,Validators.required),
      sellerSku: new FormControl(sellerSku,[Validators.required]),
      stockQuantity: new FormControl(stockQuantity,[Validators.pattern('^[0-9]*$'),Validators.required]),
      MRP: new FormControl(MRP,[Validators.pattern('^[0-9]*$'),Validators.required]),
      sellingPrice: new FormControl(sellingPrice,[Validators.pattern('^[0-9]*$'),Validators.required]),
      discount: new FormControl(discount),
    });
  }

  Searchpatch() {
    const data = <FormArray>this.infoAttributes.get('searchkeywords');
    this.selectedListingProduct?.searchkeywords.forEach((x:any, i:any) => {
        if(i === 0){
          data.controls[i].patchValue({"searchkeyword":x.searchkeyword});
        }else{
          data.push(this.SearchPatchValues(x.searchkeyword))
        }
    })
  }

  SearchPatchValues(searchkeyword:any) {
    return new FormGroup({
      searchkeyword: new FormControl(searchkeyword,Validators.required),
    });
  }

  highlightsPatch(){
    const data = <FormArray>this.infoAttributes.get('highlights');
    this.selectedListingProduct?.highlights.forEach((x:any, i:any) => {
      if(i === 0){
        data.controls[i].patchValue({"highlightsarray":x.highlightsarray});
      }else{
        data.push(this.highlightsPatchValues(x.highlightsarray))
      }
  })
  }

  highlightsPatchValues(highlightsarray:any){
    return new FormGroup({
      highlightsarray: new FormControl(highlightsarray,Validators.required),
    });
  }

  // influencerspromotepatch() {
  //   const control = <FormArray>this.pricingshipping.get('influencerspromote');
  //   this.selectedListingProduct?.influencerspromoters.forEach((x:any,i:any) => {
  //     if(i === 0){
  //       control.controls[i].patchValue({
  //         "quantitysoldto":x.quantitysoldto,
  //         "quantitysoldfrom":x.quantitysoldfrom,
  //         "payperunit":x.payperunit
  //       });
  //     }else{
  //       control.push(this.influencerspromotePatchValues(x.quantitysoldto, x.quantitysoldfrom,x.payperunit))
  //     }
  //   })
  // }

  influencerspromotePatchValues(quantitysoldto:any, quantitysoldfrom:any,payperunit:any) {
    return new FormGroup({
      quantitysoldfrom: new FormControl(quantitysoldfrom,Validators.required),
      quantitysoldto: new FormControl(quantitysoldto,Validators.required),
      payperunit: new FormControl(payperunit,Validators.required),
    });
  }

  onAdd() {
    this.isFormSubmited = false;
    const lastElement = this.influencerPrice.at(-1);
    // console.log(lastElement);
    // console.log(this.influencerPrice);
    // console.log(typeof lastElement.payperunit);
    if(lastElement.payperunit != undefined && lastElement.payperunit != 0) {
      const obj = {
        quantitysoldfrom: Number(lastElement.quantitysoldto) + 1,
        quantitysoldto: Number(lastElement.quantitysoldto) + 10,
        payperunit: undefined
      }
      this.influencerPrice.push(obj);
    }else{
      this.isFormSubmited = true;
    }
    this.unitChange(this.influencerPrice.length -1);
  }

  unitChange(index: any) {
    if(this.influencerPrice.length -1 === index) {
      this.quantitysoldfrom = Number((this.influencerPrice[index]).quantitysoldto) + 1;  
    } else {
      (this.influencerPrice[index + 1]).quantitysoldfrom = Number((this.influencerPrice[index]).quantitysoldto) + 1 ;  
    }
  }

  onRemove() {
    this.isFormSubmited = false;
    this.influencerPrice.pop();
    this.unitChange(this.influencerPrice.length -1);
  }

  addmorespecificationpatch(){
    const control = this.infoAttributes.get('addmorespecific') as FormArray;
    this.selectedListingProduct?.specifications.forEach((x:any,i:any) => {
      if(i === 0){
        control.controls[i].patchValue({
          "specifictitle":x.specifictitle,
        });
        x.generalspecific.forEach((generax:any,index:any) => {
          if(index === 0){
          this.infoAttributes.controls.addmorespecific.controls[i].controls.generalspecific.controls[index].patchValue({
            "corresponding":generax.corresponding,
            "specific":generax.specific
          });
          }else{
          this.infoAttributes.controls.addmorespecific.controls[i].controls.generalspecific.push(this.createPatchValues(generax.specific,generax.corresponding));
          }
        });
      }else{
        control.push(this.addmorePatchValues(x.specifictitle))
        x.generalspecific.forEach((generax:any,index:any) => {
          this.infoAttributes.controls.addmorespecific.controls[i].controls.generalspecific.push(this.createPatchValues(generax.specific,generax.corresponding));
        });
      }
    });
  }
  
  addmorePatchValues(specifictitle:any){
    return new FormGroup ({
      specifictitle: new FormControl(specifictitle,Validators.required),
      generalspecific: new FormArray([]),
    });
  }

  createPatchValues(specific:any,corresponding:any){
    return new FormGroup ({
      specific: new FormControl(specific,Validators.required),
      corresponding: new FormControl(corresponding,Validators.required),
    });
  }
  
  // -------------------------------product patch value End-----------------------------------------------------------

  CheckProductId(event:any){
    const data = {
      "productId": event
    }
    this._AddproductService.checkproductid(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.IsAvailProductId=res.data
      }
    })
  }

  // selectedProduct(item:any){
  //   const id = item._id;
  //   const index = this.LinkProducts.findIndex((ele:any) => ele._id === id);
  //   if (index === -1) {
  //     this.LinkProducts = [...this.LinkProducts, {productId:item._id}];
  //   } else {
  //     this.LinkProducts = this.LinkProducts.filter((user:any) => user._id !== item._id);
  //   }
  // }
  OpenLinkProductPopup(){
    $('.modal#linkproduct-with-color').modal({
      backdrop: 'static',
      keyboard: false
    })
  }

    // check if the item are selected
    checkedProduct(item:any) {
      if (this.selected.indexOf(item) != -1) {
        return true;
      }
  
      if (this.selected.length == 4) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
    }
  
    // when checkbox change, add/remove the item from the array
    onChange(checked:any, item:any) {
      if (checked.target.checked) {
        item.checkedbool = true;
        this.selected.push(item);
      } else {
        item.checkedbool = false;
        this.selected.splice(this.selected.indexOf(item), 1);
      }
    }

  SelectWithLinkProduct(){
    this.selected.forEach((element:any) => {
      this.LinkProducts.push({productId:element._id})
    });
     $("#linkproduct-with-color").modal("hide");
  }

  LinkProductCancel(){
    $("#linkproduct-with-color").modal("hide");
    this.selected = []
    this.LinkProducts =[]
  }
  
    // displayTags(updateTags:any) {
  //   this.photohashtags = updateTags
  // }
  productnext1(){
    $('.addprod-category .nav-item > .nav-link.active').parent(".addprod-category li.nav-item").next('li.nav-item').find('a.nav-link').trigger('click');
  }

  productnext2(){
    $('.addprod-category .nav-item > .nav-link.active').parent(".addprod-category li.nav-item").next('li.nav-item').find('a.nav-link').trigger('click');
  }

  productnext3(){
    $('.addprod-category .nav-item > .nav-link.active').parent(".addprod-category li.nav-item").next('li.nav-item').find('a.nav-link').trigger('click');
  }

  productnext4(){
    $('.addprod-category .nav-item > .nav-link.active').parent(".addprod-category li.nav-item").next('li.nav-item').find('a.nav-link').trigger('click');
  }

  productnext5(){
    this.isFormSubmited = true;   
    if(this.subcategory != undefined && this.menusubcategory != undefined && this.productTypevalue != undefined && this.isProductBrandSelected 
      || this.productnobrandvalue != undefined && this.infoAttributes.valid  && this.infoAttributes.value.variations.length !=0 &&
        this.pricingshipping.valid){
          this.formdatareset();
          this.sizeavail = true
          if(this.IsAvailProductId == false && this.addphotos.length >= 1){
            // First-Tab
            this.formdataproduct.append('menuCategoryId',this.subcategory);
            this.formdataproduct.append('menuSubCategoryId',this.menusubcategory);
            this.formdataproduct.append('productTypeId',this.productTypevalue);
            
            // Second-Tab
            this.formdataproduct.append('productName',this.infoAttributes.value.productname);
            this.formdataproduct.append('productId',this.infoAttributes.value.productid);
            this.formdataproduct.append('productCode',this.infoAttributes.value.productcode);
            this.formdataproduct.append('writeproductscode',this.infoAttributes.value.writeproductscode);
            this.formdataproduct.append('colors',this.colorarrraylist);
            this.formdataproduct.append('linkProducts',JSON.stringify(this.LinkProducts));
            this.formdataproduct.append('variations',JSON.stringify(this.infoAttributes.value.variations));
            this.formdataproduct.append('warrantyperiod',this.infoAttributes.value.warrantyperiod);
            this.formdataproduct.append('warrantydays',this.infoAttributes.value.warrantydays);
            this.formdataproduct.append('returnitemperiod',this.infoAttributes.value.returnitemperiod);
            this.formdataproduct.append('returnitemdays',this.infoAttributes.value.returnitemdays);
            this.formdataproduct.append('highlights',JSON.stringify(this.infoAttributes.value.highlights));
            this.formdataproduct.append('specifications',JSON.stringify(this.infoAttributes.value.addmorespecific));
            this.formdataproduct.append('description',this.infoAttributes.value.description);
            this.formdataproduct.append('searchkeywords',JSON.stringify(this.infoAttributes.value.searchkeywords));
        
            // Third-Tab
            this.formdataproduct.append('hashtags',JSON.stringify(this.hashtag));
            const addphototagg:any = []
            this.addphotos.map((data:any,i:any)=>{
              const datas = {
                  no:i,
                  taggedProducts:data.taggedProducts.map((item:any)=>{return {productId:item.productId,x:item.x,y:item.y}}),
                  taggedUsers:data.taggedUsers.map((item:any)=>{ return {userId: item.userId,x:item.x,y:item.y}})
                }
                addphototagg.push(datas);
            });
            const datas = []
            for(let item of addphototagg){
              const data = JSON.stringify(item);
              datas.push(data);
            }
            console.log('productPhotosTags-----',JSON.stringify(datas));
            this.formdataproduct.append('productPhotosTags',JSON.stringify(datas));
            for(let item of this.multiplefile){
              console.log('productPhotos----',item);
              this.formdataproduct.append('productPhotos',item);
            }
            
            // addphotomore - section
            const addphototaggextra:any = []
            this.Addmorephotos.map((data:any,i:any)=>{
              const datas = {
                  no:i,
                  taggedProducts:data.taggedProducts.map((item:any)=>{return {productId:item.productId,x:item.x,y:item.y}}),
                  taggedUsers:data.taggedUsers.map((item:any)=>{ return {userId: item.userId,x:item.x,y:item.y}})
                }
                addphototaggextra.push(datas);
            });
            const datasextraphoto = []
            for(let item of addphototaggextra){
              const data = JSON.stringify(item);
              datasextraphoto.push(data);
            }
            this.formdataproduct.append('extraPhotosTags',JSON.stringify(datasextraphoto));
            for(let item of this.multiplefilemore){
              this.formdataproduct.append('extraPhotos',item);
            }
        
            // For-Tab
            const addvideotagg:any = []
            this.videouploadformate.map((data:any,i:any)=>{
            const datas = {
                no:i,
                taggedProducts:data.taggedProducts.map((item:any)=>{return {productId:item.productId,x:item.x,y:item.y}}),
                taggedUsers:data.taggedUsers.map((item:any)=>{ return {userId: item.userId,x:item.x,y:item.y}})
                }
                addvideotagg.push(datas);
            });
            const datasvideo = []
            for(let item of addvideotagg){
            const data = JSON.stringify(item);
            datasvideo.push(data);
            }
            this.formdataproduct.append('productVideosTags',JSON.stringify(datasvideo));
            this.formdataproduct.append('productVideos',this.videouploadformate[0]?.file);
            this.formdataproduct.append('coverImg',this.onSelectimages);
            
            // Five-Tab
            if(this.pricingshipping.value.influencerspromotemarket == 'true'){
                const tempData = [...this.influencerPrice];
          
                let isError = false;
                tempData.forEach((item) => {
                  if(!item.payperunit || item.payperunit <= 0 || Number(item.quantitysoldto) < Number(item.quantitysoldfrom)) {
                    isError = true;
                  } else {
                    item.quantitysoldfrom = Number(item.quantitysoldfrom);
                    item.quantitysoldto = Number(item.quantitysoldto);
                    item.payperunit = Number(item.payperunit);
                  }
                });
            
                if (!this.payperunit && Number(this.payperunit) <= 0) {
                  isError = true;
                } else {
                  tempData.push({
                    quantitysoldfrom: Number(this.quantitysoldfrom),
                    quantitysoldto: 0,
                    payperunit: Number(this.payperunit)
                  });
                }
          
                if(!isError) {
                  this.formdataproduct.append('influencerspromoters',JSON.stringify(tempData));
                } else {
                  return
                }
              }
              this.formdataproduct.append('salesTax',this.pricingshipping.value.salestax);
              this.formdataproduct.append('maximumorderquantity',this.pricingshipping.value.maximumorderquantity);
              this.formdataproduct.append('minimumorderquantity',this.pricingshipping.value.minimumorderquantity);
              this.formdataproduct.append('hsnCode',this.pricingshipping.value.hsncode);
              this.formdataproduct.append('isPromotable',this.pricingshipping.value.influencerspromotemarket);
              this.formdataproduct.append('isAgeRestricted',this.pricingshipping.value.agerestriction);
              this.formdataproduct.append('targetFor',this.pricingshipping.value.targetfor);
              this.formdataproduct.append('countryOfOrigin',this.pricingshipping.value.countryoforigin);
              this.formdataproduct.append('domesticShippingCharges',this.pricingshipping.value.domesticshippingcharges !== undefined ? this.pricingshipping.value.domesticshippingcharges:0);

              // Final-Form-Submited...
              this.finalsubmit();
          }else{
            if(this.IsAvailProductId){
              this._SharedService.errorToast("PoductId Not Valid");
            }else{
              this._SharedService.errorToast("addphotos required");
            }
          } 
    }else {
      // First-Tab
      if(this.subcategory == undefined){
        $(".category").css("border"," 0.1px solid red")
      }
      if(this.menusubcategory == undefined){
        $(".subcategory").css("border"," 0.1px solid red")
      }
      if(this.productTypevalue == undefined){
        $(".producttype").css("border"," 0.1px solid red")
      }
      if(this.productnobrandvalue == undefined){
        $(".brandnameval .select2-container .select2-selection--single").css("border"," 0.1px solid red")
      }

      console.log(this.productnobrandvalue,"this.productnobrandvalue - value", !this.isProductBrandSelected,"isProductBrandSelected - value");
      if(this.productnobrandvalue == undefined && !this.isProductBrandSelected){
        $(".brandnameval .select2-container .select2-selection--single").css("border"," 0.1px solid red")
      }
    
      // Second-Tab
      this.sizeavail = false
      this.infoAttributes.markAllAsTouched();
    
      // Five-Tab
      this.pricingshipping.markAllAsTouched();

      this._SharedService.errorToast("Something is pending, please check all tabs and resubmit again.");
    }
  }

  productback(){
    $('.addprod-category .nav-item > .nav-link.active').parent(".addprod-category li.nav-item").prev('li.nav-item').find('a.nav-link').trigger('click');
  }
  
  userreference(){
    this.userserachbarreference = true;
    this.tagprod = false;
  }
  tagprodreference(){
    this.tagprod = true;
    this.userserachbarreference = false;
  }
  // userfindvideo(){
  //   this.userfind = true;
  //   this.productfind = false;
  // }
  // productfindvideo(){
  //   this.userfind = false;
  //   this.productfind = true;
  // }
  usersearchclose(){
    this.userserachbarreference = false;
    this.tagprod = false;
    // this.userfind = false;
    // this.productfind = false;
  }

  productsearchclose(){
    this.userserachbarreference = false;
    this.tagprod = false;
    // this.userfind = false;
    // this.productfind = false;
  }
  changeVideo(vId:any){
    $("#myModal").on("hidden.bs.modal",()=>{
      $("#iframeYoutube").attr("src","#");
    });

    let iframe:any = document.getElementById("iframeYoutube");
    iframe.src="https://www.youtube.com/embed/"+vId;
    $("#myModal").modal("show");
  }

  productbrand(event:any){
    this.isProductBrandSelected=event.target.checked
  }

  menucategory(data:any){
    this.subcategory = data._id; 
    const subcategory = {
      "menuCategoryId": data._id
    }
    this.selectcatogorytype = [];
    this.menusubcategory = undefined
    this.productTypevalue = undefined
    $(".product_category_height").css("border"," 0.1px solid #9F9F9F")
    this._AddproductService.findMenuSubCategory(subcategory).subscribe(res=>{
      const response:any = res;
      this.selectcatogorymenusub = response.data;
      this.SubCategorynotfound = this.selectcatogorymenusub.length > 0;
    },(err)=>{
      console.log(err);
    });
  }

  menucategorysub(data:any){
    this.menusubcategory = data._id; 
    $(".subcategory").css("border"," 0.1px solid #9F9F9F")
    this.productTypevalue = undefined
    const producttype = {
      "menuSubCategoryId":data._id
    }
    this._AddproductService.findfindproductType(producttype).subscribe(res=>{
      const productype:any = res;
      this.selectcatogorytype = productype.data;
      this.producttypenotfound = this.selectcatogorytype.length > 0;
    },(err)=>{
      console.log(err);
    });
  }
  productitemdata(userid:any){
    this.productTypevalue = userid._id;
    $(".producttype").css("border"," 0.1px solid #9F9F9F")
  }


  GetColorList(){
    this._AddproductService.getColorList().subscribe((res:any)=>{
      if(res.status == 200) this.colors = res.data
      if(res.status == 500) this._SharedService.errorToast(res.message)
    })
  }

  colorarray(data:any){
    this.addcolor = data;
  }

  selectcolor(){
    this.colorarrraylist = this.addcolor._id;
    this.ShowSelectedColorname = this.addcolor.colorName
    $('.modal#colorSelect').modal('hide');
  }

  addcolorclick(){
    $('.modal#colorSelect').modal({
      backdrop: 'static',
      keyboard: false
    });
  }
  
  removecolor(){
    this.colorarrraylist = undefined;
    this.ShowSelectedColorname = undefined;
  }

  Addnewsize(data:any){
    if(this.addNewSize.valid){
      $("#addsize-addprod").modal("hide");
      const newsizevalue = {
        formalname:data.value.newsizeformal,
        Symbolsize:data.value.newsizesymbol,
      }
      this.productsize.push(newsizevalue);
      this.addNewSize.reset();
    }else{
      this.addNewSize.markAllAsTouched();
    }
  }

  sizenamevalue(data:any, i:any){
    this.addsizelist = data.Symbolsize;
    this.sizeactiveindex = i;  
  }

  addmorevarition(){
    return new FormGroup ({
      variationTitle: new FormControl(this.addsizelist,Validators.required),
      sellerSku: new FormControl('',[Validators.required]),
      stockQuantity: new FormControl('',[Validators.pattern('^[0-9]*$'),Validators.required]),
      MRP: new FormControl('',[Validators.pattern('^[0-9]*$'),Validators.required]),
      sellingPrice: new FormControl('',[Validators.pattern('^[0-9]*$'),Validators.required]),
      discount: new FormControl(''),
    });
  }

  detectValueChange(index: any){
    let controls = (this.infoAttributes.get('variations') as FormArray)['controls'];
     this.changeTotal(controls[index])
  }

  changeTotal(control:any){
    let MRP = parseFloat(control.value.MRP);
    let SellingPrice = parseFloat(control.value.sellingPrice);
    if (!isNaN(MRP) && !isNaN(SellingPrice)) {
        let difference = (MRP - SellingPrice);
        let Discount = ((difference*100)/MRP).toFixed(2)
        // control['controls']['discount'].setValue(`${Discount} %`, { emitEvent: false })
        control['controls']['discount'].setValue(Discount, { emitEvent: false })
    }
  }

  addsizevaration(){
    if(this.infoAttributes.controls.variations.status != "INVALID"){
      this.sizeavail = true
      $('#addsize-prod').modal({
        backdrop: 'static',
        keyboard: false
      });
    }else{
      this.infoAttributes.get('variations').markAllAsTouched();
    }
  }

  addsizedata(){
    if(this.infoAttributes.controls.variations.status != "INVALID"){
      this.variationarraylist = this.infoAttributes.get('variations') as FormArray;
      this.sizevariationheadershow =true
      this.variationarraylist.push(this.addmorevarition());
      $("#addsize-prod").modal("hide");
    }else{
      this.infoAttributes.get('variations').markAllAsTouched();
    }
  }

  removevarition(){
    const removelastvaration = this.infoAttributes.get('variations') as FormArray;
    removelastvaration.removeAt(-1);
  }

  highlightsItem(){
    return new FormGroup({
      highlightsarray: new FormControl('',Validators.required),
    });
  }

  highlightsadd(){
    if(this.infoAttributes.controls.highlights.status != "INVALID"){
      this.highlightsarray = this.infoAttributes.get('highlights') as FormArray;
      this.highlightsarray.push(this.highlightsItem());
    }else{
      this.infoAttributes.get('highlights').markAllAsTouched();
    }
  }

  highlightsremove(){
    const removedata = this.infoAttributes.get('highlights') as FormArray;
    removedata.removeAt(-1);
  }

  searchkeywordsItem(){
    return new FormGroup({
      searchkeyword: new FormControl('',Validators.required),
    });
  }

  searchkeywordsadd(){
    if(this.infoAttributes.controls.searchkeywords.status != "INVALID"){
      this.searchkeyworditem = this.infoAttributes.get('searchkeywords') as FormArray;
      this.searchkeyworditem.push(this.searchkeywordsItem());
    }else{
      this.infoAttributes.get('searchkeywords').markAllAsTouched();
    }
  }

  searchkeywordsremove(){
    const removedata = this.infoAttributes.get('searchkeywords') as FormArray;
    removedata.removeAt(-1);
  }

  createItem(){
    return new FormGroup ({
      specific: new FormControl('',Validators.required),
      corresponding: new FormControl('',Validators.required),
    });
  }

  generalspecificadd(control:any,index:any){
      if(this.infoAttributes.controls.addmorespecific.controls[index].controls.generalspecific.status != "INVALID"){
        control.push(this.createItem());
      }else{
        control.markAllAsTouched();
      }
  }
  
  generalspecificremove(control:any){
    control.removeAt(-1);      
  }

  addmoreItem(){
    return new FormGroup ({
      specifictitle: new FormControl('',Validators.required),
      generalspecific: new FormArray([this.createItem()]),
    });
  }

  addmorespecification(){
    if(this.infoAttributes.controls.addmorespecific.status != "INVALID"){
      this.addmorespecificarray = this.infoAttributes.get('addmorespecific') as FormArray;
      this.addmorespecificarray.push(this.addmoreItem());
    }else{
      this.infoAttributes.get('addmorespecific').markAllAsTouched();
    }
  }

  removemorespecification(){
    const removedata = this.infoAttributes.get('addmorespecific') as FormArray;
    removedata.removeAt(-1);
  }

  // images-upload

  //  tag userdata in image start
  getUsers(){
    if(this.usersearch.trim() != ''){
      this.usersearchdata = [];
      const data = {
        pattern:this.usersearch.trim()
      };
      this._ImagesuploadService.getUsersList(data).subscribe((res:any)=>{
        const a = this.addphotos[this.activeindex].taggedUsers.map((item:any)=>{
            return item.userId;
        });
        res.data.map((item:any)=>{
            if(a.includes(item._id)){
            } else {
              this.usersearchdata.push(item);
            }
        });
      });
    };
  };

  getUsersmore(){
    if(this.usersearchmore.trim() != ''){
      this.usersearchdatamore = [];
      const data = {
        pattern:this.usersearchmore.trim()
      };
      this._ImagesuploadService.getUsersList(data).subscribe(res=>{
        const response:any = res;
        const a = this.Addmorephotos[this.activeindexmore].taggedUsers.map((item:any)=>{
            return item.userId;
        });
        response.data.map((item:any)=>{
            if(a.includes(item._id)){
            } else {
              this.usersearchdatamore.push(item);
            }
        });
      });
    };
  }

  
  taguserdata(data:any){
    const datas = {
        "userId":data._id,
        "username":data.username,
        "fullName":data.fullName,
        "x":0,
        "y":0
    };
    const index = this.activeindex
    this.addphotos[index].taggedUsers.push(datas);
    this.previewmain = this.addphotos[index];
    this.userserachbarreference = false;
    this.usersearch = "";
    this.usersearchdata = "";
  }; 

  taguserdatamore(data:any){
    const datas = {
        "userId":data._id,
        "username":data.username,
        "fullName":data.fullName,
        "x":0,
        "y":0
    };
    const index = this.activeindexmore
    this.Addmorephotos[index].taggedUsers.push(datas);
    this.previewmain = this.Addmorephotos[index];
    this.userserachbarreference = false;
    this.usersearchmore = "";
    this.usersearchdatamore = "";
  };

  //  tag userdata in image end

  // tag productdata in image start

  getProduct(){
    if(this.productsearch.trim() != ''){
      this.productsearchdata = [];
      const data = {
        pattern:this.productsearch.trim()
      };
      this._ImagesuploadService.getProductList(data).subscribe((res:any)=>{
        if(res.status == 200){
          const a = this.addphotos[this.activeindex].taggedProducts.map((item:any)=>{
            return item.productId;
          });
          res.data.map((item:any)=>{
            if(a.includes(item._id)){
            } else {
              this.productsearchdata.push(item);
            }
          });
        }
        if(res.status == 500){
          this._SharedService.errorToast(res.message)
        }
        if(res.status == 401){
          this._SharedService.errorToast(res.message)
        }
      });
    };
  };

  getProductmore(){
    if(this.productsearchmore.trim() != ''){
      this.productsearchdatamore = [];
      const data = {
        pattern:this.productsearchmore.trim()
      };
      this._ImagesuploadService.getProductList(data).subscribe((res:any)=>{
        if(res.status == 200){
          const a = this.Addmorephotos[this.activeindexmore].taggedProducts.map((item:any)=>{
            return item.productId;
          });
          res.data.map((item:any)=>{
            if(a.includes(item._id)){
            } else {
              this.productsearchdatamore.push(item);
            }
          });
        }
        if(res.status == 500){
          this._SharedService.errorToast(res.message)
        }
        if(res.status == 401){
          this._SharedService.errorToast(res.message)
        }
      });
    };
  };

  tagproductdata(productdata:any){
    const datas = {
      productId:productdata._id,
      productName:productdata.productName,
      variations:productdata.variations,
      x:0,
      y:0
    };
    const index = this.activeindex
    this.addphotos[index].taggedProducts.push(datas);
    this.previewmain = this.addphotos[index];
    this.tagprod = false;
    this.productsearch = "";
    this.productsearchdata = "";
  }

  tagproductdatamore(productdata:any){
    const datas = {
      productId:productdata._id,
      productName:productdata.productName,
      variations:productdata.variations,
      x:0,
      y:0
    };
    const index = this.activeindexmore
    this.Addmorephotos[index].taggedProducts.push(datas);
    this.previewmain = this.Addmorephotos[index];
    this.tagprod = false;
    this.productsearchmore = "";
    this.productsearchdatamore = "";
  }

  // tagproductdata in image end


  // onSelectFile(event:any){
  //   if(event.target.files && event.target.files[0]){
  //     var filesAmount = event.target.files.length;
  //       if(event.target.files.length <= 10){
  //          this.multiplefile = event.target.files;
  //       }
  //       for(let i = 0; i < filesAmount; i++){
  //               const reader = new FileReader();
  //               reader.onload = (event:any) => {
  //                 if (this.addphotos.length < 10) {
  //                   if (this.addphotos.length < 1) {
  //                     this.previewmain = {
  //                       "file":event.target.result
  //                     };
  //                   };
  //                   const obj = {
  //                     file:event.target.result,
  //                     taggedUsers:[],
  //                     taggedProducts:[],
  //                   }
  //                   this.addphotos.push(obj);
  //                 };
  //               };
  //               reader.readAsDataURL(event.target.files[i]);
  //       }
  //     }
  // }

  onSelectFile(event:any){
    if(event.target.files && event.target.files[0]){
      var filesAmount = event.target.files.length;
      if(event.target.files.length <= 10){
        for(let i = 0; i < filesAmount; i++){
            if(this.multiplefile.length < 10){
              this.multiplefile.push(event.target.files[i]); 
            }
            const reader = new FileReader();
            reader.onload = (events:any) => {
              if (this.addphotos.length < 10){
                if (this.addphotos.length < 1){
                  const config: ImgCropperLoaderConfig = {
                    scale: 0.745864772531767,
                    rotation: 0,
                    originalDataURL: events.target.result,
                  };
                  this.cropper.loadImage(config);
                  this.previewmain = {
                    "file":events.target.result
                  };
                };
                const obj = {
                  file:events.target.result,
                  taggedUsers:[],
                  taggedProducts:[],
                }
                this.addphotos.push(obj);
              };
            };
            reader.readAsDataURL(event.target.files[i]);
        }
      }
    }
  };
  
  dataURLtoFile(dataurl:any,filename:any) {
    var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), 
    n = bstr.length, 
    u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  // onSelectFile() {
  //   this.imageCompress.uploadMultipleFiles().then((SelectedMultiFiles: UploadResponse[]) => {
  //     const length = SelectedMultiFiles.length+this.addphotos.length
  //     if(length <= 10){
  //       for (let i = 0; i < SelectedMultiFiles.length; i++) {
  //         this.imageCompress.compressFile(SelectedMultiFiles[i].image,SelectedMultiFiles[i].orientation).then((compressedImage) => {
  //           let width, height;
  //           let img = new Image();
  //           img.src = compressedImage;
  //           img.addEventListener('load',function(){
  //             width=img.width;
  //             height=img.height;
  //             console.log(width,"width",height,"height")
  //           });
  //           let file = this.dataURLtoFile(compressedImage,`AddProductPhotos${i}`);
  //            console.log(file, "after file - formate");
  //            if(file.size < 153600){
  //             this.pushimage.push(compressedImage)
  //             this.previewmain = {"file":this.pushimage[0]};
  //             const obj = {
  //               file:compressedImage,
  //               taggedUsers:[],
  //               taggedProducts:[],
  //             }
  //             this.addphotos.push(obj);
  //            this.multiplefile.push(file)
  //            }else{
  //              this._SharedService.errorToast("File too Big, please select a file less than 1mb")
  //            }
  //         })
  //       }
        
  //     }
  //   });
  // }

  onSelectFileMore(event:any) {
    if(event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        if(event.target.files.length <= 15){
          for(let i = 0; i < filesAmount; i++){
              if(this.multiplefilemore.length < 15){
                this.multiplefilemore.push(event.target.files[i]); 
              }
              const reader = new FileReader();
              reader.onload = (events:any) => {
                if (this.Addmorephotos.length < 15){
                  if (this.Addmorephotos.length < 1){
                    const config: ImgCropperLoaderConfig = {
                      scale: 0.745864772531767,
                      rotation: 0,
                      originalDataURL: events.target.result,
                    };
                    this.cropper.loadImage(config);
                    this.previewmain = {
                      "file":events.target.result
                    };
                  };
                  const obj = {
                    file:events.target.result,
                    taggedUsers:[],
                    taggedProducts:[],
                  }
                  this.Addmorephotos.push(obj);
                };
              };
              reader.readAsDataURL(event.target.files[i]);
          }
        }
    }
  }

  // onSelectFileMore() {
  //   this.imageCompress.uploadMultipleFiles().then((ExtraselectImage: UploadResponse[]) => {
  //     const length = ExtraselectImage.length+this.Addmorephotos.length
  //     if(length <= 15){
  //       for (let i = 0; i < ExtraselectImage.length; i++) {
  //         this.imageCompress.compressFile(ExtraselectImage[i].image,ExtraselectImage[i].orientation , 50, 50).then((ExtraCompressedImage) => {
  //           let file = this.dataURLtoFile(ExtraCompressedImage,`ExtraProductPhotos${i}`);
  //            console.log(file, "after extra file - formate");
  //            if(file.size < 153600){
  //             this.Extrapushimage.push(ExtraCompressedImage)
  //             this.previewmain = {"file":this.Extrapushimage[0]};
  //             const obj = {
  //               file:ExtraCompressedImage,
  //               taggedUsers:[],
  //               taggedProducts:[],
  //             }
  //             this.Addmorephotos.push(obj);
  //            this.multiplefilemore.push(file)
  //            }else{
  //              this._SharedService.errorToast("File too Big, please select a file less than 1mb")
  //            }
  //         })
  //       }
        
  //     }
  //   });
  // }

  async imagesdata(e:any,indexs:any){
    this.activeindexmore = -1;
    if(this.cropimagereturn == true){
      this.cropper.crop();
    }
    await setTimeout(() => {
      this.cropimagereturn = false;
      this.multipleimgcheck = true;
      const config: ImgCropperLoaderConfig = {
        scale: 0.745864772531767,
        // xOrigin: 642.380608078103,
        // yOrigin: 236.26357452128866,
        // areaWidth: 100,
        // areaHeight: 100,
        rotation: 0,
        originalDataURL: e[indexs].file,
      };
      this.originalDataURLStore = e[indexs].file;
      this.cropper.loadImage(config);
      this.previewmain = e[indexs];     
      this.activeindex = indexs;
      this.getUsersboolean = false;
      this.getProductboolean = false;
    }, 100);
  }
  async imagesdatamore(e:any,indexs:any){
    this.activeindex = -1;
    if(this.cropimagereturn == true){
      this.cropper.crop();
    }
    await setTimeout(() => {
      this.cropimagereturn = false;
      this.multipleimgcheck = false;
      const config: ImgCropperLoaderConfig = {
        scale: 0.745864772531767,
        // xOrigin: 642.380608078103,
        // yOrigin: 236.26357452128866,
        // areaWidth: 100,
        // areaHeight: 100,
        rotation: 0,
        originalDataURL: e[indexs].file,
      };
      this.originalDataURLStoremore = e[indexs].file;
      this.cropper.loadImage(config);
      this.previewmain = e[indexs];     
      this.activeindexmore = indexs;
      this.getUsersboolean = true;
      this.getProductboolean = true;
    }, 100);
  }

  //  video section
  // tag userdata in video start
  getUsersvideo(){
    if(this.usersearchvideo.trim() != ''){
      this.usersearchdatavideo = [];
      const data = {
        pattern:this.usersearchvideo.trim()
      };
      this._VideouploadService.getUsersList(data).subscribe(res=>{
        const response:any = res;
        const a = this.videouploadformate[0].taggedUsers.map((item:any)=>{
            return item.userId;
        });
        response.data.map((item:any)=>{
          if(a.includes(item._id)){
            } else {
              this.usersearchdatavideo.push(item);
            }
        });
      });
    };
  };

  taguserdatavideo(data:any){
    const datas = {
        "userId":data._id,
        "username":data.username,
        "fullName":data.fullName,
        "x":0,
        "y":0
    };
    this.videouploadformate[0].taggedUsers.push(datas);
    this.previewmainvideo = this.videouploadformate[0];
    this.userserachbarreference = false;
    this.usersearchvideo = "";
    this.usersearchdatavideo = "";
  };

  // tag userdata in video end

  // tag productdata in video start
  getProductvideo(){
    if(this.productsearchvideo.trim() != ''){
      this.productsearchdatavideo = [];
      const data = {
        pattern:this.productsearchvideo.trim()
      };
      this._VideouploadService.getProductList(data).subscribe((res:any)=>{
        if(res.status == 200){
          const a = this.videouploadformate[0].taggedProducts.map((item:any)=>{
            return item.productId;
          });
          res.data.map((item:any)=>{
            if(a.includes(item._id)){
            } else {
              this.productsearchdatavideo.push(item);
            }
          });
        }
        if(res.status == 500){
          this._SharedService.errorToast(res.message)
        }
        if(res.status == 401){
          this._SharedService.errorToast(res.message)
        }
      });
    };
  };

  tagproductdatavideo(productdata:any){
    const datas = {
      productId:productdata._id,
      productName:productdata.productName,
      variations:productdata.variations
    };
    this.videouploadformate[0].taggedProducts.push(datas);
    this.previewmainvideo = this.videouploadformate[0];
    this.tagprod = false;
    this.productsearchvideo = "";
    this.productsearchdatavideo = "";
  }

  // tag productdata in video end

  getDuration(e:any){
    const duration = e.target.duration;
    const videoSizeError = duration > 30;
    if(videoSizeError == true){
      this._SharedService.errorToast('Video must be 30 seconds or below');
      this.format = '';
      this.url = '';
    };
  };
  
  onSelectFilevideo(event:any){
    const file = event.target.files && event.target.files[0];
    if (file && file.size <= 5048576) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      if(file.type.indexOf('image')> -1){
        this.format = 'image';
      } else if(file.type.indexOf('video')> -1){
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      }
      const obj = {
        file:file,
        taggedUsers:[],
        taggedProducts:[],
      }
      this.videouploadformate.push(obj);
    }else{
      this._SharedService.errorToast("File too Big, please select a file less than 5mb")
    }
  }

  // onSelectFileimages(event:any) {
  //   if(event.target.files && event.target.files[0]) {
  //     var filesAmount = event.target.files.length;
  //     for(let i = 0; i < filesAmount; i++){
  //       const reader = new FileReader();
  //       reader.onload = (event:any) => {
  //         this.addphotoscover = event.target.result
  //       };
  //       reader.readAsDataURL(event.target.files[i]);
  //     }
  //     this.onSelectimages = event.target.files[0];
  //   }
  // }

  onSelectFileimages() {
    this.imageCompress.uploadFile().then(({image, orientation}) => {
        this.imageCompress.compressFile(image, orientation, 50, 50).then((compressedImage) => {
          let file = this.dataURLtoFile(compressedImage,"Image");
          if(file.size < 153600){
            this.addphotoscover = compressedImage
            this.onSelectimages = file
          }else{
            this._SharedService.errorToast("File too Big, please select a file less than 1mb")
          }
        });
      }
    )
  }

  removecoverimg(){
    this.addphotoscover = "";
  }

  removevideo(){
    this.format = '';
    this.url = '';
    this.previewmainvideo = '';
    if(this.videouploadformate.length > 0){
      this.videouploadformate[0].taggedUsers = [];
      this.videouploadformate[0].taggedProducts = [];
    }
  }

  changeInfluencerPromoteValue(){
    if(this.pricingshipping.controls.influencerspromotemarket.value == 'false'){
      this.influencerPrice = [
        {
          quantitysoldfrom: 1,
          quantitysoldto: 10,
          payperunit: undefined
        }
      ];
      this.quantitysoldfrom=11;
      this.quantitysoldto= 0;
      this.payperunit=undefined;
    }
    // this.quantityunitarray = this.pricingshipping.get('influencerspromote') as FormArray;
    // this.quantityunitarray.clear()
    // this.quantityunitarray.push(this.quantityunit());
  }

  // quantityunit(){
  //   const influencerPromoterForm =new FormGroup({
  //     quantitysoldfrom: new FormControl(this.quantitySoldFromInit,[Validators.required,Validators.pattern('^[0-9]*$')]),
  //     quantitysoldto: new FormControl(this.quantitysoldToInit,[Validators.required,Validators.pattern('^[0-9]*$'),Validators.min(this.quantitySoldFromInit)]),
  //     payperunit: new FormControl(undefined,[Validators.required,Validators.pattern('^[0-9]*$')]),
  //   });
  //    // this.NewOfferForm.get('OfferType').valueChanges.subscribe((val:any) => {
  //   //   if (val == "PercentageOff") {
  //   //     this.NewOfferForm.controls['discount'].setValidators([Validators.required,Validators.max(100),Validators.pattern('^[0-9]*$')]);
  //   //   } else if(val == "FlatAmountOff") {
  //   //     this.NewOfferForm.controls['discount'].setValidators([Validators.required,Validators.pattern('^[0-9]*$')]);
  //   //   }
  //   //   this.NewOfferForm.controls['discount'].updateValueAndValidity();
  //   // });

  //   influencerPromoterForm.valueChanges.subscribe((val:any) => {
  //     influencerPromoterForm.controls['quantitysoldto'].setValidators([Validators.required,Validators.min(val.quantitysoldfrom),Validators.pattern('^[0-9]*$')]);
  //     this.quantitySoldFromInit = +val.quantitysoldto+1
  //     this.quantitysoldToInit = +val.quantitysoldto
  //     this.quantitysoldfrom = this.quantitySoldFromInit
  //     this.quantitysoldDiffInit = val.quantitysoldto - val.quantitysoldfrom
  //       });

  //   return influencerPromoterForm
  // }

  // quantitysold(){
  //   if(this.pricingshipping.controls.influencerspromote.status != "INVALID"){
  //     this.quantityunitarray = this.pricingshipping.get('influencerspromote') as FormArray;
  //     console.log(this.quantitysoldDiffInit,'this.quantitysoldDiffInit')
  //     this.quantitysoldToInit = this.quantitysoldfrom+this.quantitysoldDiffInit
  //     this.quantitysoldfrom = this.quantitysoldToInit+1
  //     this.quantityunitarray.push(this.quantityunit());
  //   }else{
  //     this.pricingshipping.get('influencerspromote').markAllAsTouched();
  //   }
  // }

  // quantitysoldremove(){
  //   const quantitysold = this.pricingshipping.get('influencerspromote') as FormArray;
  //   quantitysold.removeAt(-1);
  // }

  productbrandvalue(){
    $(".brandnameval .select2-container .select2-selection--single").css("border"," 0.1px solid #9F9F9F")
    setTimeout(() => {
      let findedData = this.exampleData.find((x:any)=>{
        return x.id === this.productnobrandvalue
      });
      if(findedData != undefined){
        if(this.productnobrand == false){
          this.formdataproduct.append('brandId',findedData.id);
          this.formdataproduct.append('countryCode',findedData.countrycode);
          console.log('brandId',findedData.id);
          console.log('countryCode',findedData.countrycode);
        }
      }
    }, 100);
  }

  async finalsubmit(){
     this.spinner.show();
   await this._AddproductService.addProduct(this.formdataproduct).subscribe((res:any)=>{
      if(res.status == 201){
        this._SharedService.successToast(res.message)
        const data =res.data
        this.spinner.hide();
        this.infoAttributes.reset();
        this.pricingshipping.reset();
        // $(".select2-val .select2.select2-container.select2-container--default.select2-container--below .select2-selection--single").css("border","1px solid #4d4d4d");
        // $(".select2-val .select2.select2-container.select2-container--default.select2-container--above .select2-selection--single").css("border","1px solid #4d4d4d");
        this.formdatareset();
        this.subcategory = undefined;
        this.menusubcategory = undefined;
        this.SubCategorynotfound = false;
        this.productTypevalue = undefined;
        this.producttypenotfound = false;
        this.productnobrandvalue = undefined;
        this.colorarrraylist = undefined;
        this,this.ShowSelectedColorname = undefined;
        this.hashtag = [];
        // this.addphotos = [];
        // this.previewmain = null;
        // this.Addmorephotos = [];
        // (this.pricingshipping.get('influencerspromote') as FormArray).clear();
        (this.infoAttributes.get('variations') as FormArray).clear();
        this.infoAttributes.get('nonreturnableitems').value = false;
        (this.infoAttributes.get('highlights') as FormArray).clear();
        (this.infoAttributes.get('highlights') as FormArray).push(this.highlightsItem());
        (this.infoAttributes.get('searchkeywords') as FormArray).clear();
        (this.infoAttributes.get('searchkeywords') as FormArray).push(this.searchkeywordsItem());
        (this.infoAttributes.get('addmorespecific') as FormArray).clear();
        (this.infoAttributes.get('addmorespecific') as FormArray).push(this.addmoreItem());
        this.router.navigateByUrl('/home');
        this.removecoverimg()
        this.removevideo();

        // this.addphotosfile.nativeElement.value = null;
        // this.addmorephotos.nativeElement.value = null;
        // this.multiplefile='';
        // this.multiplefilemore='';
        // productPhotosTags
        // extraPhotosTags
        // productVideosTags
        // this.videouploadformate ='';
        // this.onSelectimages='';
      }
      if(res.status ==500){
        this._SharedService.errorToast(res.message)
        this.spinner.hide();
        this.formdatareset();
      }
      
    },(err)=>{
      console.log(err,"err");
      this.spinner.hide();
    });
  }

  formdatareset(){
    this.formdataproduct.delete('menuCategoryId');
    this.formdataproduct.delete('menuSubCategoryId');
    this.formdataproduct.delete('productTypeId');
    this.formdataproduct.delete('brandId');
    this.formdataproduct.delete('countryCode');
    this.formdataproduct.delete('productName');
    this.formdataproduct.delete('productId');
    this.formdataproduct.delete('productCode');
    this.formdataproduct.delete('colors');
    this.formdataproduct.delete('linkProducts');
    this.formdataproduct.delete('highlights');
    this.formdataproduct.delete('description');
    this.formdataproduct.delete('productPhotos');
    this.formdataproduct.delete('hashtags');
    this.formdataproduct.delete('extraPhotos');
    this.formdataproduct.delete('productVideos');
    this.formdataproduct.delete('salesTax');
    this.formdataproduct.delete('stockQuantity');
    this.formdataproduct.delete('hsnCode');
    this.formdataproduct.delete('isPromotable');
    this.formdataproduct.delete('isAgeRestricted');
    this.formdataproduct.delete('targetFor');
    this.formdataproduct.delete('countryOfOrigin');
    this.formdataproduct.delete('domesticShippingCharges');
    this.formdataproduct.delete('variations');
    this.formdataproduct.delete('productStatus');
    this.formdataproduct.delete('productPhotos');
    this.formdataproduct.delete('coverImg');
    this.formdataproduct.delete('productBrand');
    this.formdataproduct.delete('productPhotosTags');
    this.formdataproduct.delete('extraPhotosTag');
    this.formdataproduct.delete('productVideosTag');
    this.formdataproduct.delete('specifications');
    this.formdataproduct.delete('writeproductscode');
    this.formdataproduct.delete('warrantyperiod');
    this.formdataproduct.delete('warrantydays');
    this.formdataproduct.delete('influencerspromoters');
    this.formdataproduct.delete('returnitemperiod');
    this.formdataproduct.delete('returnitemdays');
    this.formdataproduct.delete('searchkeywords');
    this.formdataproduct.delete('maximumorderquantity');
    this.formdataproduct.delete('minimumorderquantity');
    this.formdataproduct.delete('extraPhotosTags');
    this.hashtag = [];
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if ((value || '').trim()) {
      if (this.hashtag.length < 10) {
        const hashtag = value.replace(/#/g, '').trim();
        const hashtaginclude = '#' + hashtag.replace(/\s/g, '');
        let result = this.hashtag.filter(o1 => [hashtaginclude].some(o2 => o1 == o2));
        if(result.length === 0){
          this.hashtag.push(hashtaginclude);
        }else{
          this._SharedService.errorToast("already use hashtag");
        }
      } else {
        this.hashtag.splice(-1);
        const hashtag = value.replace(/#/g, '').trim();
        const hashtaginclude = '#' + hashtag.replace(/\s/g, '');
        let result = this.hashtag.filter(o1 => [hashtaginclude].some(o2 => o1 == o2));
        if(result.length === 0){
          this.hashtag.push(hashtaginclude);
        }else{
          this._SharedService.errorToast("already use hashtag");
        }
      }
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  remove(fruit: string): void {
    const index = this.hashtag.indexOf(fruit);
    if (index >= 0) {
      this.hashtag.splice(index, 1);
    }
  }

  cropimages(){
    this.cropimagereturn = !this.cropimagereturn;
    setTimeout(() => {
      this.cropper.center();
    }, 10);
  };
  onCropped(e: ImgCropperEvent){
    // this.croppedImage = e.dataURL;
    const imageName = `${new Date().getTime()}.png`;
    const imageBlob = this.dataURItoBlob(e.dataURL);
    const imageFile = new File([imageBlob], imageName);
    if(this.multipleimgcheck == true){
      console.log("true from data value");
      this.originalDataURLStore = e.dataURL;
      // ------------ New croped file ---------------
      this.multiplefile[this.activeindex] = imageFile;
      this.addphotos[this.activeindex].file = e.dataURL;
    }else{
      console.log("false from data value");
      this.originalDataURLStoremore = e.dataURL;
      // ------------ New croped file ---------------
      this.multiplefilemore[this.activeindexmore] = imageFile;
      this.Addmorephotos[this.activeindexmore].file = e.dataURL;
    }
    this.cropimagereturn = false;
  };
  onLoaded(e: ImgCropperEvent){
    console.log('img loaded', e);
  };
  onError(e: ImgCropperErrorEvent){
    console.warn(`'${e.name}' is not a valid image`, e);
  };
  dataURItoBlob(dataURI: any){
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };
  async removeImagesmore(data:any){
    this.productremoveindex = data;
    this.multipleimgremovecheck = false;
  };
  removeImages(data:any){
    this.productremoveindex = data;
    this.multipleimgremovecheck = true;
  };

  async productimgdelete(){
    if(this.multipleimgremovecheck){
      this.addphotos.splice(this.productremoveindex,1);
      this.multiplefile.splice(this.productremoveindex,1);
      await setTimeout(() => {
        if(this.productremoveindex != 0){
          if(this.productremoveindex === this.activeindex){
            $( ".addphotos #"+ this.productremoveindex).trigger("click");
          }
        }else if(this.productremoveindex == 0){
          if(this.productremoveindex === this.activeindex){
            $( ".addphotos #"+ this.productremoveindex).trigger("click");
          }
        }
      }, 100);
    }else{
      this.Addmorephotos.splice(this.productremoveindex,1);
      this.multiplefilemore.splice(this.productremoveindex,1);
      await setTimeout(() => {
        if(this.productremoveindex != 0){
          if(this.productremoveindex === this.activeindexmore){
            $( ".Addmorephotos #"+ this.productremoveindex ).trigger("click");
          }
        }else if(this.productremoveindex == 0){
          if(this.productremoveindex === this.activeindexmore){
            $( ".Addmorephotos #"+ this.productremoveindex).trigger("click");
          }
        }
      }, 100);
    }
  }

  onDragDroppeduser($event: CdkDragEnd,i:any){
    if(this.activeindex != -1){
      this.addphotos[this.activeindex].taggedUsers[i].x = $event.source.getFreeDragPosition().x;
      this.addphotos[this.activeindex].taggedUsers[i].y = $event.source.getFreeDragPosition().y;
      // console.log(this.addphotos,"this.addphotos - data");
    }else if(this.activeindexmore != -1){
      this.Addmorephotos[this.activeindexmore].taggedUsers[i].x = $event.source.getFreeDragPosition().x;
      this.Addmorephotos[this.activeindexmore].taggedUsers[i].y = $event.source.getFreeDragPosition().y;
      // console.log(this.Addmorephotos,"this.Addmorephotos - data");
    }else{
      console.log("something went to wrong onDragDroppeduser");
    }
  }
  
  onDragDroppedproduct($event: CdkDragEnd,i:any){
    if(this.activeindex != -1){
      this.addphotos[this.activeindex].taggedProducts[i].x = $event.source.getFreeDragPosition().x;
      this.addphotos[this.activeindex].taggedProducts[i].y = $event.source.getFreeDragPosition().y;
      console.log(this.addphotos,"this.addphotos - data");
    }else if(this.activeindexmore != -1){
      this.Addmorephotos[this.activeindexmore].taggedProducts[i].x = $event.source.getFreeDragPosition().x;
      this.Addmorephotos[this.activeindexmore].taggedProducts[i].y = $event.source.getFreeDragPosition().y;
      console.log(this.Addmorephotos,"this.Addmorephotos - data");
    }else{
      console.log("something went to wrong onDragDroppeduser");
    }
  }

  // onDragDroppedmoreuser($event: CdkDragEnd,i:any){
  //   this.Addmorephotos[this.activeindexmore].taggedUsers[i].x = $event.source.getFreeDragPosition().x;
  //   this.Addmorephotos[this.activeindexmore].taggedUsers[i].y = $event.source.getFreeDragPosition().y;
  // }
  
  // onDragDroppedmoreproduct($event: CdkDragEnd,i:any){
  //   this.Addmorephotos[this.activeindexmore].taggedProducts[i].x = $event.source.getFreeDragPosition().x;
  //   this.Addmorephotos[this.activeindexmore].taggedProducts[i].y = $event.source.getFreeDragPosition().y;
  // }

  onDragDroppedvideouser($event: CdkDragEnd,i:any){
    this.videouploadformate[0].taggedUsers[i].x = $event.source.getFreeDragPosition().x;
    this.videouploadformate[0].taggedUsers[i].y = $event.source.getFreeDragPosition().y;
  }

  onDragDroppedvideoproduct($event: CdkDragEnd,i:any){
    this.videouploadformate[0].taggedProducts[i].x = $event.source.getFreeDragPosition().x;
    this.videouploadformate[0].taggedProducts[i].y = $event.source.getFreeDragPosition().y;
  }

  ngAfterContentChecked(){
    this.cdr.detectChanges();
    // call or add here your code
  }
}