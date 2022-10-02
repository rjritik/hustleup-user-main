import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/main/shared/shared.service';
import { PantextDetailService } from './pantext-details.service';

@Component({
  selector: 'app-pantext-details',
  templateUrl: './pantext-details.component.html',
  styleUrls: ['./pantext-details.component.css']
})
export class PantextDetailsComponent implements OnInit {
  today = new Date()
  NotAvailPanDetail:boolean = true;
  PANTaxDetailsCreate = false;
  pandetailmain = true;
  PanFileName:any;
  Filenameshow:boolean = false;
  nameAsPerPAN:any;
  PANNummber:any;
  dateOfBirthAsPerPAN:any;
  fatherName:any;
  PANFile:any
  PanformData:any = new FormData();
  UploadPanStatement:boolean;
  constructor(private _PantextDetailService: PantextDetailService,
              private _SharedService: SharedService,
              private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this.GetPanDetail()
  }

  Panform: any = new FormGroup({
    PANNummber: new FormControl(undefined, [Validators.required,Validators.pattern("^[A-Z]{5}[0-9]{4}[A-Z]$")]),
    nameAsPerPAN: new FormControl(undefined, [Validators.required]),
    fatherName: new FormControl(undefined, [Validators.required]),
    dateOfBirthAsPerPAN: new FormControl(undefined, [Validators.required]),
    PANFile: new FormControl(undefined, [Validators.required]),
    panchkBox: new FormControl(undefined,[Validators.requiredTrue]),
  });

  get f() {
    return this.Panform;
  }

  async GetPanDetail() {
    await this._PantextDetailService.GetPanList().subscribe((res: any) => {
      if (res.status === 200) {
          this.nameAsPerPAN= res.data.nameAsPerPAN
          this.PANNummber = res.data.PANNummber
          this.dateOfBirthAsPerPAN = res.data.dateOfBirthAsPerPAN
          this.fatherName = res.data.fatherName
          this.PANFile = res.data.PANFile
          this.NotAvailPanDetail = false;
      }
    });
  }


  onFileInput(input: any): void {
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
   const files = input.target.files[0];
   this.PanformData.append("PANFile",files);
    this.PanFileName = `${files.name} (${formatBytes(files.size)})`;
    $("input.ng-touched.ng-dirty.ng-valid").parent('button').removeAttr("style");
  }

  async AddMyAddress(f:any){
    if(!f.value.PANFile){
      this.UploadPanStatement = true;
    }else{
      this.UploadPanStatement = false;
    }
    if(f.valid){
      let dateofbirth = new Date(f.value.dateOfBirthAsPerPAN);
      this.PanformData.append("PANNummber", this.sanitizer.sanitize(SecurityContext.HTML, f.value.PANNummber));
      this.PanformData.append("nameAsPerPAN", this.sanitizer.sanitize(SecurityContext.HTML, f.value.nameAsPerPAN));
      this.PanformData.append("fatherName", this.sanitizer.sanitize(SecurityContext.HTML, f.value.fatherName));
      this.PanformData.append("dateOfBirthAsPerPAN",dateofbirth);
     await  this._PantextDetailService.AddPanDetail(this.PanformData).subscribe((res:any)=>{
        if(res.status === 201){
          this.nameAsPerPAN= res.data.nameAsPerPAN
          this.PANNummber = res.data.PANNummber
          this.dateOfBirthAsPerPAN = res.data.dateOfBirthAsPerPAN
          this.fatherName = res.data.fatherName
          this.PANFile = res.data.PANFile
          this._SharedService.successToast("PAN Detail added Successfully");
          this.PANTaxDetailsCreate = false;
          this.pandetailmain = true;
          this.NotAvailPanDetail = false;
        }
      });
    }else{
      this.Panform.markAllAsTouched();
      setTimeout(() => {
        $("input.ng-pristine.ng-invalid.ng-touched").parent('button').css({"border":"1px solid red"});
      }, 100);
    }

  }

  AddPanDetail(){
    this.PANTaxDetailsCreate = true;
    this.pandetailmain = false;
  }

  PanDetailCancel(){
    this.PANTaxDetailsCreate = false;
    this.pandetailmain = true;
  }

}
