import { Component, OnInit } from '@angular/core';
import { Select2OptionData } from 'ng-select2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserprofileService } from '../userprofile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { SharedService } from 'src/app/main/shared/shared.service';

@Component({
  selector: 'app-brand-details',
  templateUrl: './brand-details.component.html',
  styleUrls: ['./brand-details.component.css']
})
export class BrandDetailsComponent implements OnInit {
  public brandownwer:any = Array<Select2OptionData>();
  public authenticitydocuments:any = Array<Select2OptionData>();
  branddetailsmain = true;
  branddetailscreate = false;
  formdata = new FormData();
  fileInfo: string;
  fileInfoauthenticity:string;
  today = new Date();
  BrandDetailsBySeller:any;

  constructor(private _SharedService:SharedService,private _UserprofileService:UserprofileService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
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
    this._UserprofileService.getBrandDetailsBySeller().subscribe(res=>{
      const response:any = res;
      if(response.status === 200){
        this.BrandDetailsBySeller = response.data[0];
        console.log(this.BrandDetailsBySeller,"this.BrandDetailsBySeller");
      }else{
        this._SharedService.errorToast(response.message);
      }
    },(err)=>{
      console.log(err);
    });
  }

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
  });

  async brandapply(data:any){
    if(data.valid){
      let brandowners:any = false;
      if(data.value.brandowners == "Yes"){
        brandowners = true;
      }else{
        brandowners = false;
      }
      let markdate = moment(data.value.markapplicationdate).format("YYYY-MM-DD");
      this.formdata.append("brandName",data.value.barndname);
      this.formdata.append("isBrandOwner",brandowners);
      this.formdata.append("docName",data.value.brandauthenticity);
      this.formdata.append("trademarkAppNo",data.value.trademarkapplication);
      this.formdata.append("trademarkClass",data.value.trademarkclass);
      this.formdata.append("trademarkAppDate",markdate);
      this.formdata.append("brandWebsiteLink",data.value.brandwebsitelink);
      await this._UserprofileService.addBrand(this.formdata).subscribe(res=>{
        const response:any = res;
        if(response.status === 201){
          this._SharedService.successToast("Brand details created");
          this._UserprofileService.getBrandDetailsBySeller().subscribe(res=>{
            const response:any = res;
            if(response.status === 200){
              this.BrandDetailsBySeller = response.data[0];
              this.branddetailsmain = true;
              this.branddetailscreate = false;
            }else{
              this._SharedService.errorToast(response.message);
            }
          },(err)=>{
            console.log(err);
          });
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
