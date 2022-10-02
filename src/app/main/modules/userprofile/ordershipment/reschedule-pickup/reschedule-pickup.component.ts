import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { SharedService } from 'src/app/main/shared/shared.service';
import { ProcessedOrderService } from '../processed-order/processed-order.service';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';

@Component({
  selector: 'app-reschedule-pickup',
  templateUrl: './reschedule-pickup.component.html',
  styleUrls: ['./reschedule-pickup.component.css']
})
export class ReschedulePickupComponent implements OnInit {
  // public ReschedulePickupDate:any = Array<Select2OptionData>();
  public ReschedulePickupTime:any = Array<Select2OptionData>();
  today=new Date();
  SelectedReschedulePickupDetail:any=[]
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');

  constructor(private _ProcessedOrderService:ProcessedOrderService,
              private _ActivateRouteroute: ActivatedRoute,
              private Route:Router,
              private _AuthenticationService:AuthenticationService,
              private _SharedService: SharedService,
              private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this._ActivateRouteroute.queryParams.subscribe((data:any)=>{
      const getData = JSON.parse((atob(data.ReschedulePickupDetail)))
      this.SelectedReschedulePickupDetail = getData.items
    });
    // this.ReschedulePickupDate = [
    //   {
    //     id: 'Sat,Jun 27',
    //     text: 'Sat,Jun 27'
    //   },
    //   {
    //     id: 'Sun,Jun 28',
    //     text: 'Sun,Jun 28'
    //   },
    //   {
    //     id: 'Mon,Jun 29',
    //     text: 'Mon,Jun 29'
    //   },
    // ]
    this.ReschedulePickupTime = [
      {
        id: '10 AM - 1 PM',
        text: '10 AM - 1 PM'
      },
      {
        id: '10 AM - 5 PM',
        text: '10 AM - 5 PM'
      },
      {
        id: '1 PM - 9 PM',
        text: '1 PM - 9 PM'
      },
    ]
  }

  ReschedulePickupForm: any = new FormGroup({
    reschedulepickupdate: new FormControl('', [Validators.required]),
    Reschedulepickuptime: new FormControl('', [Validators.required]),
  });
  get f() {
    return this.ReschedulePickupForm;
  }
  RequestReschedulePickupClick(f:any){
    if(f.valid){
      let data={   
        orderNumber:this.SelectedReschedulePickupDetail[0].orderNumber,
        pickupDate:f.value.reschedulepickupdate,
        pickupTime: this.sanitizer.sanitize(SecurityContext.HTML, f.value.Reschedulepickuptime)
      }
      this._ProcessedOrderService.CreateReschedulePickup(data).subscribe((res:any)=>{
        if(res.status == 204){
          this._SharedService.successToast(res.message)
          this.Route.navigate(['/user-profile/Ordershipment/ProcessedOrder']);
        }
        if(res.status == 500){
          this._SharedService.successToast(res.message)
        }
        if(res.status == 401){
          this._SharedService.successToast(res.message)
        }
      })
    }else{
      this.ReschedulePickupForm.markAllAsTouched()
    }
  }

  shipmentback(){
    this.Route.navigate(['/user-profile/Ordershipment/ProcessedOrder']);
  }

}
