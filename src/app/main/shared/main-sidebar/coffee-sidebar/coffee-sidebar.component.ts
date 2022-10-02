import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedService } from '../../shared.service';
import { CoffeeSidebarService } from './coffee-sidebar.service';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service';
import { ModulesService } from 'src/app/main/modules/modules.service';
declare let Razorpay: any;

@Component({
  selector: 'app-coffee-sidebar',
  templateUrl: './coffee-sidebar.component.html',
  styleUrls: ['./coffee-sidebar.component.css']
})
export class CoffeeSidebarComponent implements OnInit {
  public buymecoffee:boolean;
  public withoutNavBar:boolean;
  public influencerDetail:any;
  public coffeeList:any=[];
  public selectedCoffeeId:any;
  public spinnerShow:boolean = false;
  public paymentId: string;
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');
  @Output() closebar = new EventEmitter<string>();

  @Input() set coffeeDetail(params: any) {
    if(params){
      if(params.buymecoffee){
        this.influencerDetail = params.influencerDetail;
        this.buymecoffee = true;
        if(params.withoutNavBar) this.withoutNavBar = true; else this.withoutNavBar = false;
        this.getCoffeeList(this.influencerDetail._id);
      }else{
        if(this.buymecoffee == true) this.buymecoffee = false;
      }
    }
  }

  constructor(private _CoffeeSidebarService:CoffeeSidebarService,private _SharedService:SharedService,private _AuthenticationService:AuthenticationService,private _modulesService:ModulesService) { }

  ngOnInit(): void {
  }

  getCoffeeList(influencerId:any){
    const data = {
      influencerId:influencerId
    }
    this._CoffeeSidebarService.getCoffeePriviledgeByInfluencerId(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.coffeeList = res.data
      }else{
        this._SharedService.errorToast(res.message);
      }
    })
  }

  payCoffee(item:any){
    this.selectedCoffeeId = item._id
    if(this.spinnerShow == false){
      this.spinnerShow = true;
      const paymentPay = {
        amount:item.price,
        currency:this.currencyUnit
      }
      this._modulesService.razorPayMethod(paymentPay).subscribe((res:any)=>{
        if(res.status === 200){
          this.spinnerShow = false;  
          const options = {
            key: res.data.key, // Enter the Key ID generated from the Dashboard
            amount: res.data.amount_due, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: res.data.currency,
            name: 'HustleUp',
            image: 'https://dummyimage.com/80x80/00092f/fff.png',
            order_id: res.data.id, // This is a Order ID.
            handler: (response: any) => {
              console.log(response,"response***************")
              this.paymentId = response.razorpay_payment_id;
              this.checkOutCoffee();
            },
            theme: {
              color: '#0092ff'
            }
          };
          const rzp1 = new Razorpay(options);
          rzp1.open();
        }else this.spinnerShow = false;
      },(err)=>{
        console.log(err,"err");
        this.spinnerShow = false;
      });
    }else{
      this._SharedService.InfoToast("please Wait...!")
    }
  }

  checkOutCoffee(){
    const data = {
      coffeeId:this.selectedCoffeeId,
      influencerId:this.influencerDetail._id
    }
    this._CoffeeSidebarService.buyCoffee(data).subscribe((res:any)=>{
      if(res.status === 201){
        this._SharedService.successToast("coffee Paid SuccessFully")
        this.closesidebar();
      }else{
        this._SharedService.errorToast(res.message);
        this.Refund();
      }
    },(err:any)=>{
      this.Refund();
    });
  }

  Refund(){
    const data = {
      paymentId: this.paymentId
    };
    this._modulesService.refundMethod(data).subscribe((res:any) => {
      if (res.status == 200){
        this._SharedService.successToast('refund your account within 5-10 working days.');
      }
    }, (err:any) => {
      this._SharedService.errorToast(err.message);
    });
  }

  closesidebar(){
    this.closebar.emit('');
    this.buymecoffee = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };

}