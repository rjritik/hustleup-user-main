import { Component, OnInit, SecurityContext, ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { SharedService } from 'src/app/main/shared/shared.service';
import { OfferPromocodeService } from './offer-promocode.service';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
declare var $:any;


@Component({
  selector: 'app-offer-promocode',
  templateUrl: './offer-promocode.component.html',
  styleUrls: ['./offer-promocode.component.css'],
})
export class OfferPromocodeComponent implements OnInit {
  public PromocodeType:any = Array<Select2OptionData>();
  public OfferType:any = Array<Select2OptionData>();
  public OfferForBuyer:any = Array<Select2OptionData>();
  public ApplyOfferType:any = Array<Select2OptionData>();
  ExampleApplyOfferType:any = Array<Select2OptionData>()
  NotavailOfferList:boolean = false
  EditOffer: boolean = true;
  offerpromoman = true;
  createnewoffer = false;
  today=new Date();
  NewOfferPromocodesList:any = []
  activeIndex = -1;
  SelectedDeleteOfferItem:any=[]
  DuplicateItem:any
  coupenId:any;
  PageNo:any;
  limit:any;
  totalPages:any;
  nextPage:any;
  hasNextPage:any
  prevPage:any;
  hasPrevPage:any;
  // public options: Options;
  SellerWiseProductList:any=[];
  SelectedProducts:any=[];
  FinalSelectedProducts:any=[];
  LinkProductAvail:boolean;
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');
  
  constructor(private _SharedService: SharedService,
    private _AuthenticationService:AuthenticationService,
              private _OfferPromocodeService:OfferPromocodeService,
              private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    // this.options = {
    //   multiple: true,
    //   tags: true,
    // };
    this.GetProductNameSellerWise()
    this.GetOfferPromocodesList()
    this.PromocodeType = [
      {
        id: 'all',
        text: 'All'
      },
      {
        id: 'selected',
        text: 'Selected'
      },
    ]
    this.OfferType = [
      {
        id: 'PercentageOff',
        text: 'Percentage Off'
      },
      {
        id: 'FlatAmountOff',
        text: 'Flat Amount Off'
      },
    ]
    this.OfferForBuyer = [
      {
        id:'once',
        text:'Once'
      },
      {
        id:'multiple',
        text:'multiple'
      }
    ]
    this.NewOfferForm.get('PromocodeType').valueChanges.subscribe((val:any) => {
      if (val == "all") {
        this.SelectedProducts=[];
        this.FinalSelectedProducts=[];
        // this.LinkProductAvail = true
        // this.NewOfferForm.controls['offerFor'].setValidators([Validators.required]);
      } else {
        // this.LinkProductAvail = false
        // this.NewOfferForm.controls['offerFor'].clearValidators();
      }
      // this.NewOfferForm.controls['offerFor'].updateValueAndValidity();
    });

    this.NewOfferForm.get('OfferType').valueChanges.subscribe((val:any) => {
      if (val == "PercentageOff") {
        this.NewOfferForm.controls['discount'].setValidators([Validators.required,Validators.max(100),Validators.pattern('^[0-9]*$')]);
      } else if(val == "FlatAmountOff") {
        this.NewOfferForm.controls['discount'].setValidators([Validators.required,Validators.pattern('^[0-9]*$')]);
      }
      this.NewOfferForm.controls['discount'].updateValueAndValidity();
    });
  }

  NewOfferForm: any = new FormGroup({
    PromocodeType: new FormControl('', [Validators.required]),
    OfferName: new FormControl(undefined, [Validators.required]),
    OfferType: new FormControl('', [Validators.required]),
    offerforbuyer: new FormControl('', [Validators.required]),
    discount: new FormControl(undefined, [ Validators.required]),//For Precentagevalidation
    // offerFor: new FormControl(''),
    PromoCode: new FormControl(undefined, [Validators.required]),
    ValidUpto: new FormControl(undefined, [Validators.required]),
    visibleAll:new FormControl(false)
  });

  get f() {
    return this.NewOfferForm;
  }

  async GetOfferPromocodesList(){
    const data = {
      page: this.PageNo == undefined ? 1 : this.PageNo,
      limit:  this.limit == undefined ? 10:this.limit,
    }
    await this._OfferPromocodeService.getofferpromocodes(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.NewOfferPromocodesList = res.data.docs
        this.PageNo = res.data.page
        this.limit = res.data.limit
        this.totalPages = res.data.totalPages
        this.nextPage = res.data.nextPage
        this.prevPage = res.data.prevPage
        this.hasNextPage = res.data.hasNextPage
        this.hasPrevPage = res.data.hasPrevPage
        console.log(this.NewOfferPromocodesList,"NewOfferPromocodesList")
        if (this.NewOfferPromocodesList.length > 0) {
          this.NotavailOfferList = true;
        }else{
          this.NotavailOfferList = false
        }
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
    })

  }

  async GetProductNameSellerWise(){
    await this._OfferPromocodeService.getproductnamesellerwise().subscribe((res:any)=>{
      if(res.status == 200){
        this.SellerWiseProductList = res.data

        // res.data.forEach((ele:any) => {
        //   const example={
        //     id:ele._id,
        //     text:ele.productName
        //   }
        //   this.ExampleApplyOfferType.push(example)
        // });
        // this.ApplyOfferType = this.ExampleApplyOfferType 
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
    });
  }

  OpenProductPopup(){
    $('.modal#linkproduct').modal({
      backdrop: 'static',
      keyboard: false
    })
    this.LinkProductAvail = true
  }

  CancelProductPopup(){
    $("#linkproduct").modal("hide");
    this.FinalSelectedProducts = []
    this.SelectedProducts =[]
    this.LinkProductAvail = true
  }

  // check if the item are selected
  checkedProduct(item:any) {
    if (this.SelectedProducts.indexOf(item) != -1) {
      return true;
    }
  }

  // when checkbox change, add/remove the item from the array
  onChange(checked:any, item:any) {
    if (checked.target.checked) {
      this.SelectedProducts.push(item);
    } else {
      this.SelectedProducts.splice(this.SelectedProducts.indexOf(item), 1);
    }
  }

  SelectProductpopupclick(){
    if(this.SelectedProducts.length !== 0){
      this.FinalSelectedProducts = []
      this.SelectedProducts.forEach((element:any) => {
        this.FinalSelectedProducts.push({productId:element._id})
      });
      $("#linkproduct").modal("hide");
      console.log(this.SelectedProducts,"this.SelectedProducts")
      this.LinkProductAvail = true
    }else{
      this._SharedService.errorToast("select any one product")
    }
  }
  
  AddNewOffer(f:any){
    if (f.valid) {
      if(f.value.PromocodeType == 'all'){
        this.addOfferAPI(f);
      }
    if(f.value.PromocodeType == 'selected'){
      if(this.FinalSelectedProducts.length != 0) {
        this.addOfferAPI(f);
      } else{
        this.LinkProductAvail = false
      }
    }
    } else {
      this.NewOfferForm.markAllAsTouched();
      this.LinkProductAvail = false
    }
  }

  addOfferAPI(f:any){
    // const offerfor:any=[]
    // if(f.value.PromocodeType == 'selected'){
    //   f.value.offerFor.forEach((ele:any)=>{
    //     offerfor.push({productId:ele})
    //   });
    // }
    let data = {
      promoCodeType: this.sanitizer.sanitize(SecurityContext.HTML,f.value.PromocodeType),
      offerName: this.sanitizer.sanitize(SecurityContext.HTML,f.value.OfferName),
      offerType: this.sanitizer.sanitize(SecurityContext.HTML,f.value.OfferType),
      offerForBuyer: this.sanitizer.sanitize(SecurityContext.HTML,f.value.offerforbuyer),
      discount: f.value.discount,
      offerFor: this.FinalSelectedProducts,
      promocode: this.sanitizer.sanitize(SecurityContext.HTML,f.value.PromoCode),
      validUpto: f.value.ValidUpto,
      visibleAll:f.value.visibleAll
    };
    this._OfferPromocodeService.addofferpromocodes(data).subscribe((res:any)=>{
      if(res.status == 201){
        this._SharedService.successToast(res.message);
        this.GetOfferPromocodesList()
        this.clearfunction()
      }
      if(res.status == 400){
        this._SharedService.errorToast(res.message);
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message);
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message);
      }
    });
  }
  
  EditOfferList(item:any){
    // const offerforedit:any = []
    // item.offerFor.forEach((element:any) => {
    //   offerforedit.push(element.productId)
    // });
    this.coupenId = item._id;
    if(item.offerFor.length !== 0){
      item.offerFor.forEach((mainele:any,i:any) => {
        this.SellerWiseProductList.forEach((element:any,j:any) => {
        if(mainele.productId == element._id){
          this.SelectedProducts.push(element)
          this.FinalSelectedProducts.push({productId:element._id})
        }
        });
      });
    }
    if(item.offerFor.length === 0){
      this.SelectedProducts=[];
      this.FinalSelectedProducts=[];
    }
      this.NewOfferForm.patchValue({
        PromocodeType:item.promoCodeType,
        OfferName: item.offerName,
        OfferType: item.offerType,
        offerforbuyer:item.offerForBuyer,
        discount: item.discount == 0? item.amount:item.discount,
        // offerFor: offerforedit,
        PromoCode: item.promocode,
        ValidUpto: new Date(item.validUpto),
        visibleAll:item.visibleAll
      });
    this.offerpromoman = false;
    this.createnewoffer = true;
    this.EditOffer = false;
  }

  UpdateOffer(f:any){
    if (f.valid) {
      if(f.value.PromocodeType == 'all'){
        this.updateofferAPI(f)
      }
      if(f.value.PromocodeType == 'selected'){
        if(this.FinalSelectedProducts.length != 0) {
          this.updateofferAPI(f)
        } else{
          this.LinkProductAvail = false
        }
      }
    } else {
      this.NewOfferForm.markAllAsTouched();
    }

  }

  updateofferAPI(f:any){
    // const updateofferfor:any=[];
    // f.value.offerFor.forEach((element:any)=>{
    //   updateofferfor.push({productId:element})
    // })
    let data ={
      couponId:this.coupenId,
      params:{
        promoCodeType: this.sanitizer.sanitize(SecurityContext.HTML, f.value.PromocodeType),
        offerName: this.sanitizer.sanitize(SecurityContext.HTML, f.value.OfferName),
        offerType: this.sanitizer.sanitize(SecurityContext.HTML, f.value.OfferType),
        offerForBuyer: this.sanitizer.sanitize(SecurityContext.HTML, f.value.offerforbuyer),
        discount: f.value.discount,
        offerFor: this.FinalSelectedProducts,
        promocode: this.sanitizer.sanitize(SecurityContext.HTML, f.value.PromoCode),
        validUpto: f.value.ValidUpto,
        visibleAll:f.value.visibleAll
      }
    }
    this._OfferPromocodeService.updateofferpromocode(data).subscribe((res: any) => {
      if (res.status === 200) {
        this.GetOfferPromocodesList()
        this._SharedService.successToast(res.message);
        this.clearfunction()
      }
    });
  }

  clearfunction(){
    this.NewOfferForm.reset();
    this.NewOfferForm.controls.PromocodeType.setValue('');
    this.NewOfferForm.controls.OfferType.setValue('');
    this.NewOfferForm.controls.offerforbuyer.setValue('');
    // this.NewOfferForm.controls.offerFor.setValue('');
    this.SelectedProducts=[];
    this.FinalSelectedProducts =[];
    this.LinkProductAvail = true
    this.offerpromoman = true;
    this.createnewoffer = false;
  }


  CloseOfferBtnClick(item:any){
    this.SelectedDeleteOfferItem = [item]
  }

  DeleteOffer(){
    const data ={
      couponId:this.SelectedDeleteOfferItem[0]._id
    }
    this._OfferPromocodeService.deleteofferpromocodes(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message)
        this.SelectedDeleteOfferItem = []
        this.GetOfferPromocodesList()  
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 404){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  CreatePromoCode(){
    this.offerpromoman = false;
    this.createnewoffer = true;
    this.EditOffer = true;
  }

  CreatePromoCodeCancel(){
    this.NewOfferForm.reset();
    this.NewOfferForm.controls.PromocodeType.setValue('');
    this.NewOfferForm.controls.OfferType.setValue('');
    this.NewOfferForm.controls.offerforbuyer.setValue('');
    // this.NewOfferForm.controls.offerFor.setValue('');
    this.FinalSelectedProducts = []
    this.SelectedProducts =[]
    this.offerpromoman = true;
    this.createnewoffer = false;
  }

  //for pagination
  SelectItemsPerPage(event:any){
    this.limit = event.target.value
    this.GetOfferPromocodesList()
  }
  onFirst(){
    if(this.hasPrevPage  == true){
      this.PageNo = 1
      this.GetOfferPromocodesList()
    }
  }

  onPrevious(){
    if(this.hasPrevPage  == true){
      this.PageNo = this.prevPage
      this.GetOfferPromocodesList()
    }
  }

  onNext(){
    if(this.hasNextPage  == true){
      this.PageNo = this.nextPage
      this.GetOfferPromocodesList()
    }
  }

  onLast(){
    if(this.hasNextPage  == true){
      this.PageNo = this.totalPages
      this.GetOfferPromocodesList()
    }
  }

}
