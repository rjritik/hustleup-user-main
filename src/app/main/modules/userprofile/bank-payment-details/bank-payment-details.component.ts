import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/main/shared/shared.service';
import { BankPaymentDetailsService } from './bank-payment-details.service';

@Component({
  selector: 'app-bank-payment-details',
  templateUrl: './bank-payment-details.component.html',
  styleUrls: ['./bank-payment-details.component.css']
})
export class BankPaymentDetailsComponent implements OnInit{
  uploadaccountstatement:boolean
  bankDetailCreate = false;
  bankpaymentdetails = true;
  bankDetailExists:boolean = false;
  bankDetailStatus:number |undefined;
  Filenameshow:boolean = false;
  BankPassbookFileName:any;
  BankDetailFormData:any = new FormData();
  chequePassbookFile:any;
  spinnerShow:boolean = false;
  bankDetailList:any;
  UploadedChequePassbookUrl:any;
  isUpdate:boolean = false;
  ifscVerifiedDetail:any;
  reason:any;

  BankDetailForm:any = new FormGroup({
    accountHolderName: new FormControl(undefined,[Validators.required]),
    accountNumber: new FormControl(undefined,[Validators.required,Validators.pattern('[0-9]{9,18}')]),
    IFSCCode: new FormControl(undefined,[Validators.required,Validators.pattern('^[A-Z]{4}[0][A-Z0-9]{6}')]),
    branch: new FormControl(undefined,[Validators.required]),
    address: new FormControl(undefined,[Validators.required]),
    bankName: new FormControl(undefined,[Validators.required]),
    payoneerId: new FormControl(undefined),
    paypalId: new FormControl(undefined)
  });

  get f() {
    return this.BankDetailForm;
  }

  constructor(
    private _bankPaymentDetailService:BankPaymentDetailsService,
    private _SharedService: SharedService,
    private sanitizer:DomSanitizer
  ) { }

  ngOnInit(): void {
    this.GetBankPaymentDetail();
  } 

  GetBankPaymentDetail(){
    const data = {
      bankDetailType:"personal"
    }
    this._bankPaymentDetailService.GetBankPaymentList(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.bankDetailList = res.data
        this.UploadedChequePassbookUrl = res.data.chequePassbookFile
        this.bankDetailExists = true;
        this.bankDetailStatus = res.data.status;
        this.reason = undefined;
        if(this.bankDetailStatus == 2){
          // this.reason =res.data.reason 
          this.reason ="Your Image does not match with holdername"
          this.EditBusinessDetail(this.bankDetailList);
        }
      }else if (res.status == 404){
        this.bankDetailExists = false;
      }else{
        this._SharedService.errorToast(res.message);
      }
    })
  }

  verifyIfscCode(IFSCCode:any){
    if(IFSCCode.length === 11){
      this._bankPaymentDetailService.verifyIfscCode(IFSCCode.trim()).subscribe((res:any)=>{
        this.ifscVerifiedDetail = res;
        this.BankDetailForm.patchValue({
          branch: res.BRANCH,
          address: res.ADDRESS,
          bankName: res.BANK
        });
      })
    }else{
      this.ifscVerifiedDetail = undefined;
      this.BankDetailForm.patchValue({
        branch: undefined,
        bankName: undefined,
        address: undefined
      });
    }
  }

  onFileSelectChequePassbook(event: any): void {
    this.chequePassbookFile = undefined;
    if(event.target.files.length > 0) {
      this.chequePassbookFile = event.target.files[0];
      this.BankPassbookFileName = `${this.chequePassbookFile.name} (${this.formatBytes(this.chequePassbookFile.size)})`;
    }
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

  AddBankDetail(f:any){
    if(!this.chequePassbookFile){
      this.uploadaccountstatement = true;
    }else{
      this.uploadaccountstatement = false;
    }
    if(f.valid && this.chequePassbookFile){
      this.spinnerShow = true;
      this.BankDetailFormData.append("bankDetailType", "personal");
      this.BankDetailFormData.append('chequePassbookFile',this.chequePassbookFile);
      this.BankDetailFormData.append("accountHolderName", this.sanitizer.sanitize(SecurityContext.HTML, f.value.accountHolderName));
      this.BankDetailFormData.append("accountNumber", this.sanitizer.sanitize(SecurityContext.HTML, f.value.accountNumber));
      this.BankDetailFormData.append("IFSCCode", this.sanitizer.sanitize(SecurityContext.HTML, f.value.IFSCCode));
      this.BankDetailFormData.append("bankName", this.sanitizer.sanitize(SecurityContext.HTML, f.value.bankName));
      if(f.value.payoneerId) this.BankDetailFormData.append("payoneerId", this.sanitizer.sanitize(SecurityContext.HTML, f.value.payoneerId));
      if(f.value.paypalId) this.BankDetailFormData.append("paypalId", this.sanitizer.sanitize(SecurityContext.HTML, f.value.paypalId));
      this._bankPaymentDetailService.addBankPaymenDetail(this.BankDetailFormData).subscribe((res:any)=>{
        this.spinnerShow = false;
        this.deleteAppendedData();
        if(res.status === 201){
          this._SharedService.successToast("BankDetail added Successfully");
          this.BankDetailForm.reset();
          this.chequePassbookFile = undefined;
          this.BankPassbookFileName = undefined;
          this.bankDetailStatus = res.data.status;
          this.bankpaymentdetails = true;
          this.bankDetailCreate = false;
          this.bankDetailExists = true;
        }else{
          this._SharedService.errorToast(res.message);
        }
      });
    }else{
      this.BankDetailForm.markAllAsTouched();
      setTimeout(() => {
        $("input.ng-pristine.ng-invalid.ng-touched").parent('button').css({"border":"1px solid red"});
      }, 100);
    }

  }

  AddPaymentDetails(){
    this.isUpdate = false;
    this.bankpaymentdetails = false;
    this.bankDetailCreate = true;
  }

  BankDetailsCancel(){
    this.BankDetailForm.reset();
    this.chequePassbookFile = undefined;
    this.BankPassbookFileName = undefined;
    this.bankpaymentdetails = true;
    this.bankDetailCreate = false;
    this.isUpdate = !this.isUpdate;
  }

  EditBusinessDetail(item:any){
    this.bankpaymentdetails = false;
    this.bankDetailCreate = true;
    this.isUpdate = true;
    this.BankDetailForm.patchValue({
      accountHolderName: item.accountHolderName,
      accountNumber: item.accountNumber,
      IFSCCode: item.IFSCCode,
      payoneerId: item.payoneerId,
      paypalId: item.paypalId
    });
    this.verifyIfscCode(item.IFSCCode);
    this.UploadedChequePassbookUrl = item.chequePassbookFile;
  }

  UpdateBankDetail(f:any){
    if(!this.UploadedChequePassbookUrl){
      this.uploadaccountstatement = true;
    }else{
      this.uploadaccountstatement = false;
    }
    if(f.valid && this.UploadedChequePassbookUrl){
      this.spinnerShow = true;
      this.BankDetailFormData.append("bankDetailType", "personal");
      if(this.chequePassbookFile) this.BankDetailFormData.append('chequePassbookFile',this.chequePassbookFile);
      this.BankDetailFormData.append("accountHolderName", this.sanitizer.sanitize(SecurityContext.HTML, f.value.accountHolderName));
      this.BankDetailFormData.append("accountNumber", this.sanitizer.sanitize(SecurityContext.HTML, f.value.accountNumber));
      this.BankDetailFormData.append("IFSCCode", this.sanitizer.sanitize(SecurityContext.HTML, f.value.IFSCCode));
      this.BankDetailFormData.append("bankName", this.sanitizer.sanitize(SecurityContext.HTML, f.value.bankName));
      if(f.value.payoneerId) this.BankDetailFormData.append("payoneerId", this.sanitizer.sanitize(SecurityContext.HTML, f.value.payoneerId));
      if(f.value.paypalId) this.BankDetailFormData.append("paypalId", this.sanitizer.sanitize(SecurityContext.HTML, f.value.paypalId));
      this._bankPaymentDetailService.updateBankPaymenDetail(this.BankDetailFormData).subscribe((res:any)=>{
        this.spinnerShow = false;
        this.deleteAppendedData();
        if(res.status === 200){
          this._SharedService.successToast(res.message);
          this.BankDetailForm.reset();
          this.chequePassbookFile = undefined;
          this.BankPassbookFileName = undefined;
          this.bankDetailStatus = 0;
          this.bankpaymentdetails = true;
          this.bankDetailCreate = false;
          this.bankDetailExists = true;
        }else{
          this._SharedService.errorToast(res.message);
        }
      });
    }else{
      this.BankDetailForm.markAllAsTouched();
      setTimeout(() => {
        $("input.ng-pristine.ng-invalid.ng-touched").parent('button').css({"border":"1px solid red"});
      }, 100);
    }
  }

  deleteAppendedData(){
    this.BankDetailFormData.delete("accountHolderName");
    this.BankDetailFormData.delete("accountNumber");
    this.BankDetailFormData.delete("IFSCCode");
    this.BankDetailFormData.delete("bankName");
    this.BankDetailFormData.delete("payoneerId");
    this.BankDetailFormData.delete("paypalId");
    this.BankDetailFormData.delete("bankDetailType");
    this.BankDetailFormData.delete("chequePassbookFile");
  }

}
