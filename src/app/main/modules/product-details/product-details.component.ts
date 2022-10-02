import { Component, ElementRef, OnInit, ViewChild, ɵɵtrustConstantHtml,Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Slick } from 'ngx-slickjs';
import { Select2OptionData } from 'ng-select2';
import { AuthenticationService } from '../../auth/service';
import { ActivatedRoute,Router} from '@angular/router';
import { ModulesService } from '../modules.service';
import { SharedService } from '../../shared/shared.service';
import { ProductDetailService } from './product-detail.service';
import { isNgTemplate, ThrowStmt } from '@angular/compiler';
import { Clipboard } from '@angular/cdk/clipboard';
import { single } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HomeService } from '../home/home.service';
import Drift from 'drift-zoom';
import { getParamByISO } from 'iso-country-currency';
declare var $:any;

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  public Typeoferror:any = Array<Select2OptionData>();
  SelectedProductId:any
  SelectedProductDetail:any=[];
  cartItems:any;
  cartItemsLength:any;
  IsCartAvail:any = false;
  indexsize:any = 0;
  quantity = 1;
  ProductSize:any;
  ProductPrice:any;
  ProductMRP:any;
  ProductDiscount:any;
  TotalPrice:any;
  sideoverhide:any;
  sharepost:any;
  reportpost:any;
  postComment:any;
  promotepost:any;
  currentItem:any;
  clickedUser: any;
  addcart:any = false;
  messagepostcommentprod = '';
  showEmojiPickercomment = false;
  SKU:any;
  variationId:any;
  sidebarcomment:any;
  commentboxopenlength:any;
  deletecomment:any;
  deletecommentid:any;
  sidebarcommentinside:any;
  editcommentmatch:any;
  showhidereplies:any;
  messagepostcommentsub = '';
  editcommentbox:any;
  showEmojiPickersub = false;
  showEmojiPickersubinner = false;
  showEmojiPickersubcomment = false;
  messagesubcomment = '';
  messagepostcommentsubinner = '';
  editcommentboxinner:any;
  editsubcommenttogg = false;
  taggscomment:any;
  postImageCommentId:any;
  rating:number;
  discount:any;
  ReportItem:any=[];
  reportimage:any;
  SelectedReportFileName:any;
  UploadReportStatement:boolean;
  ReportFormData:any = new FormData();
  promo_option:boolean = false;
  promo_Verify_Done:boolean = false;
  promo_pending:boolean = false;
  PromoteProducts:any = [];
  SlideOptionspromoteproduct:any = {nav:false, items: 1, loop:false}
  URLRegx = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  YoutubeLink:any;
  SavedYoutubeLink:any;
  youtubebtnshow:boolean = false;
  InstagramLink:any;
  SavedInstagramLink:any;
  Instagrambtnshow:boolean = false;
  TwitterLink:any;
  SavedTwitterLink:any;
  Twitterbtnshow:boolean = false;
  FacebookLink:any;
  SavedFacebookLink:any;
  Facebookbtnshow:boolean = false;
  toogleBool: boolean=false;
  SimilarProductList:any;
  dataimgzoomer:boolean = false;
  SlideOptionsproductsimilar:any = {nav:true,  items: 1, loop:false, margin:25, responsive:{
    0: {
      items: 1,
      nav: true
    },
    600: {
      items: 3,
      nav: true
    },
    1000: {
      items: 5,
      nav: true,
      loop: false
    },
    1500: {
      items: 5,
      nav: true,
      loop: false
    }
  }};
  SelectedEmbededProduct:any;
  SlideOptionsEmbeded:any={nav:false, items: 1, loop:false,autoplay:false,autoplayTimeout:1000};
  ShowWishBuyBtn:boolean = false
  iFrameURL:any = '';
  embedIframe:any;
  cartSideOverHide:boolean = false;
  influencerId:any;
  currencyUnit:any = getParamByISO(this._authentication.currentUserValue.countryCode, 'currency');
  isCODAvailable:any;
  pincode:any;
  spinnerShow:boolean = false;
  searchType:any = 'check';

  constructor(
    private _authentication:AuthenticationService,
    private Activateroute: ActivatedRoute,
    private router:Router,
    private _SharedService:SharedService,
    private _ProductDetailService:ProductDetailService,
    private clipboard: Clipboard,
    private _HomeService:HomeService,
    private sanitizer:DomSanitizer
  ){
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    }
    //Implementing navigation of slides using mouse scroll
  }

  ngOnInit(): void {
    this.GetCartList()
    this.Activateroute.paramMap.subscribe((params:any) => {
      let influencerCheck = atob(params.get('id')).includes("influencerId");
      if(influencerCheck){
        this.SelectedProductId = JSON.parse(atob(params.get('id'))).productId;
        this.influencerId = JSON.parse(atob(params.get('id'))).influencerId;
      }else{
        this.SelectedProductId = atob(params.get('id'));
      }
      var url_decoded = this.Base64EncodeUrl(params.get('id'));
      this.iFrameURL = `${this.router['location']._platformLocation.location.origin}/embed/${url_decoded}`;
      this.embedIframe =  `<iframe width="320" height="425" src="${this.iFrameURL}" frameborder="0"></iframe>`;
    });
    this.getsingleproduct(this.SelectedProductId);
    this.GetPostProductAllComments(this.SelectedProductId);
    this._authentication.navbarsub.next(false);
    
    this.Typeoferror = [
      {
        id: 'Photograph / Image',
        text: 'Photograph / Image'
      },
      {
        id: 'Price',
        text: 'Price'
      },
      {
        id: 'Shipping',
        text: 'Shipping'
      },
      {
        id: 'Color',
        text: 'Color'
      },
      {
        id: 'Size',
        text: 'Size'
      }
    ]
  }

  ReportForm: any = new FormGroup({
    typeoferror: new FormControl('', [Validators.required]),
    username: new FormControl(undefined, [Validators.required]),
    writeerror: new FormControl(undefined, [Validators.required]),
    reportfile: new FormControl(undefined, [Validators.required]),
  });

  get f(){
    return this.ReportForm;
  }

  closeCartSidebar(){
    console.log("closeCartSidebar")
  }

  getsingleproduct(SelectedProductId:any){
    const data = {
      productId:SelectedProductId
    }
    if(SelectedProductId !== undefined){
      this._ProductDetailService.GetSingleProduct(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.SelectedProductDetail = res.data
          if(this.SelectedProductDetail[0].isCommented == true){
            this._ProductDetailService.getProductSingleComment({"productId":this.SelectedProductDetail[0]._id}).subscribe((res:any)=>{
              this.rating = res?.data.stars;
            });
          }
          // setTimeout(() => {
          //   $(".SelectSizetrigger").trigger( "click");
          // }, 100);
          this.ProductSize = this.SelectedProductDetail[0].variations[0].variationTitle
          this.ProductPrice = this.SelectedProductDetail[0].variations[0].sellingPrice
          this.ProductMRP = this.SelectedProductDetail[0].variations[0].MRP
          this.ProductDiscount = this.SelectedProductDetail[0].variations[0].discount
          this.TotalPrice = this.SelectedProductDetail[0].variations[0].sellingPrice* this.quantity
          this.SKU = this.SelectedProductDetail[0].variations[0].sellerSku,
          this.variationId = this.SelectedProductDetail[0].variations[0]._id
          this.discount = (this.SelectedProductDetail[0].variations[0].MRP-this.SelectedProductDetail[0].variations[0].sellingPrice)* this.quantity
          const initialfound = this.cartItems?.find((x:any) => x.size == this.ProductSize && x.productId == this.SelectedProductDetail[0]._id && x.isSaved == false);
          this.GetSimilarProduct()
          if(initialfound == undefined){
            this.IsCartAvail = false
          }else{
            this.IsCartAvail = true
          }
          // let result = this.cartItems.filter((o1:any) => this.SelectedProductDetail.find((o2:any) => o1.productId === o2._id));
          // if(result.length == 0){
          //   this.IsCartAvail = false
          // }else{
          //   this.IsCartAvail = true 
          // }
        }else{
          this._SharedService.errorToast(res.message);
        }
      })
    }else{
      this._SharedService.errorToast("productid is undefined");
    }
  }

  givenstar(item:any){
    if(item.isRatingAllowed == false){
      this._SharedService.errorToast("You are not elegible")
    }
  }

  GetSimilarProduct(){
    const data={
      productTypeId:this.SelectedProductDetail[0].productTypeId
    }
    this._ProductDetailService.getsimilarproduct(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.SimilarProductList = res;
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
    })
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
    this.ReportFormData.append("reportImage",files);
    this.SelectedReportFileName = `${files.name} (${formatBytes(files.size)})`;
    $("input.ng-touched.ng-dirty.ng-valid").parent('button').removeAttr("style");
  }


  ReportSubmit(f:any){
    if(!f.value.reportfile){
      this.UploadReportStatement = true;
    }else{
      this.UploadReportStatement = false;
    }
    if(f.valid){
      this.ReportFormData.append("productId",this.SelectedProductDetail[0]._id);
      this.ReportFormData.append("typeOfIssue",f.value.typeoferror);
      this.ReportFormData.append("userName", this.sanitizer.sanitize(SecurityContext.HTML, f.value.username));
      this.ReportFormData.append("description",f.value.writeerror);
      this._ProductDetailService.addproductreport(this.ReportFormData).subscribe((res:any)=>{
        if(res.status == 201){
          this._SharedService.successToast(res.message);
          this.closesidebar()
          this.router.navigate(['/home'])
        }
        if(res.status == 500){
          this.DeleteReportAppendData()
          this._SharedService.errorToast(res.message)
        }
        if(res.status == 404){
          this.DeleteReportAppendData()
          this._SharedService.errorToast(res.message)
        }
      })
    }else{
      this.ReportForm.markAllAsTouched();
      setTimeout(() => {
        $("input.ng-pristine.ng-invalid.ng-touched").parent('button').css({"border":"1px solid red"});
      }, 100);
    }
  }

  DeleteReportAppendData(){
    this.ReportFormData.delete("productId");
    this.ReportFormData.delete("typeOfIssue");
    this.ReportFormData.delete("userName");
    this.ReportFormData.delete("description");
    this.ReportFormData.delete("reportImage");
  }


  GetCartList(){
    this._ProductDetailService.getcartlist().subscribe((res:any)=>{
      if(res.status == 200){
        this.cartItems = res.data
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  Product(item:any){
    const itm =window.btoa(JSON.stringify(item));
    localStorage.setItem("productdetail",itm);
    this.router.navigate(['/product']);
  }

  parrentEventHandlerFunction(valueEmitted:any){
    this.GetCartList();
    const initialfound = this.cartItems.find((x:any) => x.productId == valueEmitted.id && x.size == valueEmitted.size && x.isSaved == false);
    if(initialfound == undefined){
      this.IsCartAvail = true
    }else{
      this.IsCartAvail = false
    }
  }

  SelectSize(variationarray:any, index:any,mainitem:any){
    this.indexsize = index;
    this.ProductSize = variationarray.variationTitle
    this.ProductPrice =  variationarray.sellingPrice
    this.ProductMRP = variationarray.MRP
    this.ProductDiscount = variationarray.discount;
    this.TotalPrice = variationarray.sellingPrice * this.quantity
    this.SKU = variationarray.sellerSku,
    this.variationId = variationarray._id
    this.discount = (variationarray.MRP-variationarray.sellingPrice) * this.quantity

    const found = this.cartItems.find((x:any) => x.size == variationarray.variationTitle && x.productId == mainitem._id && x.isSaved == false);
    if(found == undefined){
      this.IsCartAvail = false;
    }else{
      this.IsCartAvail = true;
    }
  }

  Wishlist(item:any){
    const data = {
      productId:item._id,
      isWishlist:true
    }
    this._ProductDetailService.wishlistproduct(data).subscribe((res:any)=>{
      this._SharedService.successToast(res.message);
      item.isWishlist = true;
    },(err: any)=>{
      console.log(err,"err wishlist");
    })
  }

  Wishlistunsaved(item:any){
    const data = {
      productId:item._id,
      isWishlist:false
    }
    this._ProductDetailService.wishlistproduct(data).subscribe((res:any)=>{
      this._SharedService.errorToast(res.message);
      item.isWishlist = false;
    },(err: any)=>{
      console.log(err,"err wishlist");
    })
  }


  AddToCartProduct(item:any){
    this.addcart = true
    let data:any = {
      productId:item._id,
      sellerId:item.sellerId,
      color:item.color_details?._id,
      size: this.sanitizer.sanitize(SecurityContext.HTML , this.ProductSize),
      quantity:this.quantity,
      basePrice:this.ProductPrice,
      quantityWisePrice:this.TotalPrice,
      sku: this.sanitizer.sanitize(SecurityContext.HTML , this.SKU),
      variationId:this.variationId,
      discount:this.discount,
    }
    if (this.influencerId){
      data.influencerId = this.influencerId;
    }
    this._ProductDetailService.addtocart(data).subscribe((res:any)=>{
      if(res.status == 201){
        this.IsCartAvail = true
        this._SharedService.successToast("add to Cart SuccessFully")
        this._SharedService.notifyOther({refresh: true});
        this.GetCartList();
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
        this.GetCartList();
      }
    })  
  }

  GoToCart(){
    const data = {
      cartIconClick:true
    }
    this._SharedService.setCartSideBarOpen(data);
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  }

  BuyProduct(item:any){
    let data:any = {
      productId:item._id,
      sellerId:item.sellerId,
      color:item.color_details?._id,
      size: this.sanitizer.sanitize(SecurityContext.HTML , this.ProductSize),
      quantity:this.quantity,
      basePrice:this.ProductPrice,
      quantityWisePrice:this.TotalPrice,
      sku: this.sanitizer.sanitize(SecurityContext.HTML , this.SKU),
      variationId:this.variationId,
      discount:this.discount,
      domesticShippingCharges:item.domesticShippingCharges,
      seller_pincode:item.seller_pincode,
    }
    if (this.influencerId){
      data.influencerId = this.influencerId;
    }
    const datas = window.btoa(JSON.stringify(data));
    localStorage.setItem("buyNowProductData", datas);
    this.router.navigate(['/shopping-cart/select-address']);
  }

  IncreaseQty(){
    if(this.quantity < 3){
      this.quantity += 1;
      this.TotalPrice = this.ProductPrice * this.quantity
      this.discount = (this.ProductMRP-this.ProductPrice) * this.quantity
    }
  }

  DecreaseQty(){
    if(this.quantity > 1){
      this.quantity -= 1;
      this.TotalPrice = this.ProductPrice * this.quantity
      this.discount = (this.ProductMRP-this.ProductPrice) * this.quantity
    }
  }

  async checkAndChangePinCode(){
    this.isCODAvailable = undefined;
    if(this.pincode && this.pincode.toString().length  === 6 && this.SelectedProductDetail[0].seller_pincode){
      this.searchType = "change";
      const sellerPincode =[ this.SelectedProductDetail[0].seller_pincode]
      const checkAvailablility:any = await this.checkDeliveryAvailability(sellerPincode,this.pincode.toString(),"cod");
      this.isCODAvailable = checkAvailablility
    }else{
      this._SharedService.errorToast("enter valid Pincode");
    }
  }

  checkDeliveryAvailability(sellerPincodeList:any,to_pincode:any,payment_method:any){
    this.spinnerShow = true;
    return new Promise ((resolve, reject) => {
        const data =  {
          sellerPincodeList : JSON.stringify(sellerPincodeList), // seller pincode
          to_pincode : to_pincode.toString(),
          payment_method:payment_method
        }
        this._ProductDetailService.checkDeliveryAvailability(data).subscribe((res:any)=>{
          this.spinnerShow = false;
          if(res.status == 200){ 
            resolve(res.isCodAvailable);
          }else{
            resolve(false);
          }
        })
    })
    
  }

  postshare(){
    this.sharepost = !this.sharepost;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  };

  postreport(item:any){
    this.ReportItem = item
    this.reportimage = this.ReportItem.productPhotos[0].image
    this.reportpost = !this.reportpost;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  }

  commentpost(item:any){
    this.postComment = !this.postComment;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
    this.GetPostProductAllComments(item._id);
  }

  postpromote(){
    this._HomeService.getInflucerStatus().subscribe((res:any)=>{
      if(res.data == 1){
        // this.getProductSellerwiseforinfluencer(data.userId)
       this.promo_Verify_Done = true;
      }
      if(res.data == 3){
        this.promo_option = true;
      }
      if(res.data == 0){
        this.promo_pending = true;
        this._SharedService.errorToast(res.message)
      }
    })
    this.promotepost = !this.promotepost;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  }

  // getProductSellerwiseforinfluencer(sellerid:any){
  //   const datas = {
  //     sellerId:sellerid,
  //     isPromotable:true
  //   }
  //   this._HomeService.shopproduct(datas).subscribe((res:any)=>{
  //     console.log(res,"promoteresponce")
  //     if(res.status == 200){
  //       this.PromoteProducts = res.data
  //     }
  //     if(res.status == 500){
  //       this._SharedService.errorToast(res.message)
  //     }
  //     if(res.status == 401){
  //       this._SharedService.errorToast(res.message)
  //     }
  //   },(err)=>{
  //     console.log(err,"shopproduct err");
  //   });
  // }

  closesidebar(){
    this.DeleteReportAppendData()
    const data = {
      cartIconClick:false
    }
    this._SharedService.setCartSideBarOpen(data);
    this.sharepost = false;
    this.reportpost = false;
    this.sideoverhide = false;
    this.postComment = false;
    this.promotepost = false;
    this.promo_option = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  }

  GetPostProductAllComments(productId:any){
    const data = {
      productId
    };
    this._ProductDetailService.getProductAllComment(data).subscribe((res:any)=>{
      if(res.status == 200) {
        this.sidebarcomment = res.data;
        this.commentboxopenlength = this.sidebarcomment.length;
        if(this.SelectedProductDetail.length > 0) this.SelectedProductDetail[0].totalComments = this.commentboxopenlength
      }else{
        this._SharedService.errorToast(res.message)
      }
    },(err)=>{
      this._SharedService.errorToast('something went wrong!');
    });
  }

  changeEvent(event:any) {
    if (event.target.checked) {
      this.toogleBool= event.target.checked;
    }
    else {
      this.toogleBool= event.target.checked;
    }
  }

  saveyoutubeURL(youtubename:any){
    if(youtubename.control.status == "VALID"){
      if(youtubename.control.value != undefined){
        this.youtubebtnshow = true;
        this.SavedYoutubeLink = this.sanitizer.sanitize(SecurityContext.HTML ,youtubename.control.value)
      }
    }
  }
  
  RemoveYoutubeURL(youtubename:any){
    this.youtubebtnshow = false;
    this.SavedYoutubeLink = undefined
    youtubename.reset()
  }

  saveInstagramURL(Instagramname:any){
    if(Instagramname.control.status == "VALID"){
      if(Instagramname.control.value != undefined){
        this.Instagrambtnshow = true;
        this.SavedInstagramLink = this.sanitizer.sanitize(SecurityContext.HTML ,Instagramname.control.value)
      }
    }
  }

  RemoveInstagramURL(Instagramname:any){
    this.Instagrambtnshow = false;
    this.SavedInstagramLink = undefined;
    Instagramname.reset()
  }

  saveTwitterURL(Twittername:any){
    if(Twittername.control.status == "VALID"){
      if(Twittername.control.value != undefined){
        this.Twitterbtnshow = true;
        this.SavedTwitterLink = this.sanitizer.sanitize(SecurityContext.HTML ,Twittername.control.value)
      }
    }
  }
  RemoveTwitterURL(Twittername:any){
    this.Twitterbtnshow = false;
    this.SavedTwitterLink = undefined;
    Twittername.reset()
  }

  saveFacebookURL(Facebookname:any){
    if(Facebookname.control.status == "VALID"){
      if(Facebookname.control.value != undefined){
        this.Facebookbtnshow = true;
        this.SavedFacebookLink = this.sanitizer.sanitize(SecurityContext.HTML ,Facebookname.control.value)
      }
    }
  }

  RemoveFacebookURL(Facebookname:any){
    this.Facebookbtnshow = false;
    this.SavedFacebookLink = undefined;
    Facebookname.reset()
  }

  Letsgrow(){
    if(this.toogleBool == true){
      if(this.SavedYoutubeLink != undefined||this.SavedInstagramLink != undefined||this.SavedTwitterLink != undefined||this.SavedFacebookLink != undefined){
        const data ={
          youtubeLink:this.SavedYoutubeLink,
          instagramLink:this.SavedInstagramLink,
          twitterLink:this.SavedTwitterLink,
          facebookLink:this.SavedFacebookLink
        }
        this._HomeService.addinfluencerdata(data).subscribe((res:any)=>{
          if(res.status == 201){
            this.promo_option = false;
            this.promo_Verify_Done = false;
            this.promo_pending = true;
            this._SharedService.successToast("Influencer Request Created") 
          }
          if(res.status == 500){
            this._SharedService.errorToast(res.message)
          }
          if(res.status == 401){
            this._SharedService.errorToast(res.message)
          }
        }); 
      }else{
        this._SharedService.errorToast("Enter Atleast one URL")
      }
    }else{
      this._SharedService.errorToast("please check checkbox")
    }
  }

  PromoteProductByInfluencer(item:any){
    const data ={
      productId:item._id
    }
    this._HomeService.productPromoteByInfluncer(data).subscribe((res:any)=>{
      if(res.status == 201){
        this._SharedService.successToast(res.message)
        this.router.navigate(['/user-profile'])
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 400){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  likepost(e:any){
    e.isLiked = true;
    e.totalLikes = e.totalLikes + 1;
    const data = {
      "productId":e._id,
      "isLiked":true
    }
    this._ProductDetailService.likeUnlikeProduct(data).subscribe(res=>{
      // console.log(res,"like response");
    },(err)=>{
      console.log(err);
    });
  };

  unlikepost(e:any){
    e.isLiked = false;
    e.totalLikes = e.totalLikes - 1;
    const data = {
      "productId":e._id,
      "isLiked":false
    }
    this._ProductDetailService.likeUnlikeProduct(data).subscribe(res=>{
      // console.log(res,"unlike response");
    },(err)=>{
      console.log(err);
    });
  };

  followuser(e:any){
    const data = {
      "productId":e._id,
      "isFollow": true
    }
    this._HomeService.followAccount(data).subscribe(res=>{
      const response:any = res;
      e.isFollowing = true;
      this._SharedService.successToast(response.message);
    },(err)=>{
      console.log(err,"follow user error");
    });
  }

  toggleEmojiPickercomment(){
    this.showEmojiPickercomment = !this.showEmojiPickercomment;
  }

  addEmojicomment(event:any) {
    const { messagepostcommentprod } = this;
    const text = `${messagepostcommentprod}${event.emoji.native}`;
    this.messagepostcommentprod = text;
    this.showEmojiPickercomment = false;
  }

  postcommentprod(e:any,item:any){
    if(item.isRatingAllowed == false){
      this._SharedService.errorToast("You are not elegible")
    }else{
      if(this.rating != null && this.rating != undefined){
        if(e != null && e != ''){
          this.showEmojiPickercomment = false;
          const data = {
            "productId":this.SelectedProductId,
            "comment":e,
            "stars":this.rating
          };
          this._ProductDetailService.addProductComment(data).subscribe(res=>{
            const response:any = res;
            this.SelectedProductDetail[0].isCommented = true
              this._ProductDetailService.getProductAllComment({"productId":this.SelectedProductId}).subscribe(res=>{
                const response:any = res;
                this.sidebarcomment = response.data;
                this.commentboxopenlength = this.sidebarcomment.length;
              },(err)=>{
                console.log(err);
              });
              this.messagepostcommentprod = '';
          },(err)=>{
            console.log(err);
          });
        }else{
          this._SharedService.errorToast("comment required");
        }
      }else{
        this._SharedService.errorToast("Start Rating Required");
      }
    }
  };

  likecomment(e:any){
    e.isLiked = true;
    e.totalLikes = e.totalLikes + 1;
    const data = {
      "commentId":e._id,
      "isLiked":true
    }
    this._ProductDetailService.commentLikeUnlike(data).subscribe(res=>{
      // console.log(res,"like comment response");
    },(err)=>{
      console.log(err);
    });
  };

  unlikecomment(e:any){
    e.isLiked = false;
    e.totalLikes = e.totalLikes - 1;
    const data = {
      "commentId":e._id,
      "isLiked":false
    }
    this._ProductDetailService.commentLikeUnlike(data).subscribe(res=>{
      // console.log(res,"unlike comment response");
    },(err)=>{
      console.log(err);
    });
  };

  likecommentinner(e:any){
    e.isLiked = true;
    e.totalLikes = e.totalLikes + 1;
    const data = {
      "subCommentId":e._id,
      "isLiked":true
    }
    this._ProductDetailService.commentLikeUnlikeinner(data).subscribe(res=>{
      // console.log(res,"unlike comment response");
    },(err)=>{
      console.log(err);
    });
  };

  unlikecommentinner(e:any){
    e.isLiked = false;
    e.totalLikes = e.totalLikes - 1;
    const data = {
      "subCommentId":e._id,
      "isLiked":false
    }
    this._ProductDetailService.commentLikeUnlikeinner(data).subscribe(res=>{
      // console.log(res,"like comment response");
    },(err)=>{
      console.log(err);
    });
  };

  commentboxcancel(){
    this.messagepostcommentprod = '';
    this.showEmojiPickercomment = false;
  };

  deleteComment(e:any,i:any){
    this.deletecomment = e;
    this.deletecommentid = i;
  }

  confirmdelete(){
    const data = {
      "commentId":this.deletecomment
    }
    this._ProductDetailService.deleteProductComment(data).subscribe(res=>{
      const response:any = res;
      this._SharedService.successToast(response.message);
      this.sidebarcomment.splice(this.deletecommentid, 1);
    });
  }

  confirmdeletesub(){
    const data = {
      "subCommentId":this.deletecomment
    }
    this._ProductDetailService.deleteProductSubComment(data).subscribe(res=>{
      const response:any = res;
      this._SharedService.successToast(response.message);
      this.sidebarcommentinside.splice(this.deletecommentid, 1);
    });
  }

  commentcopy(clipboard:any){
    this.clipboard.copy(clipboard);
    this._SharedService.successToast("Comment copied to clipboard.");
  }

  editcomment(e:any){
    this.editcommentmatch = e._id;
    this.messagepostcommentsub = e.comment;
  }

  commentboxs(e:any){
    this.editcommentbox = e;
  }

  editcommentcancel(){
    this.editcommentmatch = '';
  }

  editpostcomment(e:any){
    if(this.messagepostcommentsub != null && this.messagepostcommentsub != ''){
      const data = {
        "commentId":this.editcommentmatch,
        "comment": this.sanitizer.sanitize(SecurityContext.HTML ,this.messagepostcommentsub)
      }
      this._ProductDetailService.editProductComment(data).subscribe(res=>{
        const response:any = res;
        this._SharedService.successToast(response.message);
        this.editcommentmatch = '';
        e.comment = response.comment;
        e.edited = true;
      },(err)=>{
        console.log(err);
      });
    }else{
      this._SharedService.errorToast("values required.");
    };
  };

  toggleEmojiPickersub() {
    this.showEmojiPickersub = !this.showEmojiPickersub;
  };

  addEmojisub(event:any) {
    const { messagepostcommentsub } = this;
    const text = `${messagepostcommentsub}${event.emoji.native}`;
    this.messagepostcommentsub = text;
    this.showEmojiPickersub = false;
  };

  toggleEmojiPickersubinner() {
    this.showEmojiPickersubinner = !this.showEmojiPickersubinner;
  };

  addEmojisubinner(event:any){
    const { messagepostcommentsubinner } = this;
    const text = `${messagepostcommentsubinner}${event.emoji.native}`;
    this.messagepostcommentsubinner = text;
    this.showEmojiPickersubinner = false;
  };

  toggleEmojiPickersubcomment(){
    this.showEmojiPickersubcomment = !this.showEmojiPickersubcomment;
  };

  addEmojisubinnercomment(event:any){
    const { messagesubcomment } = this;
    const text = `${messagesubcomment}${event.emoji.native}`;
    this.messagesubcomment = text;
    this.showEmojiPickersubcomment = false;
  };

  subcommentcancel(){
    this.editcommentbox = '';
  };

  subcommentcancelinner(){
    this.messagesubcomment = '';
    this.editcommentboxinner = '';
    this.editsubcommenttogg = false;
  }

  editcommentsub(e:any){
    if(this.messagesubcomment != null && this.messagesubcomment != ''){
      const data = {
        "subCommentId":e._id,
        "comment": this.sanitizer.sanitize(SecurityContext.HTML ,this.messagesubcomment)
      }
      this._ProductDetailService.editProductSubComment(data).subscribe(res=>{
        const response:any = res;
        this.editsubcommenttogg = false;
        this.messagesubcomment = '';
        this.editcommentboxinner = '';
        e.comment = response.comment;
        e.edited = true;
        this._SharedService.successToast("comment insert");
      },(err)=>{
        console.log(err);
      });
    }else{
      this._SharedService.errorToast("values required.");
    }
  };

  replypostcomment(e:any){
  if(this.messagepostcommentsubinner != null && this.messagepostcommentsubinner != ''){
      const data = {
        "productCommentId":this.editcommentbox,
        "comment": this.sanitizer.sanitize(SecurityContext.HTML ,this.messagepostcommentsubinner)
      };
      this._ProductDetailService.addProductSubComment(data).subscribe(res=>{
        const response:any = res;
        this._SharedService.successToast("comment insert");
        this.editcommentbox = '';
        this.messagepostcommentsubinner = '';
        console.log(response,"postsub-comment-reply");
      },(err)=>{
        console.log(err);
      });
    }else{
        this._SharedService.errorToast("values required.");
    };
  };

  replypostcommentsub(e:any,innercomment:any){
    if(this.messagesubcomment != null && this.messagesubcomment != ''){
      if(innercomment.selfComment == false){
        this.taggscomment = `@${innercomment.userDetails[0].username} `
      }else{
        this.taggscomment = '';
      }
      const data = {
        "productCommentId":e._id,
        "comment":`${this.taggscomment}${this.messagesubcomment}`
      };
      this._ProductDetailService.addProductSubComment(data).subscribe(res=>{
        const response:any = res;
        this._SharedService.successToast("comment insert");
        this.editcommentboxinner = '';
        this.messagesubcomment = '';
        this._ProductDetailService.getProductAllSubComment(this.postImageCommentId).subscribe(res=>{
          const response:any = res;
          this.sidebarcommentinside = response.data;
        });
      },(err)=>{
        console.log(err);
      });
    }else{
        this._SharedService.errorToast("values required.");
    };
  }

  showallreplies(e:any){
    this.postImageCommentId = {
      "productCommentId":e
    }
    this._ProductDetailService.getProductAllSubComment(this.postImageCommentId).subscribe(res=>{
      const response:any = res;
      this.showhidereplies = e;
      this.sidebarcommentinside = response.data;
    });
  }

  hideshowreplies(e:any){
    this.showhidereplies = '';
  }

  innercommentbox(e:any){
    this.editcommentboxinner = e;
    this.editsubcommenttogg = false;
    this.messagesubcomment = "";
  }

  editcommentinner(e:any){
    this.editcommentboxinner = e._id;
    this.messagesubcomment = e.comment;
    this.editsubcommenttogg = true;
  }

  colorvaration(data:any){
    // console.log(data,"data-product-direct-link");
    this.router.navigate(['/product-detail',btoa(data)]);
  }

  datazoomimg(){
    if (window.innerWidth > 1199){
      $('body').css({
        'overflow-y': 'hidden',
      });
      let driftAll = document.querySelectorAll('.data-zoomer img');
      let pane:any = document.querySelector('.drift-zoom');
      $(driftAll).each((i:any, el:any) => {
          let drift:any = new Drift(
            el, {
              zoomFactor: 3,
              paneContainer: pane,
              handleTouch: false
            }
          );
          setTimeout(() => {
            this.dataimgzoomer = true;
          }, 100);
      });
    }
  }

  datazoomimgout(){
    if (window.innerWidth > 1199) {
      $('body').css({
        'overflow-y': '',
      });
      this.dataimgzoomer = false;
    }
  }

  config: Slick.Config = {
    infinite: true,
    slidesToShow: 7,
    vertical: true,
    verticalSwiping: true,
    slidesToScroll: 1,
    dots: false,
    autoplay: false,
    autoplaySpeed: 2000,
    asNavFor: '.slider-preview',
    focusOnSelect: true,
    prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-up"></i></button>',
    nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-down"></i></button>',
  }

  // responsive: [
  //   {
  //     breakpoint: 767,
  //     settings: {
  //       vertical: false,
  //     }
  //   },
  //   {
  //     breakpoint: 479,
  //     settings: {
  //       vertical: false,
  //       slidesPerRow: 3,
  //       slidesToShow: 3,
  //     }
  //   },
  // ]

  configs: Slick.Config = {
    autoplay: false,
    vertical: true, 
    infinite: true,
    mouseWheelMove:false,
    verticalSwiping: false,
    slidesToShow: 1,
    dots: false,
    autoplaySpeed: 2000,
    asNavFor: '.slider-thumb',
    arrows: false,
    draggable: false,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          vertical: false,
        }
      },
      {
        breakpoint: 479,
          settings: {
            vertical: false,
            slidesPerRow: 1,
            slidesToShow: 1,
          }
      },
    ]
  }  

  EmbededData(item:any){
    console.log(item,"item")
    this.SelectedEmbededProduct = item
  }

  chkboxevent(event:any){
    this.ShowWishBuyBtn = event.target.checked
    this.Activateroute.paramMap.subscribe((params:any) => {
      var url_decoded = this.Base64EncodeUrl(params.get('id'));
      this.iFrameURL = `${this.router['location']._platformLocation.location.origin}/embed/${url_decoded}${this.ShowWishBuyBtn?'?showButton=true':''}`;
      this.embedIframe = `<iframe width="320" height="425" src="${this.iFrameURL}" frameborder="0"></iframe>`;
    });
  }

  Base64EncodeUrl(str:any){
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
  }

  embedCopyCode(){
    this.clipboard.copy(this.embedIframe);
    this._SharedService.successToast('link copy to clipboard')
  }

  ngOnDestroy(){
    this._authentication.navbarsub.next(true);
  }
}