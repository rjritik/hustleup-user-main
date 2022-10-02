import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/main/modules/home/home.service';
import { SharedService } from '../../shared.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';

@Component({
  selector: 'app-imgeas-show-sidebar',
  templateUrl: './imgeas-show-sidebar.component.html',
  styleUrls: ['./imgeas-show-sidebar.component.css']
})
export class ImgeasShowSidebarComponent implements OnInit {
  @Input() set SinglePostData(params: any) {
    if(params){
      this.singlePostImageDetail = params;
      if(this.singlePostImageDetail.withoutNavBar) this.withoutNavBar = true; else this.withoutNavBar = false;
      this.GetPostImagesAllComments(this.singlePostImageDetail._id);
    }
  }
  @Input() postdetailsopen:any;
  @Output() closebar = new EventEmitter<string>();
  @Input() set iconClickType(params: any) {
    if(params){
      if(params.iconClick == true){
        if(params.SinglePostData) this.singlePostImageDetail = params.SinglePostData;
        if(params.type == "comment") this.commentpost(this.singlePostImageDetail);
        if(params.type == "sharePost") this.postshare();
        if(params.type == "userPromote") {
          if(this.singlePostImageDetail.userDetails?.length > 0)  this.PromoteClick(this.singlePostImageDetail.userDetails[0]._id);
        }
        if(params.type == "coffee") this.CoffeeIconClick(this.singlePostImageDetail.userDetails[0]);
      }else{
        if(this.commentbox == true) this.commentbox = false;
        if(this.shareDetail?.sharepost == true) this.shareDetail = {sharepost:false};
        if(this.promoteDetail?.promotepost == true) this.promoteDetail = {promotepost:false};
        if(this.coffeeDetail?.buymecoffee == true) this.coffeeDetail = {buymecoffee:false};
      }
    }
  }
  public withoutNavBar:boolean;
  public singlePostImageDetail:any;
  public IsInfluencer:boolean = false;
  public IsSeller:boolean = false;
  public IsSellerNdInfluencer:boolean = false;
  private sideoverhide:any;
  public commentbox:any;
  public shareDetail:any;
  public coffeeDetail:any;
  public promoteDetail:any;
  public promo_option:boolean = false;
  public promo_Verify_Done:boolean = false;
  public promo_pending:boolean = false;
  public PromoteProducts:any = [];

  /*-------------Comment Start-------------- */
  public messagepostcomment = '';
  public commentboxopenlength:any;
  public messagepostcommentside = '';
  public showEmojiPickercomment = false;
  public showEmojiPicker = false;
  public imgpostopenid:any;
  public sidebarcomment:any=[];
  public editcommentmatch:any;
  public messagepostcommentsub = '';
  public showEmojiPickersub = false;
  public editcommentbox:any;
  public showhidereplies:any;
  public sidebarcommentinside:any;
  public messagepostcommentsubinner = '';
  public showEmojiPickersubinner = false;
  public editcommentboxinner:any;
  public messagesubcomment = '';
  public editsubcommenttogg = false;
  public showEmojiPickersubcomment = false;
  public taggscomment:any;
  public deletecomment:any;
  public deletecommentid:any;
  /*-------------Comment End-------------- */
  public currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');
  
  constructor(private _HomeService:HomeService,private _AuthenticationService:AuthenticationService, private _SharedService:SharedService,private clipboard: Clipboard, private _Router:Router) {
  }

  ngOnInit(): void{
  }

  closesidebar(){
    this.closebar.emit('');
    this.sideoverhide = false;
    this.commentbox = false;
    this.shareDetail = {sharepost:false};
    this.promoteDetail = {promotepost:false};
    this.coffeeDetail = {buymecoffee:false};
    this.postdetailsopen = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };

  followANDunfollow(e:any){
    const data = {
      userId:e.userId,
      isFollowing: !e.isFollowing
    }
    this._HomeService.followAccount(data).subscribe((res:any)=>{
      if(res.status == 200){
        e.isFollowing = !e.isFollowing;
        this._SharedService.successToast(res.message);
      }
      if(res.status == 500) this._SharedService.errorToast(res.message);
      if(res.status == 404) this._SharedService.errorToast(res.message);
      
    },(err)=>{
      this._SharedService.errorToast(err);
    });
  }

  hashtagclick(hashtag:any){
    const itm =window.btoa(JSON.stringify({hashtagName:hashtag}));
    localStorage.setItem("hasgtagsdetail",itm);
    this._Router.navigate(['/hashtags-details/hashtags-postdetails']);
  }

  LikeUnlikePost(e:any){
    const data = {
      postId:e._id,
      isLiked:!e.isLiked
    }
    this._HomeService.likeUnlikePostImages(data).subscribe((res:any)=>{
      if(res.status == 200){
        e.isLiked = !e.isLiked;
        if(e.isLiked) e.totalLikes = e.totalLikes + 1;
        else e.totalLikes = e.totalLikes - 1;
        this._SharedService.successToast(res.message);
      }
      if(res.status == 500) this._SharedService.errorToast(res.message);
      if(res.status == 404) this._SharedService.errorToast(res.message);
    },(err)=>{
      this._SharedService.errorToast(err);
    });
  };

  postshare(){
    if(this.singlePostImageDetail.withoutNavBar){
      this.shareDetail = {sharepost:true,withoutNavBar:true};
    }else{
      this.shareDetail = {sharepost:true};
    }
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  };

  SaveUnsavePost(e:any){
    const data = {
      postId:e._id,
      isBookmarked:!e.isBookmarked
    };
    this._HomeService.bookmarkPostImage(data).subscribe((res:any)=>{
      if(res.status == 200){
        e.isBookmarked = !e.isBookmarked;
        this._SharedService.successToast(res.message);
      }
      if(res.status == 500) this._SharedService.errorToast(res.message);
      if(res.status == 404) this._SharedService.errorToast(res.message);
      
    },(err)=>{
      this._SharedService.errorToast(err);
    });
  };

  CoffeeIconClick(userdetail:any){
    if(this.singlePostImageDetail.withoutNavBar){
      this.coffeeDetail = {influencerDetail:userdetail,buymecoffee:true,withoutNavBar:true};
    }else{
      this.coffeeDetail = {influencerDetail:userdetail,buymecoffee:true};
    }
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  };

  PromoteClick(sellerId:any){
    if(this.singlePostImageDetail.withoutNavBar){
      this.promoteDetail = {sellerId: sellerId, promotepost:true,withoutNavBar:true};
    }else{
      this.promoteDetail = {sellerId: sellerId, promotepost:true};
    }
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
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
  
 

  /* -----------------Comment Start-----------------------------*/
    commentpost(data:any){
      this.commentbox = !this.commentbox;
      this.sideoverhide = true;
      $('body').css({
        'overflow-y': 'hidden',
      });
      this.singlePostImageDetail = data;
      this.GetPostImagesAllComments(data._id);
    };

    GetPostImagesAllComments(postimageid:any){
      const data = {
        postImageId:postimageid
      };
      this._HomeService.getPostImageAllComments(data).subscribe((res:any)=>{
        if(res.status == 201) {
          this.sidebarcomment = res.data;
          this.singlePostImageDetail.totalComments = this.sidebarcomment.length
        }
        if(res.status == 500) this._SharedService.errorToast(res.message)
        if(res.status == 404) this._SharedService.errorToast(res.message)
        
      },(err)=>{
        this._SharedService.errorToast(err)
      });
    }
  
    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker;
    }
  
    addEmoji(event:any) {
      const { messagepostcomment } = this;
      const text = `${messagepostcomment}${event.emoji.native}`;
      this.messagepostcomment = text;
      this.showEmojiPicker = false;
    }
  
    commentcancel(){
      this.messagepostcomment = '';
      this.showEmojiPicker = false;
    };
  
    toggleEmojiPickercomment(){
      this.showEmojiPickercomment = !this.showEmojiPickercomment;
    }
  
    addEmojicomment(event:any) {
      const { messagepostcommentside } = this;
      const text = `${messagepostcommentside}${event.emoji.native}`;
      this.messagepostcommentside = text;
      this.showEmojiPickercomment = false;
    }
  
    commentboxcancel(){
      this.messagepostcomment = '';
      this.showEmojiPickercomment = false;
    };
  
    postcomment(e:any){
      if(e != null && e != ''){
        this.showEmojiPicker = false;
        this.showEmojiPickercomment = false;
        const data = {
          postImageId:this.singlePostImageDetail._id,
          comment:e
        };
        this._HomeService.postImageComments(data).subscribe((res:any)=>{
          if(res.status == 201){
            this.GetPostImagesAllComments(res.data.postImageId)
            this.messagepostcomment = '';
            this.messagepostcommentside = '';
          }
          if(res.status == 500) this._SharedService.errorToast(res.message)
          if(res.status == 401) this._SharedService.errorToast(res.message)
          if(res.status == 404) this._SharedService.errorToast(res.message)
            
        },(err)=>{
          this._SharedService.errorToast(err)
        });
      }else{
        this._SharedService.errorToast("comment required");
      }
    };
  
    editcomment(e:any){
      this.editcommentmatch = e._id;
      this.messagepostcommentsub = e.comment;
    }
  
    commentcopy(clipboard:any){
      this.clipboard.copy(clipboard);
      this._SharedService.successToast("Comment copied to clipboard.");
    }
  
    toggleEmojiPickersub(){
      this.showEmojiPickersub = !this.showEmojiPickersub;
    };
  
    addEmojisub(event:any) {
      const { messagepostcommentsub } = this;
      const text = `${messagepostcommentsub}${event.emoji.native}`;
      this.messagepostcommentsub = text;
      this.showEmojiPickersub = false;
    };
  
    editcommentcancel(){
      this.editcommentmatch = '';
    }
  
    editpostcomment(e:any){
      if(this.messagepostcommentsub != null && this.messagepostcommentsub != ''){
        const data = {
          commentId:this.editcommentmatch,
          comment:this.messagepostcommentsub
        }
        this._HomeService.editComment(data).subscribe((res:any)=>{
          if(res.status == 200){
            this.editcommentmatch = '';
            e.comment = res.comment;
            e.edited = true;
            this._SharedService.successToast(res.message);
          }
          if(res.status == 500) this._SharedService.errorToast(res.message)
          if(res.status == 404) this._SharedService.errorToast(res.message)
  
        },(err)=>{
          this._SharedService.errorToast(err)
        });
      }else{
        this._SharedService.errorToast("values required.");
      };
    };
  
    LikeUnlikeComment(e:any){
      const data = {
        commentId:e._id,
        isLiked:!e.isLiked
      }
      this._HomeService.commentLikeUnlike(data).subscribe((res:any)=>{
        if(res.status == 200){
          e.isLiked = !e.isLiked;
          if(e.isLiked) e.totalLikes = e.totalLikes + 1;
          else e.totalLikes = e.totalLikes - 1;
          this._SharedService.successToast(res.message);
        }
        if(res.status == 500) this._SharedService.errorToast(res.message);
        if(res.status == 404) this._SharedService.errorToast(res.message);
      },(err)=>{
        this._SharedService.errorToast(err);
      });
    };
  
    commentboxs(e:any){
      this.editcommentbox = e;
    }
  
    hideshowreplies(e:any){
      this.showhidereplies = '';
    }
  
    showallreplies(e:any){
      const data = {
        postImageCommentId:e
      }
      this._HomeService.postImageSubCommentsgetall(data).subscribe((res:any)=>{
        if(res.status == 201){
          this.showhidereplies = e;
          this.sidebarcommentinside = res.data;
        }
        if(res.status == 500) this._SharedService.errorToast(res.message)
        if(res.status == 404) this._SharedService.errorToast(res.message)
      });
    }
  
    toggleEmojiPickersubinner() {
      this.showEmojiPickersubinner = !this.showEmojiPickersubinner;
    };
  
    addEmojisubinner(event:any){
      const { messagepostcommentsubinner } = this;
      const text = `${messagepostcommentsubinner}${event.emoji.native}`;
      this.messagepostcommentsubinner = text;
      this.showEmojiPickersubinner = false;
    };
  
    subcommentcancel(){
      this.editcommentbox = '';
    };
  
    replypostcomment(e:any){
      if(this.messagepostcommentsubinner != null && this.messagepostcommentsubinner != ''){
        const data = {
          postImageCommentId:this.editcommentbox,
          comment:this.messagepostcommentsubinner
        };
        this._HomeService.addPostImageSubComment(data).subscribe((res:any)=>{
          if(res.status == 201){
            this.showallreplies(res.data.postImageCommentId)
            e.totalComments +=1;
            this.showhidereplies = res.data.postImageCommentId
            this.editcommentbox = '';
            this.messagepostcommentsubinner = '';
            this._SharedService.successToast("comment insert");
          }
          if(res.status == 500) this._SharedService.errorToast(res.message)
          if(res.status == 404) this._SharedService.errorToast(res.message)
        },(err)=>{
          this._SharedService.errorToast(err)
        });
      }else{
          this._SharedService.errorToast("values required.");
        };
    };
  
    editcommentinner(e:any){
      this.editcommentboxinner = e._id;
      this.messagesubcomment = e.comment;
      this.editsubcommenttogg = true;
    }
  
    deleteComment(e:any,i:any){
      this.deletecomment = e;
      this.deletecommentid = i;
    }
  
    confirmdelete(){
      const data = {
        commentId:this.deletecomment
      }
      this._HomeService.deleteComment(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.sidebarcomment.splice(this.deletecommentid, 1);
          this.singlePostImageDetail.totalComments = this.sidebarcomment.length
          this._SharedService.successToast(res.message);
        }
        if(res.status == 500) this._SharedService.errorToast(res.message)
        if(res.status == 404) this._SharedService.errorToast(res.message)
      });
    }
  
    confirmdeletesub(){
      const data = {
        subCommentId:this.deletecomment
      }
      this._HomeService.deleteSubComment(data).subscribe((res:any)=>{
        if(res.status == 200){
          this._SharedService.successToast(res.message);
          const index = this.sidebarcomment.findIndex((comment:any)=>{return comment._id == this.showhidereplies});
          if(index !== -1){
            this.sidebarcomment[index].totalComments -=1;
          }
          this.sidebarcommentinside.splice(this.deletecommentid, 1);
          this.subcommentcancel();
        }
        if(res.status == 500) this._SharedService.errorToast(res.message)
        if(res.status == 404) this._SharedService.errorToast(res.message)
      });
    }
  
    LikeUnlikeInnerComment(e:any){
      const data = {
        subCommentId:e._id,
        isLiked:!e.isLiked
      }
      this._HomeService.commentLikeUnlikeinner(data).subscribe((res:any)=>{
        if(res.status == 200){
          e.isLiked = !e.isLiked;
          if(e.isLiked) e.totalLikes = e.totalLikes + 1;
          else e.totalLikes = e.totalLikes - 1;
          this._SharedService.successToast(res.message);
        }
        if(res.status == 500) this._SharedService.errorToast(res.message);
        if(res.status == 404) this._SharedService.errorToast(res.message);
      },(err)=>{
        this._SharedService.errorToast(err);
      });
    };
  
    innercommentbox(e:any){
      this.editcommentboxinner = e;
      this.editsubcommenttogg = false;
      this.messagesubcomment = "";
    }
  
    toggleEmojiPickersubcomment() {
      this.showEmojiPickersubcomment = !this.showEmojiPickersubcomment;
    };
  
    addEmojisubinnercomment(event:any){
      const { messagesubcomment } = this;
      const text = `${messagesubcomment}${event.emoji.native}`;
      this.messagesubcomment = text;
      this.showEmojiPickersubcomment = false;
    };
  
    subcommentcancelinner(){
      this.messagesubcomment = '';
      this.editcommentboxinner = '';
      this.editsubcommenttogg = false;
    }
  
    replypostcommentsub(e:any,innercomment:any){
      if(this.messagesubcomment != null && this.messagesubcomment != ''){
        if(innercomment.selfComment == false){
          this.taggscomment = `@${innercomment.userDetails[0].username} `
        }else{
          this.taggscomment = '';
        }
        const data = {
          postImageCommentId:e._id,
          comment:`${this.taggscomment}${this.messagesubcomment}`
        };
        this._HomeService.addPostImageSubComment(data).subscribe((res:any)=>{
          if(res.status == 201){
            this.showallreplies(res.data.postImageCommentId)
            e.totalComments +=1;
            this.showhidereplies = res.data.postImageCommentId
            this.editcommentboxinner = '';
            this.messagesubcomment = '';
            this._SharedService.successToast("comment insert");
          }
          if(res.status == 500) this._SharedService.errorToast(res.message)
          if(res.status == 404) this._SharedService.errorToast(res.message)
        },(err)=>{
          this._SharedService.errorToast(err)
        });
      }else{
          this._SharedService.errorToast("values required.");
      };
    }
  
    editcommentsub(e:any){
      if(this.messagesubcomment != null && this.messagesubcomment != ''){
        const data = {
          subCommentId:e._id,
          comment:this.messagesubcomment
        }
        this._HomeService.editPostImageSubComment(data).subscribe((res:any)=>{
          if(res.status == 200){
            this.editsubcommenttogg = false;
            this.messagesubcomment = '';
            this.editcommentboxinner = '';
            e.comment = res.comment;
            e.edited = true;
            this._SharedService.successToast("comment insert");
          }
          if(res.status == 500) this._SharedService.errorToast(res.message)
          if(res.status == 404) this._SharedService.errorToast(res.message)
  
        },(err)=>{
          this._SharedService.errorToast(err);
        });
      }else{
        this._SharedService.errorToast("values required.");
      }
    };
  
    /* -----------------Comment End-----------------------------*/
}
function input() {
  throw new Error('Function not implemented.');
}

