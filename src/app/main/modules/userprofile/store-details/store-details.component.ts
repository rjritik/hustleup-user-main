import { Component, OnInit,SecurityContext,ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Select2OptionData } from 'ng-select2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignaturePad } from 'angular2-signaturepad';
import { SharedService } from 'src/app/main/shared/shared.service';
import { UserprofileService } from '../userprofile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/main/auth/service';
import { getParamByISO } from 'iso-country-currency';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
  selector: 'app-store-details',
  templateUrl: './store-details.component.html',
  styleUrls: ['./store-details.component.css']
})
export class StoreDetailsComponent implements OnInit {
  public businessType:any = Array<Select2OptionData>();
  public addressProofList:any = Array<Select2OptionData>();
  public stateList:any = Array<Select2OptionData>();
  public cityList:any = Array<Select2OptionData>();
  storeStatus:number |undefined;;
  brandinfo = false;
  formdatastore = new FormData();
  fileInfo: string;
  fileInfobusiness: string;
  fileInfoGST: string;
  fileInfoTan: string;
  ChequePassbook: string;
  AccountStatement:string;
  Signaturedetails:string;
  uploadaccountstatement:boolean;
  uploadBusinessPanStatement:boolean;
  uploadaccountstatement2:boolean;
  uploadaccountstatement3:boolean;
  uploadaccountstatement4:boolean;
  uploadaccountstatement5:boolean;
  signaturePadboolean:boolean = false;
  signaturePadImg:any = '';
  imageName:any = '';
  imageFile:any = '';
  storedetailsdata:any;
  uploadtanstatement:boolean = false;
  business_addressupdate:boolean = false;
  pickup_addressupdate:boolean = false;
  businessDetailsUpdate:boolean = false;
  bankDetailsUpdate:boolean = false;
  gstDetailsUpdate:boolean = false;
  signatureUpdate:boolean = false;
  BusinessTab = false;
  GSTNTab = false;
  BankDetailsTab = false;
  BusinessAddressTab = false;
  SignatureTab = false;
  personalPANFile:any;
  businessPANFile:any;
  gstFile:any;
  TANFile:any;
  chequePassbookFile:any;
  addressProofFile:any;
  useDefaultShippingAddress:boolean = false;
  ifscVerifiedDetail:any;
  selectedStateName:any;
  selectedCityName:any;
  pinCodeCheckValid:boolean = false;
  pinCodeCheckRepeat:number;
  countryName:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'countryName');


  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 3,
    'canvasWidth': 450,
    'canvasHeight': 200
  };

  business_details:any = new FormGroup({
    businessName: new FormControl(undefined,[Validators.required]),
    businessType: new FormControl('',[Validators.required]),
    personalpan: new FormControl(undefined,[Validators.required,Validators.minLength(10), Validators.maxLength(10)]),
    personalpanfileupload: new FormControl(undefined,[Validators.required]),
    businesspan: new FormControl(undefined,[Validators.required,Validators.minLength(10), Validators.maxLength(10)]),
  });

  gstn_details:any = new FormGroup({
    gstnumber: new FormControl(undefined,[Validators.required,Validators.minLength(15), Validators.maxLength(15)]),
    gstfileupload: new FormControl(undefined,[Validators.required]),
    tannumber: new FormControl(undefined,[Validators.required,Validators.minLength(10), Validators.maxLength(10)]),
    donthavetan: new FormControl(false),
  });

  bank_details:any = new FormGroup({
    accountholdername: new FormControl(undefined,[Validators.required]),
    accountnumber: new FormControl(undefined,[Validators.required,Validators.pattern('[0-9]{9,18}')]),
    IFSCCode: new FormControl(undefined,[Validators.required,Validators.pattern('^[A-Z]{4}[0][A-Z0-9]{6}')]),
    bankName: new FormControl(undefined,[Validators.required]),
    branch: new FormControl(undefined,[Validators.required]),
    address: new FormControl(undefined,[Validators.required]),
    uploadchequepassbookcopy: new FormControl(undefined,[Validators.required]),
    payoneerid: new FormControl(undefined),
    paypalid: new FormControl(undefined)
  });

  business_address:any = new FormGroup({
    addressname: new FormControl(undefined,[Validators.required]),
    streetapartment: new FormControl(undefined,[Validators.required]),
    addresscity: new FormControl(undefined,[Validators.required]),
    address_state: new FormControl(undefined,[Validators.required]),
    address_pinzip: new FormControl(undefined,[Validators.required,Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]),
    address_country: new FormControl(undefined,[Validators.required]),
    address_proof:new FormControl('',[Validators.required]),
    uploadaccountstatement: new FormControl(undefined,[Validators.required]),
  });

  pickup_address:any = new FormGroup({
    pickupAddress: new FormControl(undefined,[Validators.required]),
    pickupAddressarea: new FormControl(undefined,[Validators.required]),
    pickupAddressprovince: new FormControl('',[Validators.required]),
    pickupAddresscity: new FormControl('',[Validators.required]),
    pickupAddresspinzip: new FormControl(undefined,[Validators.required,Validators.pattern('^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$')]),
    pickupAddresscountry: new FormControl('',[Validators.required]),
  });

  constructor(
    private _SharedService:SharedService,
    private _UserprofileService:UserprofileService,
    private _AuthenticationService:AuthenticationService,
    private spinner: NgxSpinnerService,
    private sanitizer:DomSanitizer
  ){}

  ngOnInit(): void {
    this.businessType = [
      {
        id: 'Proprietor',
        text: 'Proprietor'
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
    this.addressProofList = [
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

    this.business_address.patchValue({
      address_country:this.countryName
    })
    this.pickup_address.patchValue({
      pickupAddresscountry:this.countryName
    })
    // this.getStateList(101); //   #country_id 101 is for india. you will get all states in india.
    this.GetStoreDatailBySeller();
    this.gstDetailValueChanged();
    this.businessTypeValueChanged();
    this.businessAddressValueChanged();
  }

  ngAfterViewInit() {
    if(this.signaturePad) this.signaturePad.set('minWidth', 3);
  }
  
  GetStoreDatailBySeller(){
    this._UserprofileService.getStoreDetailsBySeller().subscribe(async (res:any)=>{
      if(res.status === 200){
        this.storedetailsdata = res.data
        await this.GetStoreStatus();
      }else if(res.status === 404){
        this.brandinfo = false;
      }else{
      }
    },(err)=>{
      console.log(err, "err getStoreDetailsBySeller");
    });
  }

  GetStoreStatus(){
    this._UserprofileService.getStoreStatus().subscribe((res:any)=>{
      if(res.status === 200){
        this.storeStatus = res.storeStatus;
        if(this.storeStatus == 1) {
          this.brandinfo = true;
          this.getBankDetailBySeller();
        }
      }else{
        this._SharedService.errorToast(res.message);
      }
    },(err)=>{
      console.log(err,"log err")
    })
  }

  getBankDetailBySeller(){
    this._UserprofileService.getBankDetail().subscribe((bankDetailResponse:any)=>{
      if(bankDetailResponse.status == 200){
        const bankdetailsmain = {
          "bankDetail":bankDetailResponse.data
        }
        this.storedetailsdata = {...this.storedetailsdata,...bankdetailsmain};
      }
    },(err)=>{
      console.log(err,"err");
    });
  }

  businessTypeValueChanged(){
    this.business_details.get('businessType').valueChanges.subscribe((val:any) => {
      if(val =="Proprietor"){
        this.business_details.controls['businesspan'].clearValidators();
        this.business_details.controls['businesspan'].setValue(undefined);
        this.businessPANFile = undefined;
        this.fileInfobusiness = '';
      }else {
        this.business_details.controls['businesspan'].setValidators([Validators.required,Validators.minLength(10), Validators.maxLength(10)]);
      }
      this.business_details.controls['businesspan'].updateValueAndValidity();
    });
  }

  gstDetailValueChanged(){
    this.gstn_details.get('donthavetan').valueChanges.subscribe((val:any) => {
      if (val === true ){
        this.gstn_details.controls['tannumber'].clearValidators();
        this.gstn_details.controls['tannumber'].setValue(undefined);
        this.TANFile = undefined;
        this.fileInfoTan = '';
      } else {
        this.gstn_details.controls['tannumber'].setValidators([Validators.required,Validators.minLength(10), Validators.maxLength(10)]);
      }
      this.gstn_details.controls['tannumber'].updateValueAndValidity();
    });
  }

  businessAddressValueChanged(){
    this.business_address.valueChanges.subscribe((form:any) => {
      if(this.useDefaultShippingAddress == true){
        if(this.business_address.valid == false){
          this.useDefaultShippingAddress = false;
          this.pickup_address.reset();
        }
      }
    });
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

  get f5(){
    return this.pickup_address;
  }

  storeback(){
    $('#StoreDetails .nav-item > .nav-link.active').parent("#StoreDetails li.nav-item").prev('li.nav-item').find('a.nav-link').trigger('click');
  }

  formatBytes(bytes: number): string {
    const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const factor = 1024;
    let index = 0;

    while (bytes >= factor) {
      bytes /= factor;
      index++;
    }
    return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
  }


  onFileSelectpan(input: any): void {
    this.personalPANFile = undefined;
    if(input.files.length > 0) {
      this.personalPANFile = input.files[0];
      this.fileInfo = `${this.personalPANFile.name} (${this.formatBytes(this.personalPANFile.size)})`;
    }
  }

  onFileSelectBusiness(event: any): void {
    this.businessPANFile = undefined;
    if(event.target.files.length > 0) {
      this.businessPANFile = event.target.files[0];
      this.fileInfobusiness = `${this.businessPANFile.name} (${this.formatBytes(this.businessPANFile.size)})`;
    }
  }

  
  storenext1(){    
    if(!this.business_details.value.personalpanfileupload){
      this.uploadaccountstatement = true;
    }else{
      this.uploadaccountstatement = false;
    }

    if(!this.businessPANFile){
      this.uploadBusinessPanStatement = true;
    }else{
      this.uploadBusinessPanStatement = false;
    }
    if(this.business_details.valid){
      if(this.business_details.controls.businessType.value == 'Proprietor'){
        this.BusinessTab = true;
        $('#StoreDetails .nav-item > .nav-link.active').parent("#StoreDetails li.nav-item").next('li.nav-item').find('a.nav-link').trigger('click');
        return true;
      }else if(this.business_details.controls.businessType.value !== 'Proprietor'){
        if(this.businessPANFile){
          this.BusinessTab = true;
          $('#StoreDetails .nav-item > .nav-link.active').parent("#StoreDetails li.nav-item").next('li.nav-item').find('a.nav-link').trigger('click');
          return true;
        }else{
          this.uploadBusinessPanStatement = true;
          return false;
        }
      }
    }else{
      this.BusinessTab = false;
      this.business_details.markAllAsTouched();
      return false;
    }
  }

  onFileSelectgst(input: any): void {
    this.gstFile = undefined;
    if(input.files.length > 0) {
      this.gstFile = input.files[0];
      this.fileInfoGST = `${this.gstFile.name} (${this.formatBytes(this.gstFile.size)})`;
    }
  }

  onFileSelecttan(event: any): void {
    this.TANFile = undefined;
    if(event.target.files.length > 0) {
      this.TANFile = event.target.files[0];
      this.fileInfoTan = `${this.TANFile.name} (${this.formatBytes(this.TANFile.size)})`;
    }
  }

  storenext2(){
    if(!this.gstn_details.value.gstfileupload){
      this.uploadaccountstatement2 = true;
    }else{
      this.uploadaccountstatement2 = false;
    }
    if(!this.TANFile){
      this.uploadtanstatement = true;
    }else{
      this.uploadtanstatement = false;
    }
    if(this.gstn_details.valid && this.gstFile){
      this.GSTNTab = true;
      if(this.gstn_details.value.donthavetan){
        $('#StoreDetails .nav-item > .nav-link.active').parent("#StoreDetails li.nav-item").next('li.nav-item').find('a.nav-link').trigger('click');
        return true;
      }else if(!this.gstn_details.value.donthavetan){
        if(this.TANFile){
          $('#StoreDetails .nav-item > .nav-link.active').parent("#StoreDetails li.nav-item").next('li.nav-item').find('a.nav-link').trigger('click');
          return true;
        }else{
          this.uploadtanstatement = true;
          return false;
        }
      }
    }else{
      this.GSTNTab = false;
      this.gstn_details.markAllAsTouched();
      return false;
    }
  }

  verifyIfscCode(IFSCCode:any){
    if(IFSCCode.length === 11){
      this._UserprofileService.verifyIfscCode(IFSCCode.trim()).subscribe((res:any)=>{
        this.ifscVerifiedDetail = res;
        this.bank_details.patchValue({
          branch: res.BRANCH,
          address: res.ADDRESS,
          bankName: res.BANK
        });
      })
    }else{
      this.ifscVerifiedDetail = undefined;
      this.bank_details.patchValue({
        branch: undefined,
        bankName: undefined,
        address: undefined
      });
    }
  }

  onFileSelectChequePassbook(input: any): void {
    this.chequePassbookFile = undefined;
    if(input.files.length > 0) {
      this.chequePassbookFile = input.files[0];
      this.ChequePassbook = `${this.chequePassbookFile.name} (${this.formatBytes(this.chequePassbookFile.size)})`;
    }
  }

  storenext3(){
    if(!this.bank_details.value.uploadchequepassbookcopy){
      this.uploadaccountstatement3 = true;
    }else{
      this.uploadaccountstatement3 = false;
    }
    if(this.bank_details.valid && this.chequePassbookFile){
      this.BankDetailsTab = true;
      $('#StoreDetails .nav-item > .nav-link.active').parent("#StoreDetails li.nav-item").next('li.nav-item').find('a.nav-link').trigger('click');
      return true;
    }else{
      this.BankDetailsTab = true;
      this.bank_details.markAllAsTouched();
      return false;
    }
  }

  onFileSelectaccountstatement(input: any): void {
    this.addressProofFile = undefined;
    if(input.files.length > 0) {
      this.addressProofFile = input.files[0];
      this.AccountStatement = `${this.addressProofFile.name} (${this.formatBytes(this.addressProofFile.size)})`;
    }
    console.log('addressProofFile',this.addressProofFile);
  }

  storenext4(){
    if(!this.business_address.value.uploadaccountstatement){
      this.uploadaccountstatement4 = true;
    }else{
      this.uploadaccountstatement4 = false;
    }
    if(this.business_address.valid && this.pickup_address.valid && this.addressProofFile){
      this.BusinessAddressTab = true;
      // const selectedStateArray = this.stateList.filter((item:any)=>{ return item.id == this.pickup_address.value.pickupAddressprovince });
      // if(selectedStateArray.length > 0) this.selectedStateName = selectedStateArray[0].text;
      const selectedCityArray = this.cityList.filter((item:any)=>{ return item.id == this.pickup_address.value.pickupAddresscity });
      if(selectedCityArray.length > 0) this.selectedCityName = selectedCityArray[0].text;
      $('#StoreDetails .nav-item > .nav-link.active').parent("#StoreDetails li.nav-item").next('li.nav-item').find('a.nav-link').trigger('click');
      return true;
    }else{
      this.BusinessAddressTab = false;
      this.business_address.markAllAsTouched();
      this.pickup_address.markAllAsTouched();
      return false;
    }
  }

  registerbusiness(storedetailsdata:any){
    this.business_addressupdate = true;
    this.business_address.patchValue({
      addressname: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.businessAddress.address),
      streetapartment: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.businessAddress.street),
      addresscity: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.businessAddress.city),
      address_state: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.businessAddress.state),
      address_pinzip: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.businessAddress.pincode),
      address_country: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.businessAddress.countryCode),
    });
  }

  useAsShippingAddress(event:any,data:any){
    this.useDefaultShippingAddress = event.target.checked
    if(data.valid && event.target.checked){
      this.pickup_address.patchValue({
        pickupAddress: this.sanitizer.sanitize(SecurityContext.HTML, data.value.addressname),
        pickupAddressarea: this.sanitizer.sanitize(SecurityContext.HTML, data.value.streetapartment),
        pickupAddresscity: this.sanitizer.sanitize(SecurityContext.HTML, data.value.addresscity),
        pickupAddresscountry: this.sanitizer.sanitize(SecurityContext.HTML, data.value.address_country),
        pickupAddresspinzip: this.sanitizer.sanitize(SecurityContext.HTML, data.value.address_pinzip),
        pickupAddressprovince: this.sanitizer.sanitize(SecurityContext.HTML, data.value.address_state)
      });
    }else{
      this.pickup_address.reset();
    }
  };

  async addressupdatesave(){
    if(this.business_address.value.address_country != undefined && this.business_address.value.addressname != null && this.business_address.value.addressname != '' && this.business_address.value.address_pinzip != null && this.business_address.value.address_pinzip != '' && this.business_address.value.address_state != null && this.business_address.value.address_state != '' &&
      this.business_address.value.addresscity != null && this.business_address.value.addresscity != '' && this.business_address.value.streetapartment != null && this.business_address.value.streetapartment != ''){
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
      await this._UserprofileService.updateStoreBusinessAddres(data).subscribe((res:any)=>{
        if(res.status == 200){
          this._SharedService.successToast(res.message);
        }else{
          this._SharedService.errorToast(res.message);
        }
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
    this.pickup_address.patchValue({
      pickupAddress: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.pickupAddress.address),
      pickupAddressarea: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.pickupAddress.street),
      pickupAddresscity: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.pickupAddress.city),
      pickupAddressprovince: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.pickupAddress.state),
      pickupAddresspinzip: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.pickupAddress.pincode),
      pickupAddresscountry: this.sanitizer.sanitize(SecurityContext.HTML, storedetailsdata.pickupAddress.countryCode),
    });
  }

  async pickupaddressupdatesave(f5:any){
    if(f5.value['pickupAddresscountry'] != undefined && f5.value['pickupAddresspinzip'] != null && f5.value['pickupAddresspinzip'] != '' && f5.value['pickupAddressprovince'] != null &&
      f5.value['pickupAddressprovince'] != '' && f5.value['pickupAddress'] != null && f5.value['pickupAddress'] != '' && f5.value['pickupAddresscity'] != null && f5.value['pickupAddresscity'] != '' && f5.value['pickupAddressarea'] != null && f5.value['pickupAddressarea'] != ''){
      this.pickup_addressupdate = false;
      this.storedetailsdata.pickupAddress.address = this.sanitizer.sanitize(SecurityContext.HTML, this.pickup_address.value['pickupAddress']);
      this.storedetailsdata.pickupAddress.street = this.sanitizer.sanitize(SecurityContext.HTML, this.pickup_address.value['pickupAddressarea']);
      this.storedetailsdata.pickupAddress.city = this.sanitizer.sanitize(SecurityContext.HTML, this.pickup_address.value['pickupAddresscity']);
      this.storedetailsdata.pickupAddress.state = this.sanitizer.sanitize(SecurityContext.HTML, this.pickup_address.value['pickupAddressprovince']);
      this.storedetailsdata.pickupAddress.pincode = this.pickup_address.value['pickupAddresspinzip'];
      this.storedetailsdata.pickupAddress.countryCode = this.sanitizer.sanitize(SecurityContext.HTML, this.pickup_address.value['pickupAddresscountry']);

      let data = {
        "pickupAddress": {
          "address":  this.sanitizer.sanitize(SecurityContext.HTML, this.pickup_address.value['pickupAddress']),
          "street": this.sanitizer.sanitize(SecurityContext.HTML, this.pickup_address.value['pickupAddressarea']),
          "city": this.sanitizer.sanitize(SecurityContext.HTML, this.pickup_address.value['pickupAddresscity']),
          "state": this.sanitizer.sanitize(SecurityContext.HTML, this.pickup_address.value['pickupAddressprovince']),
          "pincode":this.pickup_address.value['pickupAddresspinzip'],
          "countryCode": this.sanitizer.sanitize(SecurityContext.HTML, this.pickup_address.value['pickupAddresscountry'])
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

  saveSignature(){
    if(this.signaturePadImg){
      this.signaturePadboolean = true
      const base64 = this.signaturePadImg;
      const imageBlob = this.dataURItoBlob(base64);
      this.imageFile = new File([imageBlob], this.getRandomFileName(), { type: 'image/png' });
      this._SharedService.successToast("your Signature saved successfully");
    }else{
      this._SharedService.errorToast("create Your signature");
    }
  };

  getRandomFileName(){
    var timestamp = new Date().toISOString().replace(/[-:.]/g,"");  
    var random = ("" + Math.random()).substring(2, 8); 
    var random_number = timestamp+random;  
    return random_number;
  }

  updateSignature(){
    this.signaturePadboolean = false;
  }

  drawComplete(){
    this.signaturePadImg = this.signaturePad.toDataURL();
  }

  async finalsubmit(){
    if(this.imageFile !== ''){
      this.SignatureTab = true;
      if(this.storenext1() && this.storenext2() && this.storenext3() && this.storenext4()){
        this.spinner.show();
        this.deleteStoreAppendData();
        this.createStoreAppendData();
        this._UserprofileService.storescreate(this.formdatastore).subscribe((res:any)=>{
          this.spinner.hide();
          if(res.status === 201){
            this.business_details.reset();
            this.gstn_details.reset();
            this.bank_details.reset();
            this.business_address.reset();
            this.GetStoreDatailBySeller();
          }else if(res.status == 202){
            this._SharedService.InfoToast(res.message);
          }else{
            this._SharedService.errorToast(res.message);
          }
        },(err)=>{
          console.log(err);
          this.spinner.hide();
        });
      }else{
        this._SharedService.InfoToast('Something is pending, please check all tabs and resubmit again.');  
        if(!this.storenext1()){
          this.storenext1();
        }
        if(!this.storenext2()){
          this.storenext2()
        }
        if(!this.storenext3()){
          this.storenext3()
        }
        if(!this.storenext4()){
          this.storenext4()
        }
      }
    }else{
      this.SignatureTab = false;
      this._SharedService.errorToast('Signature Required...');
    }
  }

  createStoreAppendData(){
    this.formdatastore.append('businessName',this.business_details.value.businessName == ''? this.business_details.value.businessName : this.sanitizer.sanitize(SecurityContext.HTML, this.business_details.value.businessName));
    this.formdatastore.append('businessType',this.business_details.value.businessType == ''? this.business_details.value.businessType : this.sanitizer.sanitize(SecurityContext.HTML, this.business_details.value.businessType));
    this.formdatastore.append('personalPAN',this.business_details.value.personalpan == ''? this.business_details.value.personalpan : this.sanitizer.sanitize(SecurityContext.HTML, this.business_details.value.personalpan));
    this.formdatastore.append('personalPANFile',this.personalPANFile);
    this.formdatastore.append('businessPAN',this.business_details.value.businesspan == ''? this.business_details.value.businesspan : this.sanitizer.sanitize(SecurityContext.HTML, this.business_details.value.businesspan));
    this.formdatastore.append('businessPANFile',this.businessPANFile);

    this.formdatastore.append('gstNumber',this.gstn_details.value.gstnumber == ''? this.gstn_details.value.gstnumber : this.sanitizer.sanitize(SecurityContext.HTML, this.gstn_details.value.gstnumber));
    this.formdatastore.append('gstFile',this.gstFile);
    this.formdatastore.append('TANNumber',this.gstn_details.value.tannumber == ''? this.gstn_details.value.tannumber : this.sanitizer.sanitize(SecurityContext.HTML, this.gstn_details.value.tannumber));
    this.formdatastore.append('TANFile',this.TANFile);
    this.formdatastore.append('isTANAvailable',this.gstn_details.value.donthavetan);

    this.formdatastore.append("bankDetailType", "business");
    this.formdatastore.append('accountHolderName', this.bank_details.value.accountholdername == ''? this.bank_details.value.accountholdername : this.sanitizer.sanitize(SecurityContext.HTML, this.bank_details.value.accountholdername));
    this.formdatastore.append('accountNumber', this.bank_details.value.accountnumber == ''? this.bank_details.value.accountnumber : this.sanitizer.sanitize(SecurityContext.HTML, this.bank_details.value.accountnumber));
    this.formdatastore.append('IFSCCode',this.bank_details.value.IFSCCode == ''? this.bank_details.value.IFSCCode : this.sanitizer.sanitize(SecurityContext.HTML, this.bank_details.value.IFSCCode));
    this.formdatastore.append('bankName',this.bank_details.value.bankName == ''? this.bank_details.value.bankName : this.sanitizer.sanitize(SecurityContext.HTML, this.bank_details.value.bankName));
    this.formdatastore.append('chequePassbookFile',this.chequePassbookFile);
    if(this.bank_details.value.payoneerid) this.formdatastore.append('payoneerId',this.bank_details.value.payoneerid == ''? this.bank_details.value.payoneerid : this.sanitizer.sanitize(SecurityContext.HTML, this.bank_details.value.payoneerid));
    if(this.bank_details.value.paypalid) this.formdatastore.append('paypalId',this.bank_details.value.paypalid == ''? this.bank_details.value.paypalid : this.sanitizer.sanitize(SecurityContext.HTML, this.bank_details.value.paypalid));

    this.formdatastore.append('businessAddress[address]', this.business_address.value.addressname == ''? this.business_address.value.addressname : this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value.addressname));
    this.formdatastore.append('businessAddress[street]', this.business_address.value.streetapartment == ''? this.business_address.value.streetapartment : this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value.streetapartment));
    this.formdatastore.append('businessAddress[stateName]', this.business_address.value.address_state == ''? this.business_address.value.address_state : this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value.address_state));
    this.formdatastore.append('businessAddress[cityName]', this.business_address.value.addresscity == ''? this.business_address.value.addresscity : this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value.addresscity));
    this.formdatastore.append('businessAddress[pincode]',this.business_address.value.address_pinzip);
    this.formdatastore.append('businessAddress[countryCode]', this.business_address.value.address_country == ''? this.business_address.value.address_country : this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value.address_country));
    this.formdatastore.append('proof', this.business_address.value.address_proof == ''? this.business_address.value.address_proof : this.sanitizer.sanitize(SecurityContext.HTML, this.business_address.value.address_proof));
    this.formdatastore.append('addressProofFile',this.addressProofFile);
    
    this.formdatastore.append('pickupAddress[isDefaultShippingAddress]',`${true}`)
    this.formdatastore.append('pickupAddress[address]', this.pickup_address.value.pickupAddress == ''? this.pickup_address.value.pickupAddress : this.sanitizer.sanitize(SecurityContext.HTML, this.pickup_address.value.pickupAddress));
    this.formdatastore.append('pickupAddress[street]', this.pickup_address.value.pickupAddressarea == ''? this.pickup_address.value.pickupAddressarea : this.sanitizer.sanitize(SecurityContext.HTML, this.pickup_address.value.pickupAddressarea));
    this.formdatastore.append('pickupAddress[stateName]', this.selectedStateName);
    this.formdatastore.append('pickupAddress[state_id]', this.pickup_address.value.pickupAddressprovince == ''? this.pickup_address.value.pickupAddressprovince : this.sanitizer.sanitize(SecurityContext.HTML, this.pickup_address.value.pickupAddressprovince));
    this.formdatastore.append('pickupAddress[cityName]', this.selectedCityName);
    this.formdatastore.append('pickupAddress[city_id]', this.pickup_address.value.pickupAddresscity == ''? this.pickup_address.value.pickupAddresscity : this.sanitizer.sanitize(SecurityContext.HTML, this.pickup_address.value.pickupAddresscity));
    this.formdatastore.append('pickupAddress[pincode]',this.pickup_address.value.pickupAddresspinzip);
    this.formdatastore.append('pickupAddress[countryCode]', this._AuthenticationService.currentUserValue.countryCode );
    this.formdatastore.append('pickupAddress[country_id]', `${101}`);
    this.formdatastore.append('signature',this.imageFile);
  }

  deleteStoreAppendData(){
    this.formdatastore.delete('businessName');
    this.formdatastore.delete('businessType');
    this.formdatastore.delete('personalPAN');
    this.formdatastore.delete('personalPANFile');
    this.formdatastore.delete('businessPAN');
    this.formdatastore.delete('businessPANFile');

    this.formdatastore.delete('gstNumber');
    this.formdatastore.delete('gstFile');
    this.formdatastore.delete('TANNumber');
    this.formdatastore.delete('TANFile');
    this.formdatastore.delete('isTANAvailable');

    this.formdatastore.delete('bankDetailType');
    this.formdatastore.delete('accountHolderName');
    this.formdatastore.delete('accountNumber');
    this.formdatastore.delete('IFSCCode');
    this.formdatastore.delete('bankName');
    this.formdatastore.delete('chequePassbookFile');
    this.formdatastore.delete('payoneerId');
    this.formdatastore.delete('paypalId');

    this.formdatastore.delete('businessAddress[address]');
    this.formdatastore.delete('businessAddress[street]');
    this.formdatastore.delete('businessAddress[stateName]');
    this.formdatastore.delete('businessAddress[cityName]');
    this.formdatastore.delete('businessAddress[pincode]');
    this.formdatastore.delete('businessAddress[countryCode]');
    this.formdatastore.delete('proof');
    this.formdatastore.delete('addressProofFile');

    this.formdatastore.delete('pickupAddress[isDefaultShippingAddress]');
    this.formdatastore.delete('pickupAddress[address]');
    this.formdatastore.delete('pickupAddress[street]');
    this.formdatastore.delete('pickupAddress[stateName]');
    this.formdatastore.delete('pickupAddress[state_id]');
    this.formdatastore.delete('pickupAddress[cityName]');
    this.formdatastore.delete('pickupAddress[city_id]');
    this.formdatastore.delete('pickupAddress[pincode]');
    this.formdatastore.delete('pickupAddress[countryCode]');
    this.formdatastore.delete('pickupAddress[country_id]');
    this.formdatastore.delete('signature');
  }

  businessDetailsEdit(data:any){
    console.log(data,"businessDetailsEdit - value");
    this.business_details.patchValue({
      businessName: data.businessName,
      businessType: data.businessType,
      personalpan: data.personalPAN,
    });
    if(data.businessPAN != 'null'){
      this.business_details.patchValue({
        businesspan: data.businessPAN,
      });
    }
    this.businessDetailsUpdate = true;
  }

  businessDetailsSave(){
    this.storenext1();
    console.log("businessDetailsSave");
  }

  gstDetailsEdit(data:any){
    this.gstDetailsUpdate = true;
    console.log(data,"gstDetailsEdit - value");
  }

  gstDetailsSave(){
    this.storenext2();
    console.log("gstDetailsSave");
  }

  bankDetailsEdit(data:any){
    this.bankDetailsUpdate = true;
    console.log(data,"bankDetailsEdit - value");
  }

  bankDetailsSave(){
    this.storenext3();
    console.log("bankDetailsSave");
  }

  updateSignatureAfterApprove(){
    this.signatureUpdate = true;
  }

  signatureSave(){
    console.log("signatureSave");
  }

  pinCodeCheck(){
    if(this.pickup_address.get('pickupAddresspinzip').status == 'VALID' && this.pinCodeCheckRepeat != this.pickup_address.value.pickupAddresspinzip){
      this.pinCodeCheckRepeat = this.pickup_address.value.pickupAddresspinzip;
      this._UserprofileService.checkPincode(this.pickup_address.value.pickupAddresspinzip).subscribe((res:any)=>{
        if(res.status === 200){
          this.pinCodeCheckValid = res.data.pickupAvailable;
          if(res.data.pickupAvailable){
            const tempArray:any = [];
            res.data.cityList.forEach((element:any) => {
              tempArray.push({
                id: element.id,
                text: element.city_name
              })
            });
            this.cityList = tempArray;
            this.pickup_address.patchValue({
              pickupAddressprovince:res.data.stateName,
              pickupAddresscity:res.data.cityId
            })
          }else{
            this.pickup_address.patchValue({
              pickupAddressprovince:undefined,
              pickupAddresscity:''
            })
            this.cityList = [];
            this._SharedService.errorToast("pickup services are not availble.")
          }
        }else{
          this._SharedService.errorToast(res.message)
        }
      },err=>{
        console.log(err,"err - value");
      });
    }else if(this.pinCodeCheckRepeat != this.pickup_address.value.pickupAddresspinzip){
      this.pinCodeCheckRepeat = this.pickup_address.value.pickupAddresspinzip;
      this.pinCodeCheckValid = false;
      this.cityList = [];
      this.pickup_address.patchValue({
        pickupAddressprovince:undefined,
        pickupAddresscity:''
      })
    }
  }
}