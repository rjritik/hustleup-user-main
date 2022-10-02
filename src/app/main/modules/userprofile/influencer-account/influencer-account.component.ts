import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from 'src/app/main/shared/shared.service';
import { HomeService } from '../../home/home.service';

@Component({
  selector: 'app-influencer-account',
  templateUrl: './influencer-account.component.html',
  styleUrls: ['./influencer-account.component.css']
})
export class InfluencerAccountComponent implements OnInit {
  promo_option:boolean = false;
  promo_Verify_Done:boolean = false;
  promo_pending:boolean = false;
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

  constructor(private _HomeService:HomeService,
              private _SharedService:SharedService,
              private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this.verifyInfluencerStaus()
  }
  
  verifyInfluencerStaus(){
    this._HomeService.getInflucerStatus().subscribe((res:any)=>{
      console.log(res,"influencer status responce")
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
  }


  saveyoutubeURL(youtubename:any){
    if(youtubename.control.status == "VALID"){
      if(youtubename.control.value != undefined){
        this.youtubebtnshow = true;
        this.SavedYoutubeLink = this.sanitizer.sanitize(SecurityContext.HTML, youtubename.control.value)
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
        this.SavedInstagramLink = this.sanitizer.sanitize(SecurityContext.HTML, Instagramname.control.value)
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
        this.SavedTwitterLink = this.sanitizer.sanitize(SecurityContext.HTML, Twittername.control.value)
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
        this.SavedFacebookLink = this.sanitizer.sanitize(SecurityContext.HTML, Facebookname.control.value)
      }
    }
  }
  RemoveFacebookURL(Facebookname:any){
    this.Facebookbtnshow = false;
    this.SavedFacebookLink = undefined;
    Facebookname.reset()
  }

  changeEvent(event:any) {
    if (event.target.checked) {
      this.toogleBool= event.target.checked;
    }
    else {
      this.toogleBool= event.target.checked;
    }
  }

  RequestForInfluencer(){
    if(this.toogleBool == true){
      if(this.SavedYoutubeLink != undefined||this.SavedInstagramLink != undefined||this.SavedTwitterLink != undefined||this.SavedFacebookLink != undefined){
        let data ={
          youtubeLink: this.sanitizer.sanitize(SecurityContext.HTML, this.SavedYoutubeLink),
          instagramLink: this.sanitizer.sanitize(SecurityContext.HTML, this.SavedInstagramLink),
          twitterLink: this.sanitizer.sanitize(SecurityContext.HTML, this.SavedTwitterLink),
          facebookLink: this.sanitizer.sanitize(SecurityContext.HTML, this.SavedFacebookLink)
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

}
