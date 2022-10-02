import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BloguploadserviceService } from 'src/app/main/modules/blogs/bloguploadservice.service';
import { SharedService } from '../../shared.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HomeService } from 'src/app/main/modules/home/home.service';


@Component({
  selector: 'app-blogs-show-sidebar',
  templateUrl: './blogs-show-sidebar.component.html',
  styleUrls: ['./blogs-show-sidebar.component.css']
})
export class BlogsShowSidebarComponent implements OnInit {
  @Input() set SinglePostData(params: any) {
    if(params){
      this.singlePostBlogDetail = params;
      if(this.singlePostBlogDetail.withoutNavBar) this.withoutNavBar = true; else this.withoutNavBar = false;
      this.htmlShowing = this.sanitizer.bypassSecurityTrustHtml(this.singlePostBlogDetail.content)
      this.GetPostBlogsAllComments(this.singlePostBlogDetail._id);
    }
  }
  @Input() blogdetailsopen:any;
  @Output() closebar = new EventEmitter<string>();
  @Input() set iconClickType(params: any) {
    if(params){
      if(params.iconClick == true){
        if(params.SinglePostData) this.singlePostBlogDetail = params.SinglePostData;
        if(params.type == "comment") this.commentpost(this.singlePostBlogDetail);
        if(params.type == "sharePost") this.postshare();
        if(params.type == "userPromote") {
          if(this.singlePostBlogDetail.userDetails?.length > 0)  this.PromoteClick(this.singlePostBlogDetail.userDetails[0]._id);
        }
        if(params.type == "coffee") this.CoffeeIconClick(this.singlePostBlogDetail.userDetails[0]);
      }else{
        if(this.commentbox == true) this.commentbox = false;
        if(this.shareDetail?.sharepost == true) this.shareDetail ={sharepost:false};
        if(this.promoteDetail?.promotepost == true) this.promoteDetail = {promotepost:false};
        if(this.coffeeDetail?.buymecoffee == true) this.coffeeDetail = {buymecoffee:false};
      }
    }
  }

  public withoutNavBar:boolean;
  public singlePostBlogDetail:any;
  public htmlShowing:any;
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
  public messageblogcomment = '';
  public messageblogcommentside = '';
  public showEmojiPickercomment = false;
  public showEmojiPicker = false;
  public imgpostopenid:any;
  public sidebarcomment:any=[];
  public editcommentmatch:any;
  public messageblogcommentsub = '';
  public showEmojiPickersub = false;
  public editcommentbox:any;
  public showhidereplies:any;
  public sidebarcommentinside:any;
  public messageblogcommentsubinner  = '';
  public showEmojiPickersubinner = false;
  public editcommentboxinner:any;
  public messagesubcomment = '';
  public editsubcommenttogg = false;
  public showEmojiPickersubcomment = false;
  public taggscomment:any;
  public deletecomment:any;
  public deletecommentid:any;
  /*-------------Comment End-------------- */
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');
  
  constructor(
    private _Router:Router,
    private _BloguploadserviceService:BloguploadserviceService,
    private _HomeService:HomeService,
    private _AuthenticationService:AuthenticationService,
    private _SharedService:SharedService,
    private clipboard:Clipboard,
    private sanitizer:DomSanitizer,
  ) { }

  ngOnInit(): void{
  }

  closesidebar(){
    this.closebar.emit('');
    this.sideoverhide = false;
    this.commentbox = false;
    this.sharepost = {sharepost:false};
    this.promotepost = {promotepost:false};
    this.coffeeDetail = {buymecoffee:false};
    this.blogdetailsopen = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };

  SaveUnsaveBlog(e:any){
    const data = {
      postId:e._id,
      isBookmarked:!e.isBookmarked
    };
    this._BloguploadserviceService.bookmarkPostBlog(data).subscribe((res:any)=>{
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
    this._Router.navigate(['/hashtags-details/hashtags-blogdetails']);
  }

  LikeUnlikePostBlog(e:any){
    const data = {
      postId:e._id,
      isLiked:!e.isLiked
    }
    this._BloguploadserviceService.likeUnlikePostBlog(data).subscribe((res:any)=>{
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

  /* -----------------Comment Start-----------------------------*/
  commentpost(data:any){
    this.commentbox = !this.commentbox;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
    this.singlePostBlogDetail = data;
    this.GetPostBlogsAllComments(data._id)
  };

  GetPostBlogsAllComments(postBlogId:any){
    const data = {
      postBlogId:postBlogId
    };
    this._BloguploadserviceService.getPostBlogAllComment(data).subscribe((res:any)=>{
      if(res.status == 201){
        this.sidebarcomment = res.data;
        this.singlePostBlogDetail.totalComments = this.sidebarcomment.length
      }else{
        this._SharedService.errorToast(res.message)
      }
    },(err)=>{
      this._SharedService.errorToast(err)
    });
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event:any) {
    const { messageblogcomment } = this;
    const text = `${messageblogcomment}${event.emoji.native}`;
    this.messageblogcomment = text;
    this.showEmojiPicker = false;
  }

  commentcancel(){
    this.messageblogcomment = '';
    this.showEmojiPicker = false;
  };

  toggleEmojiPickercomment(){
    this.showEmojiPickercomment = !this.showEmojiPickercomment;
  }

  addEmojicomment(event:any) {
    const { messageblogcommentside} = this;
    const text = `${messageblogcommentside}${event.emoji.native}`;
    this.messageblogcommentside = text;
    this.showEmojiPickercomment = false;
  }

  commentboxcancel(){
    this.messageblogcomment = '';
    this.messageblogcommentside = '';
    this.showEmojiPickercomment = false;
  };

  blogcomment(e:any){
    if(e != null && e != ''){
      this.showEmojiPicker = false;
      this.showEmojiPickercomment = false;
      const data = {
        postBlogId:this.singlePostBlogDetail._id,
        comment:e
      };
      this._BloguploadserviceService.addPostBlogComment(data).subscribe((res:any)=>{
        if(res.status == 201){
          this.GetPostBlogsAllComments(res.data.postBlogId)
          this.messageblogcomment = '';
          this.messageblogcommentside = '';
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
    this.messageblogcommentsub = e.comment;
  }

  commentcopy(clipboard:any){
    this.clipboard.copy(clipboard);
    this._SharedService.successToast("Comment copied to clipboard.");
  }

  toggleEmojiPickersub() {
    this.showEmojiPickersub = !this.showEmojiPickersub;
  };

  addEmojisub(event:any) {
    const { messageblogcommentsub } = this;
    const text = `${messageblogcommentsub}${event.emoji.native}`;
    this.messageblogcommentsub = text;
    this.showEmojiPickersub = false;
  };

  editcommentcancel(){
    this.editcommentmatch = '';
  }

  editblogcomment(e:any){
    if(this.messageblogcommentsub != null && this.messageblogcommentsub != ''){
      const data = {
        commentId:this.editcommentmatch,
        comment:this.messageblogcommentsub
      }
      this._BloguploadserviceService.editComment(data).subscribe((res:any)=>{
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
    this._BloguploadserviceService.commentLikeUnlike(data).subscribe((res:any)=>{
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
      postBlogCommentId:e
    }
    this._BloguploadserviceService.postBlogSubCommentsgetall(data).subscribe((res:any)=>{
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
    const { messageblogcommentsubinner  } = this;
    const text = `${messageblogcommentsubinner }${event.emoji.native}`;
    this.messageblogcommentsubinner  = text;
    this.showEmojiPickersubinner = false;
  };

  subcommentcancel(){
    this.editcommentbox = '';
  };

  replyblogcomment(e:any){
    if(this.messageblogcommentsubinner  != null && this.messageblogcommentsubinner  != ''){
      const data = {
        postBlogCommentId:this.editcommentbox,
        comment:this.messageblogcommentsubinner 
      };
      this._BloguploadserviceService.addPostBlogSubComment(data).subscribe((res:any)=>{
        if(res.status == 201){
          this.showallreplies(res.data.postBlogCommentId)
          e.totalComments +=1;
          this.showhidereplies = res.data.postImageCommentId
          this.editcommentbox = '';
          this.messageblogcommentsubinner = '';
          this._SharedService.successToast("comment insert");
        }else{
          this._SharedService.errorToast(res.message)
        }
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
    this._BloguploadserviceService.deleteComment(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.sidebarcomment.splice(this.deletecommentid, 1);
        this.singlePostBlogDetail.totalComments = this.sidebarcomment.length
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
    this._BloguploadserviceService.deleteSubComment(data).subscribe((res:any)=>{
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
    this._BloguploadserviceService.commentLikeUnlikeinner(data).subscribe((res:any)=>{
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

  replyblogcommentsub(e:any,innercomment:any){
    if(this.messagesubcomment != null && this.messagesubcomment != ''){
      if(innercomment.selfComment == false){
        this.taggscomment = `@${innercomment.userDetails[0].username} `
      }else{
        this.taggscomment = '';
      }
      const data = {
        postBlogCommentId:e._id,
        comment:`${this.taggscomment}${this.messagesubcomment}`
      };
      this._BloguploadserviceService.addPostBlogSubComment(data).subscribe((res:any)=>{
        if(res.status == 201){
          this.showallreplies(res.data.postBlogCommentId)
          e.totalComments +=1;
          this.showhidereplies = res.data.postBlogCommentId
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
      this._BloguploadserviceService.editPostBlogSubComment(data).subscribe((res:any)=>{
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


  postshare(){
    if(this.singlePostBlogDetail.withoutNavBar){
      this.shareDetail = {sharepost:true,withoutNavBar:true};
    }else{
      this.shareDetail = {sharepost:true};
    }
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  };


  PromoteClick(sellerId:any){
    if(this.singlePostBlogDetail.withoutNavBar){
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
    this._BloguploadserviceService.shopproduct(datas).subscribe((res:any)=>{
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
      this._SharedService.errorToast(err.message)
    });
  }

  CoffeeIconClick(userdetail:any){
    if(this.singlePostBlogDetail.withoutNavBar){
      this.coffeeDetail = {influencerDetail:userdetail,buymecoffee:true,withoutNavBar:true};
    }else{
      this.coffeeDetail = {influencerDetail:userdetail,buymecoffee:true};
    }
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  };

}
