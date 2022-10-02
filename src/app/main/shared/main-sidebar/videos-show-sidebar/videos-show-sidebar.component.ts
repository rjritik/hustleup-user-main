import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserprofileService } from 'src/app/main/modules/userprofile/userprofile.service';
import { VideosService } from 'src/app/main/modules/videos/videos.service';
import { SharedService } from '../../shared.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { HomeService } from 'src/app/main/modules/home/home.service';

@Component({
  selector: 'app-videos-show-sidebar',
  templateUrl: './videos-show-sidebar.component.html',
  styleUrls: ['./videos-show-sidebar.component.css']
})
export class VideosShowSidebarComponent implements OnInit {
  @Input() set SingleVideoData(params: any) {
    if(params){
      this.singlePostVideoDetail = params;
      if(this.singlePostVideoDetail.withoutNavBar) this.withoutNavBar = true; else this.withoutNavBar = false;
      this.GetPostVideosAllComments(this.singlePostVideoDetail._id);
    }
  }
  @Input() videodetailsopen:any;
  @Output() closebar = new EventEmitter<string>();
  @Input() set iconClickType(params: any) {
    if(params){
      if(params.iconClick == true){
        if(params.SinglePostData) this.singlePostVideoDetail = params.SinglePostData;
        if(params.type == "comment") this.commentVideo(this.singlePostVideoDetail);
        if(params.type == "sharePost") this.postshare();
        if(params.type == "userPromote") {
          if(this.singlePostVideoDetail.userDetails?.length > 0)  this.PromoteClick(this.singlePostVideoDetail.userDetails[0]._id);
        }
        if(params.type == "coffee") this.CoffeeIconClick(this.singlePostVideoDetail.userDetails[0]);
      }else{
        if(this.commentbox == true) this.commentbox = false;
        if(this.shareDetail?.sharepost == true) this.shareDetail ={sharepost:false};
        if(this.promoteDetail?.promotepost == true) this.promoteDetail = {promotepost:false};
        if(this.coffeeDetail?.buymecoffee == true) this.coffeeDetail = {buymecoffee:false};
      }
    }
  }
  public withoutNavBar:boolean;
  public singlePostVideoDetail:any;
  public IsInfluencer:boolean = false;
  public IsSeller:boolean = false;
  public IsSellerNdInfluencer:boolean = false;
  private sideoverhide:any;
  public commentbox:any;
  public sharepost:any;
  public shareDetail:any;
  public coffeeDetail:any;
  public promoteDetail:any;
  public promotepost:any;
  public PromoteProducts:any = [];
  public promo_option:boolean = false;
  public promo_Verify_Done:boolean = false;
  public promo_pending:boolean = false;


  /*-------------Comment Start-------------- */
  public sidebarcomment:any=[];
  public messagevideocomment = '';
  public showEmojiPicker = false;
  public showEmojiPickercomment = false;
  public messagevideocommentside = '';
  public messagevideocommentsub  = '';
  public editcommentmatch:any;
  public deletecomment:any;
  public deletecommentid:any;
  public showEmojiPickersub = false;
  public editcommentbox:any;
  public showhidereplies:any;
  public sidebarcommentinside:any=[];
  public messagevideocommentsubinner:any='';
  public showEmojiPickersubinner = false;
  public editcommentboxinner:any;
  public messagesubcomment = '';
  public editsubcommenttogg = false;
  public showEmojiPickersubcomment = false;
  public taggscomment:any;
  /*-------------Comment End-------------- */
  public currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');


  constructor(private _Router:Router, private _VideosService:VideosService,private _AuthenticationService:AuthenticationService, private _UserprofileService:UserprofileService, private _SharedService:SharedService, private clipboard:Clipboard, private _HomeService:HomeService) { }

  ngOnInit(): void {
    // if(this._AuthenticationService.isSeller == true){
    //   this.IsSeller = true;
    //   this.IsSellerNdInfluencer = true;
    // }
    // if(this._AuthenticationService.isInfluencer == true){
    //   this.IsInfluencer = true;
    //   this.IsSellerNdInfluencer = true;
    // }
  }

  SavedUnsavedPostVideo(item:any){
    const data = {
      postId:item._id,
      isBookmarked:!item.isBookmarked
  }
    this._UserprofileService.bookmarkPostVideo(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message);
        item.isBookmarked = !item.isBookmarked;
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }

    },(err)=>{
      this._SharedService.errorToast(err)
    })
  }

  postvideoopen(data:any){
    this.videodetailsopen = !this.videodetailsopen;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
    this.singlePostVideoDetail = data;
    this.GetPostVideosAllComments(data._id)
  };

  closesidebar(){
    this.closebar.emit('');
    this.sideoverhide = false;
    this.videodetailsopen = false;
    this.commentbox = false;
    this.sharepost = {sharepost:false};
    this.coffeeDetail = {buymecoffee:false};
    this.promotepost = {promotepost:false};
    $('body').css({
      'overflow-y': 'auto',
    });
  };

  followANDunfollow(e:any){
    const data = {
      userId:e.userId,
      isFollowing: !e.isFollowing
    }
    console.log(data,"follow user");
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

  LikeUnlikeVideo(e:any){
    const data = {
      postId:e._id,
      isLiked:!e.isLiked
    }
    console.log(data, 'Likepost data');
    this._VideosService.likeUnlikePostImages(data).subscribe((res:any)=>{
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
    if(this.singlePostVideoDetail.withoutNavBar){
      this.shareDetail = {sharepost:true,withoutNavBar:true};
    }else{
      this.shareDetail = {sharepost:true};
    }
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  };

  SaveUnsaveVideo(e:any){
    const data = {
      postId:e._id,
      isBookmarked:!e.isBookmarked
    };
    this._VideosService.bookmarkPostVideo(data).subscribe((res:any)=>{
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
    if(this.singlePostVideoDetail.withoutNavBar){
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
    if(this.singlePostVideoDetail.withoutNavBar){
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
    this._VideosService.shopproduct(datas).subscribe((res:any)=>{
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
  commentVideo(data:any){
    this.commentbox = !this.commentbox;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
    this.singlePostVideoDetail = data;
    this.GetPostVideosAllComments(data._id)
  };

  GetPostVideosAllComments(postvideoid:any){
    const data = {
      postVideoId:postvideoid
    };
    this._VideosService.getPostVideoAllComments(data).subscribe((res:any)=>{
      if(res.status == 201) {
        this.sidebarcomment = res.data;
        this.singlePostVideoDetail.totalComments = this.sidebarcomment.length
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
    const { messagevideocomment } = this;
    const text = `${messagevideocomment}${event.emoji.native}`;
    this.messagevideocomment = text;
    this.showEmojiPicker = false;
  }

  commentcancel(){
    this.messagevideocomment = '';
    this.showEmojiPicker = false;
    this.showEmojiPickercomment = false;
  };

  postcomment(e:any){
    if(e != null && e != ''){
      this.showEmojiPicker = false;
      this.showEmojiPickercomment = false;
      const data = {
        postVideoId:this.singlePostVideoDetail._id,
        comment:e
      };
      this._VideosService.postVideoComments(data).subscribe((res:any)=>{
        console.log(res,"postVideoComments");
        if(res.status == 201){
          this.GetPostVideosAllComments(res.data.postVideoId)
          this.messagevideocomment = '';
          this.messagevideocommentside = '';
        }else{
          this._SharedService.errorToast(res.message) 
        }
      },(err)=>{
        this._SharedService.errorToast(err)
      });
    }else{
      this._SharedService.errorToast("comment required");
    }
  };

  editcomment(e:any){
    this.editcommentmatch = e._id;
    this.messagevideocommentsub  = e.comment;
  };

  deleteComment(e:any,i:any){
    this.deletecomment = e;
    this.deletecommentid = i;
  };

  commentcopy(clipboard:any){
    this.clipboard.copy(clipboard);
    this._SharedService.successToast("Comment copied to clipboard.");  
  };

  confirmdelete(){
    const data = {
      commentId:this.deletecomment
    }
    this._VideosService.deleteComment(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.sidebarcomment.splice(this.deletecommentid, 1);
        this._SharedService.successToast(res.message);
        this.singlePostVideoDetail.totalComments = this.sidebarcomment.length
      }
      if(res.status == 500) this._SharedService.errorToast(res.message)
      if(res.status == 404) this._SharedService.errorToast(res.message)
    });
  };

  toggleEmojiPickersub(){
    this.showEmojiPickersub = !this.showEmojiPickersub;
  };

  addEmojisub(event:any) {
    const { messagevideocommentsub  } = this;
    const text = `${messagevideocommentsub }${event.emoji.native}`;
    this.messagevideocommentsub  = text;
    this.showEmojiPickersub = false;
  };

  editcommentcancel(){
    this.editcommentmatch = '';
  }

  editvideocommentsave(e:any){
    if(this.messagevideocommentsub  != null && this.messagevideocommentsub  != ''){
      const data = {
        commentId:this.editcommentmatch,
        comment:this.messagevideocommentsub 
      }
      this._VideosService.editComment(data).subscribe((res:any)=>{
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
    this._VideosService.commentLikeUnlike(data).subscribe((res:any)=>{
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
      postVideoCommentId:e
    }
    this._VideosService.postVideoSubCommentsgetall(data).subscribe((res:any)=>{
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
    const { messagevideocommentsubinner  } = this;
    const text = `${messagevideocommentsubinner }${event.emoji.native}`;
    this.messagevideocommentsubinner  = text;
    this.showEmojiPickersubinner = false;
  };

  subcommentcancel(){
    this.editcommentbox = '';
  };

  replyvideocomment(e:any){
    if(this.messagevideocommentsubinner  != null && this.messagevideocommentsubinner  != ''){
      const data = {
        postVideoCommentId:this.editcommentbox,
        comment:this.messagevideocommentsubinner 
      };
      this._VideosService.addPostVideoSubComment(data).subscribe((res:any)=>{
        if(res.status == 201){
          this.showallreplies(res.data.postVideoCommentId)
          e.totalComments +=1;
          this.showhidereplies = res.data.postVideoCommentId
          this.editcommentbox = '';
          this.messagevideocommentsubinner = '';
          this._SharedService.successToast("comment insert");
        }
        else this._SharedService.errorToast(res.message)
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

  LikeUnlikeInnerComment(e:any){
    const data = {
      subCommentId:e._id,
      isLiked:!e.isLiked
    }
    this._VideosService.commentLikeUnlikeinner(data).subscribe((res:any)=>{
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

  replyvideocommentsub(e:any,innercomment:any){
    if(this.messagesubcomment != null && this.messagesubcomment != ''){
      if(innercomment.selfComment == false){
        this.taggscomment = `@${innercomment.userDetails[0].username} `
      }else{
        this.taggscomment = '';
      }
      const data = {
        postVideoCommentId:e._id,
        comment:`${this.taggscomment}${this.messagesubcomment}`
      };
      this._VideosService.addPostVideoSubComment(data).subscribe((res:any)=>{
        console.log(res,"addPostVideoSubComment")
        if(res.status == 201){
          this.showallreplies(res.data.postVideoCommentId)
          e.totalComments +=1;
          this.showhidereplies = res.data.postVideoCommentId
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
      this._VideosService.editPostVideoSubComment(data).subscribe((res:any)=>{
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
        this._SharedService.errorToast(err)
      });
    }else{
      this._SharedService.errorToast("values required.");
    }
  };
  
  toggleEmojiPickercomment(){
    this.showEmojiPickercomment = !this.showEmojiPickercomment;
  }

  addEmojicomment(event:any) {
    const { messagevideocommentside } = this;
    const text = `${messagevideocommentside}${event.emoji.native}`;
    this.messagevideocommentside = text;
    this.showEmojiPickercomment = false;
  }

  confirmdeletesub(){
    const data = {
      subCommentId:this.deletecomment
    }
    this._VideosService.deleteSubComment(data).subscribe((res:any)=>{
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

  /* -----------------Comment End-----------------------------*/

}
