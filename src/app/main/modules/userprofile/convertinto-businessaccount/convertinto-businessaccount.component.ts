import { Component, OnInit,SecurityContext,ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Select2OptionData } from 'ng-select2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignaturePad } from 'angular2-signaturepad';
import { validateBasis } from '@angular/flex-layout';
import { SharedService } from 'src/app/main/shared/shared.service';
import { UserprofileService } from '../userprofile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-convertinto-businessaccount',
  templateUrl: './convertinto-businessaccount.component.html',
  styleUrls: ['./convertinto-businessaccount.component.css']
})
export class ConvertintoBusinessaccountComponent implements OnInit {
  brandinfo = false;
  public businesstype:any = Array<Select2OptionData>();
  public addresscountry:any = Array<Select2OptionData>();
  public bankstatement:any = Array<Select2OptionData>();
  formdatastore = new FormData();
  bankdetails = new FormData();
  fileInfo: string;
  fileInfobusiness: string;
  fileInfoGST: string;
  fileInfoTan: string;
  ChequePassbook: string;
  AccountStatement:string;
  Signaturedetails:string;
  uploadaccountstatementmetho:string;
  uploadaccountstatement:boolean;
  uploadaccountstatementseconds:boolean;
  uploadaccountstatement2:boolean;
  uploadaccountstatement3:boolean;
  uploadaccountstatement4:boolean;
  uploadaccountstatement5:boolean;
  signaturePadboolean:boolean = false;
  signaturePadimg:any = '';
  imageName:any = '';
  imageFile:any = '';
  storedetailsdata:any;
  business_addressupdate:boolean = false;
  pickup_addressupdate:boolean = false;
  uploadtanstatement:boolean = false;
  BusinessTab = false;
  GSTNTab = false;
  BankDetailsTab = false;
  BusinessAddressTab = false;
  SignatureTab = false;
  statuscodecheck:number; 

  constructor(
    private _SharedService:SharedService,
    private _UserprofileService:UserprofileService,
    private spinner: NgxSpinnerService,
    private _authentication:AuthenticationService,
    private _router:Router,
    private sanitizer:DomSanitizer
  ){}

  ngOnInit(): void {
    this._UserprofileService.getStoreStatus().subscribe((res:any)=>{
      this.statuscodecheck = res.storeStatus;
      if(res.storeStatus === 1){
          this._SharedService.InfoToast("Your account is converted to bussiness account please login again.")
          setTimeout(() => {
            this._authentication.logout();
            this._router.navigate(['/accounts/login']);
          }, 3000);
        }
    },err=>{
      console.log(err,"log err")
    })
    this.businesstype = [
      {
        id: 'Proprietor',
        text: 'Proprietor'
      },
      {
        id: 'Poland',
        text: 'Poland'
      },
      {
        id: 'Partnership Firm',
        text: 'Partnership Firm'
      },
      {
        id: 'Private Limited Company',
        text: 'Private Limited Company'
      },
      {
        id: 'Public Limited Company',
        text: 'Public Limited Company'
      }
    ]
    this.addresscountry = [
      {
        id: 'India',
        text: 'India'
      },
      {
        id: 'Poland',
        text: 'Poland'
      },
      {
        id: 'Canada',
        text: 'Canada'
      },
      {
        id: 'USA',
        text: 'USA'
      }
    ]
    this.bankstatement = [
      {
        id: 'basic2',
        text: 'Rent agreement'
      },
      {
        id: 'GST certificate',
        text: 'GST certificate'
      },
      {
        id: 'Any government address Proof',
        text: 'Any government address Proof'
      },
      {
        id: 'Electricity bill',
        text: 'Electricity bill'
      },
      {
        id: 'Telephone / mobile bill',
        text: 'Telephone / mobile bill'
      },
      {
        id: 'Bank account',
        text: 'Bank account'
      }
    ]
    this.gstn_details.get('donthavetan').valueChanges.subscribe((val:any) => {
      if (val === true ) {
        this.gstn_details.controls['tannumber'].clearValidators();
        this.gstn_details.controls['tanfileupload'].clearValidators();
        if(!this.gstn_details.value.tanfileupload){
          this.uploadtanstatement = false;
        }else{
          this.uploadtanstatement = true;
        }
      } else {
        this.gstn_details.controls['tannumber'].setValidators([Validators.required,Validators.minLength(10), Validators.maxLength(10)]);
        this.gstn_details.controls['tanfileupload'].setValidators([Validators.required]);
        if(!this.gstn_details.value.tanfileupload){
          this.uploadtanstatement = true;
        }else{
          this.uploadtanstatement = false;
        }
      }
      this.gstn_details.controls['tannumber'].updateValueAndValidity();
      this.gstn_details.controls['tanfileupload'].updateValueAndValidity();
    });
  }

  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 3,
    'canvasWidth': 535,
    'canvasHeight': 200
  };

  ngAfterViewInit() {
    this.signaturePad.set('minWidth', 3);
  }

  drawComplete() {
    this.signaturePadimg = this.signaturePad.toDataURL();
    // console.log(this.signaturePad.toDataURL());
  }

  drawStart() {
    console.log('begin drawing');
  }

  creardrawpad(){
    this.signaturePad.clear();
  }

  signaturePadevent(){
    console.log(this.signaturePadboolean,"signaturePadboolean");
  }

  // Store Details Find Next
  storenext(){
    $('#StoreDetails .nav-item > .nav-link.active').parent("#StoreDetails li.nav-item").next('li.nav-item').find('a.nav-link').trigger('click');
  }

  storeback(){
    $('#StoreDetails .nav-item > .nav-link.active').parent("#StoreDetails li.nav-item").prev('li.nav-item').find('a.nav-link').trigger('click');
  }

  get f1(){
    return this.business_details;
  }

  get f2(){
    return this.gstn_details;
  }

  get f3(){
    return this.bank_details;
  }

  get f4(){
    return this.business_address;
  }

  // get f5(){
  //   return this.signaturesection;
  // }

  business_details:any = new FormGroup({
    legalnamebusiness: new FormControl(undefined,[Validators.required]),
    businesstype: new FormControl('',[Validators.required]),
    personalpan: new FormControl(undefined,[Validators.required,Validators.minLength(10), Validators.maxLength(10)]),
    businesspan: new FormControl(undefined,[Validators.required,Validators.minLength(10), Validators.maxLength(10)]),
    personalpanfileupload: new FormControl(undefined,[Validators.required]),
    businesspanfileupload: new FormControl(undefined,[Validators.required]),
  });

  gstn_details:any = new FormGroup({
    gstnumber: new FormControl(undefined,[Validators.required,Validators.minLength(15), Validators.maxLength(15)]),
    gstfileupload: new FormControl(undefined,[Validators.required]),
    tannumber: new FormControl(undefined,[Validators.required,Validators.minLength(10), Validators.maxLength(10)]),
    tanfileupload: new FormControl(undefined,[Validators.required]),
    donthavetan: new FormControl(false),
  });

  bank_details:any = new FormGroup({
    accountholdername: new FormControl(undefined,[Validators.required]),
    accountnumber: new FormControl(undefined,[Validators.required,Validators.pattern('[0-9]{9,18}')]),
    ifsccode: new FormControl(undefined,[Validators.required,Validators.pattern('^[A-Z]{4}[0][A-Z0-9]{6}')]),
    bankname: new FormControl(undefined,[Validators.required]),
    uploadchequepassbookcopy: new FormControl(undefined,[Validators.required]),
    payoneerid: new FormControl(undefined),
    paypalid: new FormControl(undefined)
  });

  business_address:any = new FormGroup({
    addressname: new FormControl(undefined,[Validators.required]),
    streetapartment: new  FormControl(undefined,[Validators.required]),
    addresscity: new FormControl(undefined,[Validators.required]),
    address_state: new FormControl(undefined,[Validators.required]),
    address_pinzip: new FormControl(undefined,[Validators.required,Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]),
    address_country: new FormControl('',[Validators.required]),
    address_proof:new FormControl(),
    uploadaccountstatement: new FormControl(undefined,[Validators.required]),
    pickupAddress: new FormControl(),
    pickupAddressarea: new FormControl(),
    pickupAddresscity: new FormControl(),
    pickupAddressprovince: new FormControl(),
    pickupAddresspinzip: new FormControl(),
    pickupAddresscountry: new FormControl()
  });

  // signaturesection:any = new FormGroup({
  //   uploadsignature: new FormControl(undefined),
  // });

  storenext1(data:any){
    const imagesnamefile = `${data.value.legalnamebusiness}signature.png`;
    this.imageName = imagesnamefile.replace(/\s+/g, '');
    if(!this.business_details.value.personalpanfileupload){
      this.uploadaccountstatement = true;
    }else{
      this.uploadaccountstatement = false;
    }
    if(!this.business_details.value.businesspanfileupload){
      this.uploadaccountstatementseconds = true;
    }else{
      this.uploadaccountstatementseconds = false;
    }
    if(data.valid){
      this.BusinessTab = true;
      this.formdatastore.append('businessName',data.value.legalnamebusiness == ''? data.value.legalnamebusiness : this.sanitizer.sanitize(SecurityContext.HTML, data.value.legalnamebusiness));
      this.formdatastore.append('businessType',data.value.businesstype == ''? data.value.businesstype : this.sanitizer.sanitize(SecurityContext.HTML, data.value.businesstype));
      this.formdatastore.append('personalPAN',data.value.personalpan == ''? data.value.personalpan : this.sanitizer.sanitize(SecurityContext.HTML, data.value.personalpan));
      this.formdatastore.append('businessPAN',data.value.businesspan == ''? data.value.businesspan : this.sanitizer.sanitize(SecurityContext.HTML, data.value.businesspan));
      $('#StoreDetails .nav-item > .nav-link.active').parent("#StoreDetails li.nav-item").next('li.nav-item').find('a.nav-link').trigger('click');
    }else{
      this.BusinessTab = false;
      this.business_details.markAllAsTouched();
    }
  }

  storenext2(data:any){
    if(!this.gstn_details.value.gstfileupload){
      this.uploadaccountstatement2 = true;
    }else{
      this.uploadaccountstatement2 = false;
    }
    if(!this.gstn_details.value.tanfileupload){
      this.uploadtanstatement = true;
    }else{
      this.uploadtanstatement = false;
    }
    if(data.valid){
      this.GSTNTab = true;
      this.formdatastore.append('gstNumber',data.value.gstnumber == ''? data.value.gstnumber : this.sanitizer.sanitize(SecurityContext.HTML, data.value.gstnumber));
      this.formdatastore.append('TANNumber',data.value.tannumber == ''? data.value.tannumber : this.sanitizer.sanitize(SecurityContext.HTML, data.value.tannumber));
      this.formdatastore.append('isTANAvailable',data.value.donthavetan);
      $('#StoreDetails .nav-item > .nav-link.active').parent("#StoreDetails li.nav-item").next('li.nav-item').find('a.nav-link').trigger('click');
    }else{
      this.GSTNTab = false;
      this.gstn_details.markAllAsTouched();
    }
  }

  storenext3(data:any){
    if(!this.bank_details.value.uploadchequepassbookcopy){
      this.uploadaccountstatement3 = true;
    }else{
      this.uploadaccountstatement3 = false;
    }
    if(data.valid){
      this.BankDetailsTab = true;
      // console.log(data.value.uploadchequepassbookcopy);
      // console.log(data, "form data");
      this.bankdetails.append('accountHolderName', data.value.accountholdername == ''? data.value.accountholdername : this.sanitizer.sanitize(SecurityContext.HTML, data.value.accountholdername));
      this.bankdetails.append('accountNumber', data.value.accountnumber == ''? data.value.accountnumber : this.sanitizer.sanitize(SecurityContext.HTML, data.value.accountnumber));
      this.bankdetails.append('IFSCCode',data.value.ifsccode == ''? data.value.ifsccode : this.sanitizer.sanitize(SecurityContext.HTML, data.value.ifsccode));
      this.bankdetails.append('bankName',data.value.bankname == ''? data.value.bankname : this.sanitizer.sanitize(SecurityContext.HTML, data.value.bankname));
      this.bankdetails.append('payoneerId',data.value.payoneerid == ''? data.value.payoneerid : this.sanitizer.sanitize(SecurityContext.HTML, data.value.payoneerid));
      this.bankdetails.append('paypalId',data.value.paypalid == ''? data.value.paypalid : this.sanitizer.sanitize(SecurityContext.HTML, data.value.paypalid));
      $('#StoreDetails .nav-item > .nav-link.active').parent("#StoreDetails li.nav-item").next('li.nav-item').find('a.nav-link').trigger('click');
    }else{
      this.BankDetailsTab = true;
      this.bank_details.markAllAsTouched();
    }
  }

  storenext4(data:any){
    if(!this.business_address.value.uploadaccountstatement){
      this.uploadaccountstatement4 = true;
    }else{
      this.uploadaccountstatement4 = false;
    }
    if(data.valid){
      this.BusinessAddressTab = true;
      this.formdatastore.append('businessAddress[countryCode]', data.value.v == ''? data.value.v : this.sanitizer.sanitize(SecurityContext.HTML, data.value.v));
      this.formdatastore.append('businessAddress[pincode]',data.value.address_pinzip);
      this.formdatastore.append('businessAddress[state]', data.value.address_state == ''? data.value.address_state : this.sanitizer.sanitize(SecurityContext.HTML, data.value.address_state));
      this.formdatastore.append('businessAddress[city]', data.value.addresscity == ''? data.value.addresscity : this.sanitizer.sanitize(SecurityContext.HTML, data.value.addresscity));
      this.formdatastore.append('businessAddress[address]', data.value.addressname == ''? data.value.addressname : this.sanitizer.sanitize(SecurityContext.HTML, data.value.addressname));
      this.formdatastore.append('businessAddress[street]', data.value.streetapartment == ''? data.value.streetapartment : this.sanitizer.sanitize(SecurityContext.HTML, data.value.streetapartment));
      this.formdatastore.append('proof', data.value.address_proof == ''? data.value.address_proof : this.sanitizer.sanitize(SecurityContext.HTML, data.value.address_proof));
      this.formdatastore.append('pickupAddress[address]', data.value.pickupAddress == ''? data.value.pickupAddress : this.sanitizer.sanitize(SecurityContext.HTML, data.value.pickupAddress));
      this.formdatastore.append('pickupAddress[street]', data.value.pickupAddressarea == ''? data.value.pickupAddressarea : this.sanitizer.sanitize(SecurityContext.HTML, data.value.pickupAddressarea));
      this.formdatastore.append('pickupAddress[city]', data.value.pickupAddresscity == ''? data.value.pickupAddresscity : this.sanitizer.sanitize(SecurityContext.HTML, data.value.pickupAddresscity));
      this.formdatastore.append('pickupAddress[state]', data.value.pickupAddressprovince == ''? data.value.pickupAddressprovince : this.sanitizer.sanitize(SecurityContext.HTML, data.value.pickupAddressprovince));
      this.formdatastore.append('pickupAddress[pincode]',data.value.pickupAddresspinzip);
      this.formdatastore.append('pickupAddress[countryCode]', data.value.pickupAddresscountry == ''? data.value.pickupAddresscountry : this.sanitizer.sanitize(SecurityContext.HTML, data.value.pickupAddresscountry));
      $('#StoreDetails .nav-item > .nav-link.active').parent("#StoreDetails li.nav-item").next('li.nav-item').find('a.nav-link').trigger('click');
    }else{
      this.BusinessAddressTab = false;
      this.business_address.markAllAsTouched();
    }
  }

  async finalsubmit(){
     if(this.imageFile !== ''){
      this.SignatureTab = true;
      this.formdatastore.append('signature',this.imageFile);
      if(this.BusinessTab && this.GSTNTab && this.BankDetailsTab && this.BusinessAddressTab && this.SignatureTab){
        this.spinner.show();
        await this._UserprofileService.addBankDetail(this.bankdetails).subscribe(res=>{
          const response:any = res;
          this.formdatastore.append('bankDetailId',response.data._id);
          if(response.status === 201){
            this._UserprofileService.storescreate(this.formdatastore).subscribe(res=>{
              console.log(res,"response data for stores");
              this.spinner.hide();
              this.business_details.reset();
              this.gstn_details.reset();
              this.bank_details.reset();
              this.business_address.reset();
              this._UserprofileService.getStoreDetailsBySeller().subscribe(res=>{
                const responsea:any = res;
                if(responsea.status === 200){
                  this.brandinfo = true;
                   this._UserprofileService.getBankDetail().subscribe(res=>{
                    const bankdetails:any = res;
                    const bankdetailsmain = {
                      "bankDetail":bankdetails.data
                    }
                    this.storedetailsdata = {...responsea.data,...bankdetailsmain};
                  },(err)=>{
                    console.log(err,"err");
                    this.spinner.hide();
                  });
                }else{
                  this.brandinfo = false;
                }
              },(err)=>{
                console.log(err, "err getStoreDetailsBySeller");
                this.spinner.hide();
              });
            },(err)=>{
              console.log(err);
              this.spinner.hide();
            });
          }
        },(err)=>{
          console.log(err);
          this.spinner.hide();
        })
      }else{
        this._SharedService.errorToast('All Field Required...');  
      }
    }else{
      this.SignatureTab = false;
      this._SharedService.errorToast('Signatur Required...');
    }
    // if(!this.signaturesection.value.uploadsignature){
    //   this.uploadaccountstatement5 = true;
    // }else{
    //   this.uploadaccountstatement5 = false;
    // }
    // if(data.valid){
    //   console.log(data,"form data");
    // }else{
    //   this.signaturesection.markAllAsTouched();
    // }
  }

  useshippingaddress(data:any){
    console.log(data.valid,"data.valid");
    if(data.valid){
      this.formdatastore.append('pickupAddress[isDefaultShippingAddress]',`${true}`);
      this.business_address.patchValue({
        pickupAddress: this.sanitizer.sanitize(SecurityContext.HTML, data.value.addressname),
        pickupAddressarea: this.sanitizer.sanitize(SecurityContext.HTML, data.value.streetapartment),
        pickupAddresscity: this.sanitizer.sanitize(SecurityContext.HTML, data.value.addresscity),
        pickupAddresscountry: this.sanitizer.sanitize(SecurityContext.HTML, data.value.address_country),
        pickupAddresspinzip:data.value.address_pinzip,
        pickupAddressprovince: this.sanitizer.sanitize(SecurityContext.HTML, data.value.address_state)
      });
    };
  };

  signaturepadevent(){
    this.signaturePadboolean =! this.signaturePadboolean
    if(this.signaturePadboolean != false){
      const base64 = this.signaturePadimg;
      const imageBlob = this.dataURItoBlob(base64);
      this.imageFile = new File([imageBlob], this.imageName, { type: 'image/png' });
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
      this.Signaturedetails = `${this.imageFile.name} (${formatBytes(this.imageFile.size)})`;
    }
  };

  dataURItoBlob(dataURI:any) {
    var byteCharacters = atob(dataURI.replace(/^data:image\/(png|jpeg|jpg|pdf);base64,/, ''));
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([ byteArray ], {
       type : undefined
    });
    return blob;
  }

  onFileSelectpan(input: any): void {
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
    this.formdatastore.append('personalPANFile',file);
    this.fileInfo = `${file.name} (${formatBytes(file.size)})`;
  }

  onFileSelectBusiness(input: any): void {
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
    const files = input.files[0];
    this.formdatastore.append('businessPANFile',files);
    this.fileInfobusiness = `${files.name} (${formatBytes(files.size)})`;
  }

  onFileSelectgst(input: any): void {
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
    const files = input.files[0];
    this.formdatastore.append('gstFile',files);
    this.fileInfoGST = `${files.name} (${formatBytes(files.size)})`;
  }

  onFileSelecttan(input: any): void {
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

    const files = input.files[0];
    this.formdatastore.append('TANFile',files);
    this.fileInfoTan = `${files.name} (${formatBytes(files.size)})`;
  }

  onFileSelectChequePassbook(input: any): void {
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

    const files = input.files[0];
    this.bankdetails.append('chequePassbookFile',files);
    this.ChequePassbook = `${files.name} (${formatBytes(files.size)})`;
  }

  onFileSelectaccountstatement(input: any): void {
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

    const files = input.files[0];
    this.formdatastore.append('addressProofFile',files);
    this.AccountStatement = `${files.name} (${formatBytes(files.size)})`;
  }

  onFileSelectSignature(input:any): void {
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
    const files = input.files[0];
    this.Signaturedetails = `${files.name} (${formatBytes(files.size)})`;
  }

  registerbusiness(storedetailsdata:any){
    this.business_addressupdate = true;
    this.business_address.patchValue({
      addressname: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.businessAddress.address),
      streetapartment: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.businessAddress.street),
      addresscity: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.businessAddress.city),
      address_state: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.businessAddress.state),
      address_pinzip:storedetailsdata.businessAddress.pincode,
      address_country: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.businessAddress.countryCode),
    });
  }

  async addressupdatesave(f4:any){
    if(f4.value.address_country != undefined && f4.value.addressname != null && f4.value.addressname != '' && f4.value.address_pinzip != null && f4.value.address_pinzip != '' && f4.value.address_state != null && f4.value.address_state != '' &&
      f4.value.addresscity != null && f4.value.addresscity != '' && f4.value.streetapartment != null && f4.value.streetapartment != ''){
      this.business_addressupdate = false;
      this.storedetailsdata.businessAddress.address = this.business_address.value['addressname'];
      this.storedetailsdata.businessAddress.street = this.business_address.value['streetapartment'];
      this.storedetailsdata.businessAddress.city = this.business_address.value['addresscity'];
      this.storedetailsdata.businessAddress.state = this.business_address.value['address_state'];
      this.storedetailsdata.businessAddress.pincode = this.business_address.value['address_pinzip'];
      this.storedetailsdata.businessAddress.countryCode = this.business_address.value['address_country'];

      let data = {
        "businessAddress": {
          "address": this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value['addressname']),
          "street": this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value['streetapartment']),
          "city": this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value['addresscity']),
          "state": this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value['address_state']),
          "pincode":this.business_address.value['address_pinzip'],
          "countryCode": this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value['address_country'])
        }
      }

      await this._UserprofileService.updateStoreBusinessAddres(data).subscribe(res=>{
        const response:any = res;
        this._SharedService.successToast(response.message);
      },(err)=>{
        console.log(err,"err");
      });
    }else{
      this.business_address.markAllAsTouched();
      this._SharedService.errorToast("Validation required");
    }
  }

  pickupregisterbusiness(storedetailsdata:any){
    this.pickup_addressupdate = true;
    this.business_address.patchValue({
      pickupAddress: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.pickupAddress.address),
      pickupAddressarea: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.pickupAddress.street),
      pickupAddresscity: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.pickupAddress.city),
      pickupAddressprovince: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.pickupAddress.state),
      pickupAddresspinzip:storedetailsdata.pickupAddress.pincode,
      pickupAddresscountry: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.pickupAddress.countryCode),
    });
  }

  async pickupaddressupdatesave(f4:any){
    if(f4.value['pickupAddresscountry'] != undefined && f4.value['pickupAddresspinzip'] != null && f4.value['pickupAddresspinzip'] != '' && f4.value['pickupAddressprovince'] != null &&
      f4.value['pickupAddressprovince'] != '' && f4.value['pickupAddress'] != null && f4.value['pickupAddress'] != '' && f4.value['pickupAddresscity'] != null && f4.value['pickupAddresscity'] != '' && f4.value['pickupAddressarea'] != null && f4.value['pickupAddressarea'] != ''){
      this.pickup_addressupdate = false;
      this.storedetailsdata.pickupAddress.address = this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value['pickupAddress']);
      this.storedetailsdata.pickupAddress.street = this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value['pickupAddressarea']);
      this.storedetailsdata.pickupAddress.city = this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value['pickupAddresscity']);
      this.storedetailsdata.pickupAddress.state = this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value['pickupAddressprovince']);
      this.storedetailsdata.pickupAddress.pincode = this.business_address.value['pickupAddresspinzip'];
      this.storedetailsdata.pickupAddress.countryCode = this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value['pickupAddresscountry']);

      let data = {
        "pickupAddress": {
          "address":  this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value['pickupAddress']),
          "street": this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value['pickupAddressarea']),
          "city": this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value['pickupAddresscity']),
          "state": this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value['pickupAddressprovince']),
          "pincode":this.business_address.value['pickupAddresspinzip'],
          "countryCode": this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value['pickupAddresscountry'])
        }
      }

      await this._UserprofileService.updateStorePickupAddres(data).subscribe(res=>{
        const response:any = res;
        this._SharedService.successToast(response.message);
      },(err)=>{
        console.log(err,"err");
      });
    }else{
      this._SharedService.errorToast("Validation required");
    }

  }

}
