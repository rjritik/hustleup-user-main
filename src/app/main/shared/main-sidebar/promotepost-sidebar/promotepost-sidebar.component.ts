import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/main/modules/home/home.service';
import { SharedService } from '../../shared.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';


@Component({
  selector: 'app-promotepost-sidebar',
  templateUrl: './promotepost-sidebar.component.html',
  styleUrls: ['./promotepost-sidebar.component.css']
})
export class PromotepostSidebarComponent implements OnInit {
  public sellerId:any;
  public promotepost:boolean;
  public withoutNavBar:boolean;
  public singlePostImageDetail:any;
  private sideoverhide:any;
  public IsSeller:boolean = false;
  public IsInfluencer:boolean = false;
  public PromoteProducts:any = [];
  public promo_option:boolean = false;
  public promo_Verify_Done:boolean = false;
  public promo_pending:boolean = false;
  public SlideOptionspromoteproduct:any = {nav:false, items: 1, loop:false}
  URLRegx = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  public YoutubeLink:any;
  private SavedYoutubeLink:any;
  public youtubebtnshow:boolean = false;
  public InstagramLink:any;
  private SavedInstagramLink:any;
  public Instagrambtnshow:boolean = false;
  public TwitterLink:any;
  private SavedTwitterLink:any;
  public Twitterbtnshow:boolean = false;
  public FacebookLink:any;
  private SavedFacebookLink:any;
  public Facebookbtnshow:boolean = false;
  public toogleBool: boolean=false;
  
  public currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');

  @Output() closebar = new EventEmitter<string>();

  @Input() set promoteDetail(params: any) {
    if(params){
      if(params.promotepost){
        this.sellerId = params.sellerId;
        this.promotepost = true;
        if(params.withoutNavBar) this.withoutNavBar = true; else this.withoutNavBar = false;
        this.PromoteClick(this.sellerId);
      }else{
        if(this.promotepost == true) this.promotepost = false;
      }
    }
  }

  constructor(private _HomeService:HomeService,
    private _AuthenticationService:AuthenticationService, 
    private _SharedService:SharedService,
    private clipboard: Clipboard, 
    private _Router:Router) { }

  ngOnInit(): void {
    if(this._AuthenticationService.isSeller == true){
      this.IsSeller = true;
    }
    if(this._AuthenticationService.isInfluencer == true){
      this.IsInfluencer = true;
    }
  }

  closesidebar(){
    this.closebar.emit('');
    this.promotepost = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };

  PromoteClick(sellerId:any){
      this._HomeService.getInflucerStatus().subscribe((res:any)=>{
        if(res.data == 1){
          this.getProductSellerwiseforinfluencer(sellerId)
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
  };
  
  getProductSellerwiseforinfluencer(sellerid:any){
      const datas = {
        sellerId:sellerid,
        isPromotable:true
      }
      this._HomeService.shopproduct(datas).subscribe((res:any)=>{
        if(res.status == 200){
          this.PromoteProducts = res.data
        }
        if(res.status == 500){
          this._SharedService.errorToast(res.message)
        }
        if(res.status == 401){
          this._SharedService.errorToast(res.message)
        }
      },(err)=>{
        console.log(err,"shopproduct err");
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
          this.SavedYoutubeLink = youtubename.control.value
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
          this.SavedInstagramLink = Instagramname.control.value
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
          this.SavedTwitterLink = Twittername.control.value
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
          this.SavedFacebookLink = Facebookname.control.value
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
          this._Router.navigate(['/user-profile'])
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
  

}
