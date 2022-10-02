import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { CoffeeCollectionService } from './coffee-collection.service';

@Component({
  selector: 'app-coffee-collection',
  templateUrl: './coffee-collection.component.html',
  styleUrls: ['./coffee-collection.component.css'],
})
export class CoffeeCollectionComponent implements OnInit {
  CoffeeList:any=[];
  LargePrivillageValue: any = '';
  MediumPrivillageValue: any = '';
  SmallPrivillageValue: any = '';
  SmallPrivillageBrdr:boolean = false;
  MadiumPrivillageBrdr:boolean = false;
  LargePrivillageBrdr:boolean = false;
  SmallPrivillage:any = [];
  MediumPrivillage:any = [];
  LargePrivillage:any = [];
  IsCoffeeEnable:boolean;
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');

  constructor(private _CoffeeCollectionService:CoffeeCollectionService,
              private _SharedService:SharedService,
              private _AuthenticationService:AuthenticationService,
              private sanitizer:DomSanitizer) {}

  ngOnInit(): void {
     this.GetAllCoffee()
    this.GetAllPriviledge()
  }

  EnableDisableCoffee(checked:any) {
    if(checked.target.checked == true){
      const data = {
        isCoffeeEnable:true
      }
      this._CoffeeCollectionService.enabledisableCoffee(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.IsCoffeeEnable = true
          this._SharedService.successToast(res.message)
        }
        if(res.status == 500){
          this._SharedService.errorToast(res.message)
        }
      })
    }
    if(checked.target.checked == false){
      const data = {
        isCoffeeEnable:false
      }
      this._CoffeeCollectionService.enabledisableCoffee(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.IsCoffeeEnable = false
          this._SharedService.successToast(res.message)
        }
        if(res.status == 500){
          this._SharedService.errorToast(res.message)
        }
      })
    }
   
  }

  GetAllCoffee(){
    let data ={
      countryCode: this.sanitizer.sanitize(SecurityContext.HTML , this._AuthenticationService.currentUserValue.countryCode)
    }
    this._CoffeeCollectionService.getAllCoffee(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.CoffeeList = res.data
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 404){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  GetAllPriviledge(){
    this._CoffeeCollectionService.getallcoffeeprivilege().subscribe((res:any)=>{
      if(res.status == 200){
        res.data.forEach((element:any) => {
          if(element.coffeeType == "Small"){
            this.SmallPrivillage = element.items
          }
          if(element.coffeeType == "Medium"){
            this.MediumPrivillage = element.items
          }
          if(element.coffeeType == "Large"){
            this.LargePrivillage = element.items
          }
        });
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  AddSmallPrivillage() {
    if (this.SmallPrivillageValue != '') {
      let data ={
        coffeeType:"Small",
        privilege: this.sanitizer.sanitize(SecurityContext.HTML, this.SmallPrivillageValue)
      }
      this._CoffeeCollectionService.addcoffeePrivilege(data).subscribe((res:any)=>{
        if(res.status == 201){
          this._SharedService.successToast(res.message)
          this.GetAllPriviledge()
          this.SmallPrivillageBrdr = false;
          this.SmallPrivillageValue = '';
        }
        if(res.status == 500){
          this._SharedService.errorToast(res.message)
        }
        if(res.status == 401){
          this._SharedService.errorToast(res.message)
        }
      })
    }else{
      this.SmallPrivillageBrdr = true;
    }

  }
  CloseSmallPrivillage(item:any,index: any) {
    const data = {
      privilegeId:item._id
    }
    this._CoffeeCollectionService.deletecoffeePrivilege(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message)
        this.SmallPrivillage.splice(index, 1);
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  AddMediumPrivillage() {
    if (this.MediumPrivillageValue != '') {
      let data ={
        coffeeType:"Medium",
        privilege: this.sanitizer.sanitize(SecurityContext.HTML, this.MediumPrivillageValue)
      }
      this._CoffeeCollectionService.addcoffeePrivilege(data).subscribe((res:any)=>{
        if(res.status == 201){
          this._SharedService.successToast(res.message)
          this.GetAllPriviledge()
          this.MadiumPrivillageBrdr = false;
          this.MediumPrivillageValue = '';
        }
        if(res.status == 500){
          this._SharedService.errorToast(res.message)
        }
        if(res.status == 401){
          this._SharedService.errorToast(res.message)
        }
      })
    }else{
      this.MadiumPrivillageBrdr = true;
    }

  }
  CloseMediumPrivillage(item:any,index: any) {
    const data = {
      privilegeId:item._id
    }
    this._CoffeeCollectionService.deletecoffeePrivilege(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message)
        this.MediumPrivillage.splice(index, 1);
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  AddLargePrivillage() {
    if (this.LargePrivillageValue != '') {
      let data ={
        coffeeType:"Large",
        privilege: this.sanitizer.sanitize(SecurityContext.HTML, this.LargePrivillageValue)
      }
      this._CoffeeCollectionService.addcoffeePrivilege(data).subscribe((res:any)=>{
        if(res.status == 201){
          this._SharedService.successToast(res.message)
          this.GetAllPriviledge()
          this.LargePrivillageBrdr = false;
          this.LargePrivillageValue = '';
        }
        if(res.status == 500){
          this._SharedService.errorToast(res.message)
        }
        if(res.status == 401){
          this._SharedService.errorToast(res.message)
        }
      })
    }else{
      this.LargePrivillageBrdr = true;
    }
  }
  CloseLargePrivillage(item:any,index: any) {
    const data = {
      privilegeId:item._id
    }
    this._CoffeeCollectionService.deletecoffeePrivilege(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message)
        this.LargePrivillage.splice(index, 1);
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  SmallKeyupPrivillage(){
    if(this.SmallPrivillageValue !=''){
      this.SmallPrivillageBrdr = false;
    }else{
      this.SmallPrivillageBrdr = true;
    }
  }
  MediumKeyupPrivillage(){
    if(this.MediumPrivillageValue !=''){
      this.MadiumPrivillageBrdr = false;
    }else{
      this.MadiumPrivillageBrdr = true;
    }
  }
  LargeKeyupPrivillage(){
    if(this.LargePrivillageValue !=''){
      this.LargePrivillageBrdr = false;
    }else{
      this.LargePrivillageBrdr = true;
    }
  }
 
}
