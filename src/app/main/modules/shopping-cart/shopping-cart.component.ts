import { ChangeDetectorRef, Component, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { getParamByISO } from 'iso-country-currency';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../auth/service/authentication.service';
import { SharedService } from '../../shared/shared.service';
import { ModulesService } from '../modules.service';
import { ProductDetailService } from '../product-details/product-detail.service';
declare var $:any;
declare let Razorpay: any;

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit,OnDestroy {
  CoupenName:any;
  // availCoupenName:boolean = false;
  continuebtn:boolean = false;
  PaymentSummary:any;
  buyNowProductDetail:any;
  continueenbledisable:boolean = false;
  isSelectedAddress:any;
  CoupenDiscount:any;
  finalDiscount:number = 0;
  quantityWiseSellingPrice:number = 0;
  subTotalAmount:number = 0;
  domesticShippingCharges:any = 0;
  CartList:any=[];
  cartlengthsavednumber:number;
  cartlengthnumber:number;
  SingleOrder = false;
  CoupenPromoCode:any = [];
  FinalCoupenDiscount:number = 0;
  AppliedCoupenList:any=[]
  promocodePopup:any=false;
  TotalAmount:number = 0;
  iscartItemExits:boolean = true;
  shippingCartUnsub$:Subscription;
  GetCartRefreshUnsub$:Subscription;
  isSelectedAddressUnsub$:Subscription;
  subscriptions: Subscription[] = []
  spinnerShow:boolean = false;
  paymentId: string;
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');
  form: FormGroup;
  isCODAvailable: boolean ;
  sellerPincodeList:any=[];
  showPaymentTypeSpinner:boolean = false;

  constructor(
    private _SharedService: SharedService,
    private _router:Router,
    private _modulesService:ModulesService,
    private sanitizer:DomSanitizer,
    private cdRef: ChangeDetectorRef,
    private _AuthenticationService:AuthenticationService,
    private _ProductDetailService:ProductDetailService,
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      paymentMode: ['prepaid', Validators.required]
    });
  }

  ngOnInit(): void {
    if(localStorage.getItem("buyNowProductData") !== null){
      this.SingleOrder = true;
      const buyproductdata:any = localStorage.getItem("buyNowProductData");
      let productbyt = window.atob(buyproductdata);
      this.buyNowProductDetail = JSON.parse(productbyt);
      this.quantityWiseSellingPrice = this.buyNowProductDetail.quantityWisePrice;
      this.finalDiscount = this.buyNowProductDetail.discount;
      this.subTotalAmount = this.quantityWiseSellingPrice + this.finalDiscount;
      this.domesticShippingCharges = this.buyNowProductDetail.domesticShippingCharges;
      this.GetProductWiseCouponCode(this.buyNowProductDetail.productId,this.buyNowProductDetail.variationId);
      this.viewAllSingleProductAppliedCouponCode(this.buyNowProductDetail.productId);
      this.sellerPincodeList.push(this.buyNowProductDetail.seller_pincode);
    }
    if(this.SingleOrder == false){
      this.GetCartList();
      this.ViewAllCouponWithProduct();
      this.ViewAllAppliedCouponCode();
    }
    this.selectaddressSubscribeMethod();
    this.shoppingCartSubscribeMethod();
    this.cdRef.detectChanges();
    this.cartRefreshSubscribeMethod();
    this.UnsubscribeMethod();
  }

  shoppingCartSubscribeMethod(){
    this.shippingCartUnsub$ = this._SharedService.shoppingcart.subscribe(res=>{
      if(res == 'true') this.continuebtn = true; else this.continuebtn = false;
    });
  };

  cartRefreshSubscribeMethod(){
    this.GetCartRefreshUnsub$ = this._SharedService.GetCartRefresh.subscribe((res:any)=>{
      if(res.refresh) this.GetCartList()
    });
  };

  selectaddressSubscribeMethod(){
    this.isSelectedAddressUnsub$ = this._SharedService.isSelectedAddress.subscribe(async(res:any)=>{
      if(res !== ""){
        this.continueenbledisable = true;
        this.isSelectedAddress = res;
        const checkAvailablility:any = await this.checkDeliveryAvailability(this.sellerPincodeList,this.isSelectedAddress.pincode.toString(),"cod");
        this.isCODAvailable = checkAvailablility
      }else{
        this.continueenbledisable = false;
      }
    });
  };

  UnsubscribeMethod(){
    this.subscriptions.push(this.shippingCartUnsub$);
    this.subscriptions.push(this.GetCartRefreshUnsub$);
    this.subscriptions.push(this.isSelectedAddressUnsub$);
  }

  GetCartList(){
    this._modulesService.getcartlist().subscribe((res:any)=>{
      if(res.status == 200){
        this.CartList = res.data
        const cartlength = [];
        this.CartList.forEach((element:any) => {
          if(element.isSaved == false){
            cartlength.push(element);
            this.sellerPincodeList.push(element.seller_pincode);
          }
          if(element.isSaved == true){
            const cartlengthsaved = [];
            cartlengthsaved.push(element);
            this.cartlengthsavednumber = cartlengthsaved.length;
          }
        }); 
        this.cartlengthnumber = cartlength.length;
        this._SharedService.GetCart(this.cartlengthnumber);
        this.getTotal();  
      }
    });
  }

  getTotal(){
    const savedItemList = [];
    let total = 0;
    let discountTotal = 0;
    let shippingChargeTotal = 0;
    if(localStorage.getItem("buyNowProductData") == null){
      for (var i = 0; i < this.CartList.length; i++) {
        if(this.CartList[i].isSaved == false){
          this.iscartItemExits = true;
          if (this.CartList[i].basePrice) {
            total += this.CartList[i].basePrice * this.CartList[i].quantity;
            this.quantityWiseSellingPrice = total;
          }
          if (this.CartList[i].discount){
            discountTotal += this.CartList[i].discount * this.CartList[i].quantity;
            this.finalDiscount = discountTotal;
          }
          shippingChargeTotal += this.CartList[i].product_details[0].domesticShippingCharges;
          this.domesticShippingCharges = shippingChargeTotal;
        }
        if(this.CartList[i].isSaved == true){
          savedItemList.push(this.CartList[i]);
        }
      }
      if(savedItemList.length == this.CartList.length){
        this.iscartItemExits = false;
        this.subTotalAmount = 0;
        this.quantityWiseSellingPrice = 0;
        this.finalDiscount = 0;
        this.domesticShippingCharges = 0;
        this.TotalAmount = 0;
      }
      this.subTotalAmount = this.quantityWiseSellingPrice + this.finalDiscount;
    }else{
      this.SingleOrder = true;
      this.quantityWiseSellingPrice = this.buyNowProductDetail.quantityWisePrice;
      this.finalDiscount = this.buyNowProductDetail.discount;
      this.subTotalAmount = this.quantityWiseSellingPrice + this.finalDiscount;
      this.domesticShippingCharges = this.buyNowProductDetail.domesticShippingCharges;
    }
  };

  GetCoupenTotal(){
    const CoupenDiscountArray:any = [];
    // this.CoupenPromoCode.forEach((element:any) => {
    //   element.promocode.forEach((subele:any) => {
    //     if(subele.isApplied == true){
    //       if(subele.offerType == "FlatAmountOff"){
    //         CoupenDiscountArray.push(subele.amount)
    //       }
    //       if(subele.offerType == "PercentageOff"){
    //         CoupenDiscountArray.push((subele.discount*element.basePrice)/100)
    //       }
    //     }
    //   });
    // });

    this.AppliedCoupenList.forEach((subele:any) => {
      if(subele.isApplied == true){
        if(subele.offerType == "FlatAmountOff"){
          CoupenDiscountArray.push(subele.amountOrDiscount)
        }
        if(subele.offerType == "PercentageOff"){
          this.CoupenPromoCode.find((element:any) => {
            if(element.productId == subele.productId){
              console.log(element.basePrice,"element.basePrice - value")
              CoupenDiscountArray.push((subele.amountOrDiscount*element.basePrice)/100); 
            }
          })
        }
      }
    });    
    let initialValue = 0
    this.FinalCoupenDiscount = CoupenDiscountArray.reduce((previousValue:any, currentValue:any) => previousValue + currentValue, initialValue)
  };

  ViewAllAppliedCouponCode(){
    this._modulesService.getAllAppliedCouponCode().subscribe((res:any)=>{
      if(res.status == 200){
        this.AppliedCoupenList = res.data;
        this.GetCoupenTotal()
      }
      if(res.status == 500) this._SharedService.errorToast(res.message)
    })
  };

  viewAllSingleProductAppliedCouponCode(productId:any){
    this._modulesService.viewAllSingleProductAppliedCouponCode({productId}).subscribe((res:any)=>{
      if(res.status == 200){
        this.AppliedCoupenList = res.data;
        this.GetCoupenTotal()
      }else{
        this._SharedService.errorToast(res.message)
      }
    })
  };

  DirectByApplyCoupenCode(){
    if(this.iscartItemExits){
      if(this.CoupenName !== undefined && this.CoupenName !== '' && this.CoupenName !== null){
        const data ={
          promocode:this.CoupenName.trim()
        }
        this._modulesService.applyCouponByPromocode(data).subscribe((res:any)=>{
          if(res.status == 100){
            this.CoupenName=undefined;
            this.ViewAllAppliedCouponCode()
            this.ViewAllCouponWithProduct()
            this._SharedService.successToast(res.message)
          }
          if(res.status == 200){
            this.CoupenName=undefined;
            this.ViewAllAppliedCouponCode()
            this.ViewAllCouponWithProduct()
            this._SharedService.successToast(res.message)
          }
          if(res.status == 404){
            this._SharedService.errorToast(res.message)
          }
          if(res.status == 418){
            this._SharedService.errorToast(res.message)
          }
          if(res.status == 500){
            this._SharedService.errorToast(res.message)
          }
        })
      }else{
        this._SharedService.InfoToast("Please insert Coupon & Promo Codes First.")
      }
    }else{
      this._SharedService.errorToast("Please add items in cart list."); 
    }
  };

  DirectBySingleProductApplyCoupenCode(){
    if(this.CoupenName && this.CoupenName !== '' && this.buyNowProductDetail.productId && this.buyNowProductDetail.variationId){
      const data ={
        productId:this.buyNowProductDetail.productId,
        variationId:this.buyNowProductDetail.variationId,
        couponCode:this.CoupenName.trim()
      }
      this._modulesService.directBySingleProductApplyCouponCode(data).subscribe((res:any)=>{
        if(res.status == 100){
          this.CoupenName=undefined;
          this.viewAllSingleProductAppliedCouponCode(this.buyNowProductDetail.productId)
          this.GetProductWiseCouponCode(this.buyNowProductDetail.productId,this.buyNowProductDetail.variationId);
          this._SharedService.InfoToast(res.message)
        }else if(res.status == 200){
          this.CoupenName=undefined;
          this.viewAllSingleProductAppliedCouponCode(this.buyNowProductDetail.productId)
          this.GetProductWiseCouponCode(this.buyNowProductDetail.productId,this.buyNowProductDetail.variationId);
          this._SharedService.successToast(res.message)
        }else{
          this._SharedService.errorToast(res.message)
        }
      })
    }else{
      this._SharedService.InfoToast("Please insert Coupon & Promo Codes First.")
    } 
  };

  placeOrderClick(){
    if(this.iscartItemExits){
      this._router.navigate(['/shopping-cart/select-address']);
    }else{
      this._SharedService.errorToast("Please add items in cart list.");
    }
  };

  checkoutMultiple(){
    const datas = {
      addressId:this.isSelectedAddress._id,
      couponData: this.AppliedCoupenList,
      paymentMode: this.form.value.paymentMode
    }
    this._modulesService.placeorder(datas).subscribe((res:any)=>{
      if(res.status === 201){
         this._router.navigate(['/user-profile/OrderHistory']);
        this._SharedService.successToast(res.message)
      }
      if(res.status == 404){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
    },err=>{
      console.log(err,"err");
    });
  };

  checkDeliveryAvailability(sellerPincodeList:any,to_pincode:any,payment_method:any){
    this.showPaymentTypeSpinner = true;
    return new Promise ((resolve, reject) => {
        const data =  {
          sellerPincodeList : JSON.stringify(sellerPincodeList), // seller pincode
          to_pincode : to_pincode.toString(),
          payment_method:payment_method
        }
        this._ProductDetailService.checkDeliveryAvailability(data).subscribe((res:any)=>{
          this.showPaymentTypeSpinner = false;
          if(res.status == 200){ 
            this.isCODAvailable = res.isCodAvailable;
            resolve(this.isCODAvailable);
          }else{
            resolve(false);
          }
        })
    })
    
  }

  createSingleOrder(){
    try{
      this.spinnerShow = true;
      this.TotalAmount = this.subTotalAmount - this.finalDiscount - this.FinalCoupenDiscount + this.domesticShippingCharges
      if(this.form.value.paymentMode == 'prepaid'){
        const paymentPay = {
          amount:this.TotalAmount,
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
                this.paymentId = response.razorpay_payment_id;
                this.checkoutSingle();
              },
              theme: {
                color: '#0092ff'
              }
            };
            const rzp1 = new Razorpay(options);
            rzp1.open();
          }else{
            this.spinnerShow = false;
          }
        },err=>{
          console.log(err,"err");
          this.spinnerShow = false;
        });
      }else if(this.form.value.paymentMode == 'cod'){
        this.checkoutSingle();
      }
    }catch(e){
      this._SharedService.errorToast(e)
    }
  }

  async createOrder(){
    if(this.continueenbledisable == true){
      this.spinnerShow = true;
      this.TotalAmount = this.subTotalAmount - this.finalDiscount - this.FinalCoupenDiscount + this.domesticShippingCharges
      if(this.form.value.paymentMode == 'prepaid'){
        const paymentPay = {
          amount:this.TotalAmount,
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
                this.paymentId = response.razorpay_payment_id;
                this.checkoutMultiple();
              },
              theme: {
                color: '#0092ff'
              }
            };
            const rzp1 = new Razorpay(options);
            rzp1.open();
          }else{
            this.spinnerShow = false;
          }
        },err=>{
          console.log(err,"err");
          this.spinnerShow = false;
        });
      }else if(this.form.value.paymentMode == 'cod'){
        this.checkoutMultiple();
      }
    }else{
      this._SharedService.errorToast("Please Select Address");
    }
  };

  checkoutSingle(){
    let data:any = {
      productId:this.buyNowProductDetail.productId,
      sellerId:this.buyNowProductDetail.sellerId,
      addressId:this.isSelectedAddress._id,
      sku: this.sanitizer.sanitize(SecurityContext.HTML ,this.buyNowProductDetail.sku),
      color:this.buyNowProductDetail.color,
      size: this.sanitizer.sanitize(SecurityContext.HTML  ,this.buyNowProductDetail.size),
      quantity:this.buyNowProductDetail.quantity,
      basePrice:this.buyNowProductDetail.basePrice,
      discount:this.buyNowProductDetail.discount,
      paymentMode:this.form.value.paymentMode,
      couponData: this.AppliedCoupenList,
    }
    if (this.buyNowProductDetail.influencerId){
      data.influencerId = this.buyNowProductDetail.influencerId;
    }
    this._modulesService.PlaceOneOrder(data).subscribe((res:any)=>{
      if(res.status == 201){
        this._SharedService.successToast(res.message)
        this._router.navigate(['/user-profile/OrderHistory']);
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  ViewPromoCode(){
    if(this.SingleOrder == true){
      this.GetProductWiseCouponCode(this.buyNowProductDetail.productId,this.buyNowProductDetail.variationId);
      this.promocodePopup = true;
    }else if(this.SingleOrder == false){
      if(this.iscartItemExits){
        this.ViewAllCouponWithProduct();
        this.promocodePopup = true;
      }else{
        this._SharedService.errorToast("Please add items in cart list.");
      }
    }
  }

  ViewAllCouponWithProduct(){
    this._modulesService.viewAllCouponWithProduct().subscribe((res:any)=>{
      if(res.status == 200){
        this.CoupenPromoCode = res.data
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    },(err)=>{
      console.log(err,"err");
    });
  };

  GetProductWiseCouponCode(productId:any,variationId:any){
    const data = {
      productId : productId,
      variationId : variationId
    } 
    this._modulesService.getProductWiseCouponCode(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.CoupenPromoCode = res.data
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    },(err)=>{
      console.log(err,"err");
    });
  };

  closePromocodePopup(){
    this.promocodePopup = false;
  }

  appliedpromo(item:any,promodata:any){
    let checkAppliedOrNot = item.promocode.findIndex((ele:any) => {return ele.isApplied === true})
    if (checkAppliedOrNot === -1){
      if(promodata.isApplied == false){
        const data ={
          couponCode:promodata.promocode,
          productId:item.productId,
          sellerId:item.sellerId
        }
        this._modulesService.verifycoupencode(data).subscribe((res:any)=>{
          if(res.status == 200){
            // promodata.isApplied = true;
            if(this.SingleOrder == true){
              this.GetProductWiseCouponCode(this.buyNowProductDetail.productId,this.buyNowProductDetail.variationId);
              this.viewAllSingleProductAppliedCouponCode(this.buyNowProductDetail.productId);
            }else{
              this. ViewAllCouponWithProduct()
              this.ViewAllAppliedCouponCode()
            }
            this._SharedService.successToast(res.message)
          }else{
            this._SharedService.errorToast(res.message)
          }
        });
      }else{
       this._SharedService.errorToast("coupon code Is Already Applied!")
      }
    }
    if(checkAppliedOrNot !== -1){
      let alreadyapplied = item.promocode.find((ele:any) => {return ele.isApplied === true})
      this.RemovePromocode(item,alreadyapplied)
      const datas ={
        couponCode:promodata.promocode,
        productId:item.productId,
        sellerId:item.sellerId
      }
      this._modulesService.verifycoupencode(datas).subscribe((res:any)=>{
        if(res.status == 200){
          // promodata.isApplied = true;
          if(this.SingleOrder == true){
            this.GetProductWiseCouponCode(this.buyNowProductDetail.productId,this.buyNowProductDetail.variationId);
            this.viewAllSingleProductAppliedCouponCode(this.buyNowProductDetail.productId);
          }else{
            this. ViewAllCouponWithProduct()
            this.ViewAllAppliedCouponCode()
          }
          this._SharedService.successToast(res.message)
        }else{
          this._SharedService.errorToast(res.message)
        }
      });
      this._SharedService.errorToast("You can Only Use a promocode once on a product, Please Remove Applied Promocode First.")
    }
    
  }

  RemovePromocode(item:any,promodata:any){
    const data = {
      couponId:promodata._id,
      productId:item.productId
    }
    this._modulesService.removeCouponCode(data).subscribe((res:any)=>{
      if(res.status == 200){
        // promodata.isApplied = false;
        if(this.SingleOrder == true){
          this.GetProductWiseCouponCode(this.buyNowProductDetail.productId,this.buyNowProductDetail.variationId);
          this.viewAllSingleProductAppliedCouponCode(this.buyNowProductDetail.productId);
        }else{
          this. ViewAllCouponWithProduct()
          this.ViewAllAppliedCouponCode()
        }
        this._SharedService.successToast(res.message)
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 404){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  DirectByRemovePromocode(item:any){
    const data = {
      couponId:item.couponId,
      productId:item.productId
    }
    this._modulesService.removeCouponCode(data).subscribe((res:any)=>{
      if(res.status == 200){
        // item.isApplied = false;
        if(this.SingleOrder == true){
          this.GetProductWiseCouponCode(this.buyNowProductDetail.productId,this.buyNowProductDetail.variationId);
          this.viewAllSingleProductAppliedCouponCode(this.buyNowProductDetail.productId);
        }else{
          this. ViewAllCouponWithProduct()
          this.ViewAllAppliedCouponCode()
        }
        this._SharedService.successToast(res.message)
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 404){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  ngOnDestroy(){
    localStorage.removeItem("buyNowProductData");
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }
}
