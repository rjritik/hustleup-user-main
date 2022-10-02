import { Component, OnInit,OnDestroy, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/main/auth/service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { ProductListingService } from '../product-listing.service';
import { ActiveListingsService } from './active-listings.service';
declare var $ :any;

@Component({
  selector: 'app-active-listings',
  templateUrl: './active-listings.component.html',
  styleUrls: ['./active-listings.component.css']
})
export class ActiveListingsComponent implements OnInit,OnDestroy{
  ActiveListingStatus = 1;
  returnstatus:number;
  SelectedSellingPriceProductId:any
  SelectedStockQuantityProductId:any
  SelectedSellingPriceIndex:any;
  SelectedStockQuantityIndex:any;
  ActiveListingList:any=[]
  InfluencerCommisionRate:any=[];
  SelectedCloseListing:any=[]
  SlideOptions:any;
  selecteddropdownitem:any
  SelectedInfluRateId:any;
  PageNo:any;
  limit:any;
  totalPages:any;
  nextPage:any;
  hasNextPage:any
  prevPage:any;
  hasPrevPage:any;
  docslength:any;
  selectdropvalue:any;
  Activelistunsubscribe:any;

  constructor(private _ProductListingService:ProductListingService,
              private _SharedService: SharedService,
              private _authentication:AuthenticationService,
              private _ActiveListingsService:ActiveListingsService,
              private router:Router) { 
    }

  ngOnInit(): void {
    this.Activelistunsubscribe = this._ProductListingService.GettextActivelist.subscribe(res=>{
      if(res != undefined){
        if(res == ""){
          this.GetActiveListingData();
        }else{
          this.GetSelectedField();
          this.returnSearch(res);
        } 
      }else{
        this.GetActiveListingData();
      }
    })
    this.SlideOptions = {nav:false, items: 1, loop:false,autoplay:false,autoplayTimeout:1000};
  }

  CommisionRateForm: any = new FormGroup({
    CommisionRate: new FormArray([])
  });

  UpdateStockForm:any= new FormGroup({
    stockvalue:new FormControl(undefined, [Validators.required, Validators.pattern('^[0-9]*$')]),
  })

  get f() {
    return this.UpdateStockForm;
  }

  UpdatePriceForm:any= new FormGroup({
    pricevalue:new FormControl(undefined, [Validators.required, Validators.pattern('^[0-9]*$')]),
  })

  get priceform() {
    return this.UpdatePriceForm;
  }

  GetSelectedField(){
    this._ProductListingService.GetSelectedField.subscribe((res:any)=>{
      switch (res){
        case "Product ID":
          this.selectdropvalue = "productId";
          break;
        case "Product Name":
          this.selectdropvalue = "productName";
          break;
        case "Seller SKU":
          this.selectdropvalue = "sellerSku";
          break;                
        default:
          this.selectdropvalue = "productId";
          break;
      }
    })
  }

  returnSearch(res:any){
      const data = {
        status : this.ActiveListingStatus,
        searchBy:this.selectdropvalue,
        pattern:res,
        page: this.PageNo == undefined ? 1 : this.PageNo,
        limit:  this.limit == undefined ? 10:this.limit
      }
      this._ProductListingService.GetProductList(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.ActiveListingList = res.data.docs
          this.PageNo = res.data.page
          this.limit = res.data.limit
          this.totalPages = res.data.totalPages
          this.nextPage = res.data.nextPage
          this.prevPage = res.data.prevPage
          this.hasNextPage = res.data.hasNextPage
          this.hasPrevPage = res.data.hasPrevPage
          this.docslength = res.data.totalDocs
          const ordervalue = {
            data:res.data.totalDocs,
            status:this.ActiveListingStatus
          }
          this._ProductListingService.SetActiveListingscount(ordervalue);
        }
      })
  };

  async GetActiveListingData(){
    const data = {
      status : this.ActiveListingStatus,
      page: this.PageNo == undefined ? 1 : this.PageNo,
      limit:  this.limit == undefined ? 10:this.limit,
     countryCode:this._authentication.currentUserValue.countryCode
    }
    this._ProductListingService.GetProductList(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.ActiveListingList = res.data.docs
        this.PageNo = res.data.page
        this.limit = res.data.limit
        this.totalPages = res.data.totalPages
        this.nextPage = res.data.nextPage
        this.prevPage = res.data.prevPage
        this.hasNextPage = res.data.hasNextPage
        this.hasPrevPage = res.data.hasPrevPage
        this.docslength = res.data.totalDocs
        const ordervalue = {
          data:res.data.totalDocs,
          status:this.ActiveListingStatus
        }
        this._ProductListingService.SetActiveListingscount(ordervalue);
      }
    })
  }


  GetPrice(Productid:any,item:any,variindex:any){
    this.SelectedSellingPriceProductId = Productid
    this.SelectedSellingPriceIndex = variindex
    this.UpdatePriceForm.patchValue({
      pricevalue: item.sellingPrice,
    });
  }

  UpdatePriceApply(priceform:any){
    if(priceform.valid){
      const data ={
        productId: this.SelectedSellingPriceProductId,
        variations: [
          {
            index: this.SelectedSellingPriceIndex,
            sellingPrice: priceform.value.pricevalue
          }
        ]
      }
      this._ActiveListingsService.SingleProductSellingPriceUpdate(data).subscribe((res:any)=>{
        if(res.status == 200){
          this._SharedService.successToast(res.message)
          $('#update-price-listing').modal('hide');
          this.GetActiveListingData()
        }
        if(res.status == 500){
          this._SharedService.errorToast(res.message)
        }
      })
    }else{
      this.UpdateStockForm.markAllAsTouched()
    }
  }

  UpdatePriceCancel(){
    $('#update-price-listing').modal('hide');
  }

  GetStockValue(Productid:any,item:any,variindex:any){
    this.SelectedStockQuantityProductId = Productid
    this.SelectedStockQuantityIndex = variindex
    this.UpdateStockForm.patchValue({
      stockvalue: item.stockQuantity,
    });
  }

  UpdateStockApply(f:any){
    if(f.valid){
     const data ={
      productId: this.SelectedStockQuantityProductId,
      variations: [
        {
          index: this.SelectedStockQuantityIndex,
          stockQuantity: f.value.stockvalue
        }
      ]
    }
    this._ActiveListingsService.SingleProductQuantityUpdate(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message)
        $('#update-stock-listing').modal('hide');
        this.GetActiveListingData();
      }
    })
    }else{
      this.UpdateStockForm.markAllAsTouched()
    }
  }

  UpdateStockCancel(){
    $('#update-stock-listing').modal('hide');
  }

  SelectedInfluencerCommisionRate(item:any){
    this.SelectedInfluRateId = item._id
    this.InfluencerCommisionRate = item.influencerspromoters
    this.CommisionRatepatch()
    $('.modal#Edit-Influencer-Commission-Rate').modal({backdrop: 'static',keyboard: false});
  }

  CommisionRatepatch() {
    const control = <FormArray>this.CommisionRateForm.get('CommisionRate');
    control.clear();
    this.InfluencerCommisionRate.forEach((x:any) => {
      control.push(this.CommisionRatepatchValues(x.quantitysoldfrom, x.quantitysoldto,x.payperunit))
    })
  }

  CommisionRatepatchValues(start:any, end:any,total:any) {
    return new FormGroup({
      quantitysoldfrom: new FormControl(start, [Validators.required, Validators.pattern('^[0-9]*$')]),
      quantitysoldto: new FormControl(end, [Validators.required, Validators.pattern('^[0-9]*$')]),
      payperunit: new FormControl(total, [Validators.required, Validators.pattern('^[0-9]*$')]),
    });
  }

  AddCommisionRateItem(){
    return new FormGroup({
      quantitysoldfrom: new FormControl(undefined, [Validators.required, Validators.pattern('^[0-9]*$')]),
      quantitysoldto: new FormControl(undefined, [Validators.required, Validators.pattern('^[0-9]*$')]),
      payperunit: new FormControl(undefined, [Validators.required, Validators.pattern('^[0-9]*$')]),
    });
  }

  AddMoreCommisionRate(){
    if(this.CommisionRateForm.controls.CommisionRate.status != "INVALID"){
      this.InfluencerCommisionRate = this.CommisionRateForm.get('CommisionRate') as FormArray;
      this.InfluencerCommisionRate.push(this.AddCommisionRateItem());
    }else{
      this.CommisionRateForm.get('CommisionRate').markAllAsTouched();
    }
  }

  RemoveLastCommisionRate(){
    const removedata = this.CommisionRateForm.get('CommisionRate') as FormArray;
    removedata.removeAt(-1);
  }

  CommisionRateCancel(){
    this.InfluencerCommisionRate=[]
    $('#Edit-Influencer-Commission-Rate').modal('hide');
  }

  CommisionRateApply(){
    if(this.CommisionRateForm.controls.CommisionRate.status != "INVALID"){
      const data = {
        productId:this.SelectedInfluRateId,
        influencerspromoters:this.CommisionRateForm.value.CommisionRate
      }
      this._ActiveListingsService.CommisionRateUpdate(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.GetActiveListingData()
          $('#Edit-Influencer-Commission-Rate').modal('hide');
        }
      }) 
    }else{
      this.CommisionRateForm.get('CommisionRate').markAllAsTouched();
    }
  }

  editCell(item:any){
    this._SharedService.GetEditListItem(item)
     this.router.navigate(['/addproduct']);
  }

  DuplicateListing(item:any){
    const data ={
      productId:item._id
    }
    console.log(data,"duplicatelistingdata")
    this._ActiveListingsService.duplicatelisting(data).subscribe((res:any)=>{
      if(res.status == 201){
        this._SharedService.successToast("Duplicate Listing Successfully")
        this.GetActiveListingData()
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  SelectcloseListing(item:any){
    this.SelectedCloseListing = item
  }

  closeListing(){
    const data ={
      productId:this.SelectedCloseListing._id,
      productStatus: 2
    }
    this._ActiveListingsService.ActiveCloseListing(data).subscribe((res:any)=>{

      if(res.status == 200){
        this._SharedService.successToast(res.message)
        this.GetActiveListingData()
      }
    })
    // this.ActiveListingList.forEach((element:any) => {
    //   if(element._id == this.SelectedCloseListing._id){
    //     return element.isListing = false
    //   }
    // });
  }

  CancelListing(){
    $('#close-listing').modal('hide');
  }

  //for pagination
  SelectItemsPerPage(event:any){
    this.limit = event.target.value
    this.GetActiveListingData()
  }
  onFirst(){
    if(this.hasPrevPage  == true){
      this.PageNo = 1
      this.GetActiveListingData()
    }
  }

  onPrevious(){
    if(this.hasPrevPage  == true){
      this.PageNo = this.prevPage
      this.GetActiveListingData()
    }
  }

  onNext(){
    if(this.hasNextPage  == true){
      this.PageNo = this.nextPage
      this.GetActiveListingData()
    }
  }

  onLast(){
    if(this.hasNextPage  == true){
      this.PageNo = this.totalPages
      this.GetActiveListingData()
    }
  }


  ngOnDestroy(){
    this.Activelistunsubscribe.unsubscribe();
    this._ProductListingService.SetSelectedField("Product ID");
    this._ProductListingService.SetActiveListingscount({});
  }
}