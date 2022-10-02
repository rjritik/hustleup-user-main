import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';

@Component({
  selector: 'app-carrier-detail',
  templateUrl: './carrier-detail.component.html',
  styleUrls: ['./carrier-detail.component.css']
})
export class CarrierDetailComponent implements OnInit {
  SelectedCarrierDetail:any;
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');

  constructor(private Route:Router,private Activateroute:ActivatedRoute,private _AuthenticationService:AuthenticationService,) { }

  ngOnInit(): void {
    this.Activateroute.queryParams.subscribe((data:any)=>{
      const getData = JSON.parse((atob(data.carrierDetail)))
      this.SelectedCarrierDetail = getData.items
    })
  }
  CarrierDetailBack(){
    this.Route.navigate(['/user-profile/Ordershipment/DispatchedOrder']);
  }

}
