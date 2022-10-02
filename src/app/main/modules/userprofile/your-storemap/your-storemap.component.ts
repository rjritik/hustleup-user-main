import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/main/shared/shared.service';
import { UserprofileService } from '../userprofile.service';
import * as moment from 'moment';

@Component({
  selector: 'app-your-storemap',
  templateUrl: './your-storemap.component.html',
  styleUrls: ['./your-storemap.component.css']
})
export class YourStoremapComponent implements OnInit{
  currLng:any = "-0.118092";
  currLat:any = "51.509865";
  isMapAvailable:boolean = false;
  currentLocation:boolean = false;
  mapId:any;
  updateDate:boolean = false;
  constructor(private _UserprofileService:UserprofileService, private _SharedService:SharedService){ }

  ngOnInit(): void{
    this._UserprofileService.verifySellerMap().subscribe((res:any) =>{
      this.isMapAvailable = res ? true : false;
      this.currentLocation = true;
      this.mapId = res._id;
      this.currLng = res.longitude;
      this.currLat = res.latitude;
      let today = new Date();
      let storeDate = moment(res.created_date);
      let futureMonth = moment(storeDate).add(6, 'M');
      if(moment(futureMonth).isBefore(today)){
        this.updateDate = true;
      }
    },err=>{
      console.log(err);
    });
  }

  onDragEnd(data:any){
    this.currLat = data._lngLat.lat;
    this.currLng = data._lngLat.lng;
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

  createLocation(){
    const latLng = {
      latitude: this.currLat,
      longitude: this.currLng
    }
    this._UserprofileService.createNewMapLocation(latLng).subscribe((res:any)=>{
      if(res.status === 201){
        this._SharedService.successToast(res.message);
        this.isMapAvailable = true;
      }else if(res.status === 409){
        this._SharedService.errorToast(res.message);
      }else{
        this._SharedService.errorToast(res.message);
      }
    },err=>{
      console.log(err,"err - value");
    });
  }

  updateLocation(){
    const updateLocation = {
      mapId: this.mapId,
      latitude: this.currLat,
      longitude: this.currLng
    }
    this._UserprofileService.updateMapLocation(updateLocation).subscribe((res:any)=>{
      if(res.status === 200){
        this._SharedService.successToast(res.message);
      }else{
        this._SharedService.errorToast(res.message);
      }
    },err=>{
      console.log(err,"err - value");
    });
  }

  }