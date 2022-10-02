import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, QueryList, ViewChildren} from '@angular/core';
import { Router } from '@angular/router';
import mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../auth/service/authentication.service';
import { SharedService } from '../../shared/shared.service';
import { MapsService } from './maps.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit{
  sidebaropenclose:boolean = true;
  selectcatogorymenu:any;
  selectcatogorymenusub:any;
  selectcatogorytype:any;
  productTypevalue:any;
  menusubcategory:any;
  producttypenotfound:any;
  subcategory:any;
  SubCategorynotfound:any;
  mainCategory:boolean = true;
  subCategory:boolean = false;
  innerCategory:boolean = false;
  searchText:any;
  currLng:any = "-0.118092";
  currLat:any = "51.509865";
  currentLocation:boolean = false;
  isSeller:boolean = false;
  isInfluencer:boolean = false;
  iFrameURL:any = `${this.router['location']._platformLocation.location.origin}/embed?id=NjIxNjEyNDFhOTFkNWI1YzA4ZGVjMWFk`
  isMapAvailable:boolean = false;
  mapId:any;
  mapdata:any = [];

  constructor(private _MapService:MapsService, private _AuthenticationService:AuthenticationService, private router:Router, private _SharedService:SharedService){
  }

  ngOnInit(): void{
    this._MapService.getAllMapLocation().subscribe((res:any) => {
      this.mapdata = res.data
    },err=>{
      console.log(err,"err - value");
    })
    // let currentUser = this._AuthenticationService.currentUserValue.countryCode;
    // this.isSeller = this._AuthenticationService.isSeller;
    // this.isInfluencer = this._AuthenticationService.isInfluencer;
    //   this._MapService.findMenuCategory(currentUser).subscribe(res=>{
    //     const menubar:any = res;
    //     this.selectcatogorymenu = menubar.data;
    //  });
  }

  currentlocation(){
    if(navigator.geolocation){
      this.currLat = "";
      this.currLng =
      this.currentLocation = true;
      navigator.geolocation.getCurrentPosition(position => {
        this.currLat = position.coords.latitude;
        this.currLng = position.coords.longitude;
      });
    }else{
      alert("Geolocation is not supported by this browser.");
    }
  }

  menucategory(data:any){
    this.searchText = '';
    this.subcategory = data._id; 
    const subcategory = {
      "menuCategoryId": data._id
    }
    this.selectcatogorytype = [];
    this._MapService.findMenuSubCategory(subcategory).subscribe((res:any)=>{
      if(res.status == 200){
        this.mainCategory = false;
        this.subCategory = true;
        this.selectcatogorymenusub = res.data;
        this.SubCategorynotfound = this.selectcatogorymenusub.length > 0;
      }else{
        console.log(res.message);
      }
    },(err)=>{
      console.log(err);
    });
  }

  menucategorysub(data:any){
    this.searchText = '';
    this.menusubcategory = data._id; 
    const producttype = {
      "menuSubCategoryId":data._id
    }
    this._MapService.findfindproductType(producttype).subscribe((res:any)=>{
      if(res.status == 200){
        this.subCategory = false;
        this.innerCategory = true;
        this.selectcatogorytype = res.data;
        this.producttypenotfound = this.selectcatogorytype.length > 0;
      }else{
        console.log(res.message);
      }
    },(err)=>{
      console.log(err);
    });
  }

  productitemdata(userid:any){
    console.log(userid._id,'productitemdata - data');
  }

  backMain(){
    this.searchText = '';
    this.mainCategory = true;
    this.subCategory = false;
  }

  backSub(){
    this.searchText = '';
    this.subCategory = true;
    this.innerCategory = false;
  }

  onClick(data:any){
    console.log(data,"data - value");
  }

  onDragEnd(data:any){
    this.currLat = data._lngLat.lat;
    this.currLng = data._lngLat.lng;
  }

  // createLocation(){
  //   const latLng = {
  //     latitude: this.currLat,
  //     longitude: this.currLng
  //   }
  //   this._MapService.createNewMapLocation(latLng).subscribe((res:any)=>{
  //     if(res.status === 201){
  //       this._SharedService.successToast(res.message);
  //       this.isMapAvailable = true;
  //     }else if(res.status === 409){
  //       this._SharedService.errorToast(res.message);
  //     }else{
  //       this._SharedService.errorToast(res.message);
  //     }
  //   },err=>{
  //     console.log(err,"err - value");
  //   });
  // }

  // updateLocation(){
  //   const updateLocation = {
  //     mapId: this.mapId,
  //     latitude: this.currLat,
  //     longitude: this.currLng
  //   }
  //   this._MapService.updateMapLocation(updateLocation).subscribe((res:any)=>{
  //     if(res.status === 200){
  //       this._SharedService.successToast(res.message);
  //     }else{
  //       this._SharedService.errorToast(res.message);
  //     }
  //   },err=>{
  //     console.log(err,"err - value");
  //   });
  // }

  ngAfterViewInit(): void{
  }
  
  // onClick(evt: MapMouseEvent){
  // this.selectedPoint = (<any>evt).features[0];
  // console.log(this.selectedPoint,'this.selectedPoint - data');
  // }
}