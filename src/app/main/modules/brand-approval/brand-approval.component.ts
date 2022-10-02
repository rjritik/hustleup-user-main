import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Select2OptionData } from 'ng-select2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserprofileService } from '../userprofile/userprofile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/main/shared/shared.service';
import { Router } from '@angular/router'
import * as moment from 'moment';
import { AuthenticationService } from '../../auth/service';


@Component({
  selector: 'app-brand-approval',
  templateUrl: './brand-approval.component.html',
  styleUrls: ['./brand-approval.component.css']
})
export class BrandApprovalComponent implements OnInit {
  public brandownwer:any = Array<Select2OptionData>();
  public authenticitydocuments:any = Array<Select2OptionData>();
  // public FinalCategoryList:any = Array<Select2OptionData>();
  // CategoryList:any = [];
  // public FinalSubCategoryList:any = Array<Select2OptionData>();
  // SubCategoryList:any = [];
  // public FinalProductTypeList:any = Array<Select2OptionData>();
  // ProductTypeList:any = [];
  branddetailsmain = true;
  branddetailscreate = false;
  formdata = new FormData();
  fileInfo: string;
  fileInfoauthenticity:string;
  today = new Date();
  BrandDetailsBySeller:any;
  // IsAvailCategory:boolean = false;
  // IsAvailSubCategory:boolean = false;

  constructor(private _SharedService:SharedService,
              private _UserprofileService:UserprofileService,
              private spinner:NgxSpinnerService, 
              private _router:Router,
              private _AuthenticationService:AuthenticationService,
              private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
      // this.FindCategory()
    
    this.brandownwer = [
      {
        id: 'Yes',
        text: 'Yes'
      },
      {
        id: 'No',
        text: 'No'
      },
    ],
    this.authenticitydocuments = [
      {
        id: 'Trademark Certificate',
        text: 'Trademark Certificate'
      },
      {
        id: 'Brand Authorization Letter',
        text: 'Brand Authorization Letter'
      },
      {
        id: 'Invoice',
        text: 'Invoice'
      },
      {
        id: 'Other Documents',
        text: 'Other Documents'
      },
    ]
    // this.GetBrandDetailBySeller()
  }

  // GetBrandDetailBySeller(){
  //   this._UserprofileService.getBrandDetailsBySeller().subscribe(res=>{
  //     const response:any = res;
  //     if(response.status === 200){
  //       this.BrandDetailsBySeller = response.data[0];
  //       console.log(this.BrandDetailsBySeller,"this.BrandDetailsBySeller");
  //     }else{
  //       this._SharedService.errorToast(response.message);
  //     }
  //   },(err)=>{
  //     console.log(err);
  //   });
  // }

  get f1(){
    return this.brandDetails;
  }

  brandDetails:any = new FormGroup({
    barndname: new FormControl(undefined,[Validators.required]),
    brandlogofile: new FormControl(undefined,[Validators.required]),
    brandwebsitelink: new FormControl(undefined,[Validators.required]),
    brandowners: new FormControl('',[Validators.required]),
    brandauthenticity: new FormControl('',[Validators.required]),
    BrandAuthenticityfile: new FormControl(undefined,[Validators.required]),
    trademarkapplication: new FormControl(undefined,[Validators.required]),
    trademarkclass: new FormControl(undefined,[Validators.required]),
    markapplicationdate: new FormControl(undefined,[Validators.required]),
    // category: new FormControl('',[Validators.required]),
    // subcategory: new FormControl('',[Validators.required]),
    // producttype: new FormControl('',[Validators.required]),
  });
  
  // FindCategory(){
  //   let currentUser = this._AuthenticationService.currentUserValue.countryCode;
  //   this._UserprofileService.findMenuCategory(currentUser).subscribe((res:any)=>{
  //     if(res.status == 200){
  //       this.CategoryList=[]
  //       res.data.forEach((ele:any) => {
  //         this.CategoryList.push({id:ele._id,text:ele.title})
  //       });
  //       this.FinalCategoryList = this.CategoryList
  //       console.log(this.CategoryList,"this.MenuCategoryList")
  //     } 
  //     if(res.status == 401) this._SharedService.errorToast(res.message);
  //     if(res.status == 404) this._SharedService.errorToast(res.message)
  //     if(res.status == 500) this._SharedService.errorToast(res.message)
  //   });
  // }

  // SelectCategory(id:any){
  //   const data = {
  //     menuCategoryId: id
  //   }
  //   this._UserprofileService.findMenuSubCategory(data).subscribe((res:any)=>{
  //     if(res.status == 200){
  //       this.SubCategoryList = []
  //       this.IsAvailCategory = true
  //       this.IsAvailSubCategory = false
  //       res.data.forEach((ele:any) => {
  //         this.SubCategoryList.push({id:ele._id,text:ele.title});
  //       });
  //       this.FinalSubCategoryList = this.SubCategoryList
  //     }
  //     if(res.status == 401) this._SharedService.errorToast(res.message);
  //     if(res.status == 404) this._SharedService.errorToast(res.message)
  //     if(res.status == 500) this._SharedService.errorToast(res.message)
      
  //   },(err)=>{
  //     console.log(err);
  //   });
  // }
  // SelectSubCategory(id:any){
  //   const data = {
  //     menuSubCategoryId:id
  //   }
  //   this._UserprofileService.findproductType(data).subscribe((res:any)=>{
  //     if(res.status == 200){
  //       this.ProductTypeList = []
  //       this.IsAvailCategory = true
  //       this.IsAvailSubCategory = true
  //       res.data.forEach((ele:any) => {
  //         this.ProductTypeList.push({id:ele._id,text:ele.title});
  //       });
  //       this.FinalProductTypeList = this.ProductTypeList
  //     }
  //     if(res.status == 401) this._SharedService.errorToast(res.message);
  //     if(res.status == 404) this._SharedService.errorToast(res.message)
  //     if(res.status == 500) this._SharedService.errorToast(res.message)
  //   },(err)=>{
  //     console.log(err);
  //   });
  // }

  async brandapply(data:any){
    if(data.valid){
      let brandowners:any = false;
      if(data.value.brandowners == "Yes"){
        brandowners = true;
      }else{
        brandowners = false;
      }
      let markdate = moment(data.value.markapplicationdate).format("YYYY-MM-DD");
      this.formdata.append("brandName", data.value.barndname == ''?data.value.barndname : this.sanitizer.sanitize(SecurityContext.HTML, data.value.barndname));
      this.formdata.append("isBrandOwner",brandowners);
      this.formdata.append("docName", data.value.brandauthenticity==''?data.value.brandauthenticity : this.sanitizer.sanitize(SecurityContext.HTML, data.value.brandauthenticity));
      this.formdata.append("trademarkAppNo", data.value.trademarkapplication=''?data.value.trademarkapplication : this.sanitizer.sanitize(SecurityContext.HTML, data.value.trademarkapplication));
      this.formdata.append("trademarkClass", data.value.trademarkclass =''?data.value.trademarkclass : this.sanitizer.sanitize(SecurityContext.HTML, data.value.trademarkclass));
      this.formdata.append("trademarkAppDate",markdate);
      this.formdata.append("brandWebsiteLink",data.value.brandwebsitelink =''?data.value.brandwebsitelink : this.sanitizer.sanitize(SecurityContext.HTML, data.value.brandwebsitelink));
      await this._UserprofileService.addBrand(this.formdata).subscribe(res=>{
        const response:any = res;
        if(response.status === 201){
          this._SharedService.successToast("Brand details created");
          this._router.navigate(['/addproduct']);
        }else{
          this._SharedService.errorToast(response.message);
        }
      },(err)=>{
        console.log(err,"brand err");
      });
    }else{
      this.brandDetails.markAllAsTouched();
      setTimeout(() => {
        $("input.ng-pristine.ng-invalid.ng-touched").siblings('.uploadfilename').css({"border":"1px solid red"});
      }, 100);
    }
  }

  onFileSelect(input: any): void {
    function formatBytes(bytes: number): string {
      const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const factor = 1024;
      let index = 0;
      while (bytes >= factor) {
        bytes /= factor;
        index++;
      }
      return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
    }
    const file = input.files[0];
    this.formdata.append('brandLogo',file);
    this.fileInfo = `${file.name} (${formatBytes(file.size)})`;
    $("input.ng-touched.ng-dirty.ng-valid").siblings('.uploadfilename').removeAttr("style");
  }

  onFileSelectBrand(input: any): void {
    function formatBytes(bytes: number): string {
      const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const factor = 1024;
      let index = 0;
      while (bytes >= factor) {
        bytes /= factor;
        index++;
      }
      return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
    }
    const file = input.files[0];
    this.formdata.append('docImage',file);
    this.fileInfoauthenticity = `${file.name} (${formatBytes(file.size)})`;
    $("input.ng-touched.ng-dirty.ng-valid").siblings('.uploadfilename').removeAttr("style");
  }

  addbrandinfo(){
    this.branddetailsmain = false;
    this.branddetailscreate = true;
  }

  brandcreatecancel(){
    this.branddetailsmain = true;
    this.branddetailscreate = false;
  }

}
