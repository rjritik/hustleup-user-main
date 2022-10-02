import { Component, HostListener, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from '../../shared/shared.service';
import { HomeService } from './home.service';
import { ActivatedRoute,Router} from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { AuthenticationService } from '../../auth/service';
import { PostImageService } from '../../store/effects/home/post-image.service';
import { PostVideoService } from '../../store/effects/video/post-video.service';
import { UserprofileService } from '../userprofile/userprofile.service';
import { ProductDetailService } from '../product-details/product-detail.service';
import { getParamByISO } from 'iso-country-currency';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  iconClickType:any;
  pageNo:number = 1;
  limit:number = 10;
  singlepostId:any;
  singlePostData:any;
  homedata:any;
  reportPostId:any;
  postdetailsopen:any;
  sideoverhide:any;
  productshop:any;
  postcommentshare:any;
  postImageCommentId:any;
  SlideOptionsproduct:any = {nav:false, items: 1, loop:false}
  reportIssue:any = [
    {
      "issue":"Sale of illegal or regulated products / services"
    },
    {
      "issue":"Scam or fraud"
    },
    {
      "issue":"Intellectual Property Violation"
    },
    {
      "issue":"False Informations"
    },
    {
      "issue":"Suicide or self-injury"
    },
    {
      "issue":"Violence or dangerous activity"
    },
    {
      "issue":"Hate speech, bullying or harrashment"
    }
  ];
  taggedProductList:any=[];
  taggedUserList:any=[];
  singleProduct:any = [];
  isAdded:any;
  products: any = [];

  IsSellerNdInfluencer:boolean = false;
  IsSeller:boolean = false;
  IsInfluencer:boolean = false;
  currencyUnit:any = getParamByISO(this._authentication.currentUserValue.countryCode, 'currency');
  public singlePostImageDetail:any

  // -------------product comment section start------------
  public postProductComment:any;
  public sidebarProductCommentList:any=[];
  public productCommentMessage:any = '';
  public showEmojiPickerProductComment:boolean = false;
  public selectedProductId:any;
  public selectedProductCommentItem:any;
  public editedProductCommentMessage:any='';
  public editPostCommentEmojiCommentBox :boolean = false;
  public selectedProductCommentDeleteItem :any;
  public selectedProductCommentDeleteIndex:number|undefined;
  public productCommentId:number|undefined;
          // ----productrereplycomment start ----------
  public forShowAllHideProductCommentId :number|undefined;
  public productReplyCommentList:any=[];
  public productReplyCommentMessage:any = '';
  public showEmojiPickerProductReplyComment:boolean = false;

  public selectedProductReplyCommentItem :any;
  public editedProductReplyCommentMessage :any = '';
  public editEmojiProductReplyCommentBox:boolean = false;
  public toggleEditProductReplyComment:boolean =  false;
  public selectedDeleteProductReplyItem :any;
  public selectedDeleteProductReplyIndex :any;
          // ----productrereplycomment End ----------

  // -------------product comment section end------------
  totalDocs = 0;
  windowOnScroll:boolean = true;

  constructor(
    private _PostImageService:PostImageService,
    private _PostVideoService:PostVideoService,
    private _authentication:AuthenticationService,
    private _HomeService:HomeService,
    private _SharedService:SharedService, 
    private _ActivatedRoute:ActivatedRoute,
    private clipboard: Clipboard,
    private router:Router,
    private sanitizer:DomSanitizer,
    private _ProductDetailService:ProductDetailService
  ){};

  ngOnInit(): void{
    if(this._authentication.isSeller == true){
      this.IsSeller = true;
      this.IsSellerNdInfluencer = true;
    }
    if(this._authentication.isInfluencer == true){
      this.IsInfluencer = true;
      this.IsSellerNdInfluencer = true;
    }
    this.fetchData();
    this.isAdded = new Array(this.products.length);
    this.isAdded.fill(false, 0, this.products.length);

  };

  fetchData(){
    this._ActivatedRoute.queryParams.subscribe(params => {
      this.singlepostId = params.id;
      if(params.id == null){
        this.GetAllPostImages(this.pageNo,this.limit);

        // --------------------ngrx Start---------------------
        // const data = {
        //   page:this.pageNo,
        //   limit:this.limit
        // }
        // const observer = this._PostImageService.getPostImage(data);
        // const getPostImageLoading$ = observer[0];
        // const getPostImageLoaded$ = observer[1];
        // const getPostImageError$ = observer[2];
        // const getPostImageData$ = observer[3];
        // getPostImageData$.subscribe(res=>{
        //   this.homedata = res;
        // });

        // --------------------ngrx End---------------------

      }else{
        this.GetSinglePostImages(params.id)  
      }
    },(err)=>{
      console.log(err);
    });
  };

  GetAllPostImages(pageNo:number,limit:number){
    const data = {
      page:pageNo, 
      limit:limit
    }
    this._HomeService.getAllPostImages(data).subscribe((res:any)=>{
      if(res.status ===200){
        this.totalDocs = res.totalDocs;
        if(this.pageNo === 1){
          this.homedata = res.data;
        }else{
          this.homedata = [...this.homedata, ...res.data];
        }
      }else{
        this._SharedService.errorToast(res.message);
      }
      },(error)=>{
        console.log(error);
    });
  }

  GetSinglePostImages(postId:any){
    const data = {
      postId
    };
    this._HomeService.getSinglePostImages(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.singlePostData = res.data;
      }else{
        this.router.navigateByUrl('/home');
      }
    },(err)=>{
      console.log(err,"postId params error");
    });
    this.isAdded = new Array(this.products.length);
    this.isAdded.fill(false, 0, this.products.length);
  };
 
  likepost(e:any){
    const data = {
      "postId":e._id,
      "isLiked":true
    }
    this._HomeService.likeUnlikePostImages(data).subscribe((res:any)=>{
      if(res.status == 200){
        e.isLiked = true;
        e.totalLikes = e.totalLikes + 1;
        this._SharedService.successToast(res.message);
      }else{
        this._SharedService.errorToast(res.message);
      }
    },(err)=>{
      console.log(err);
    });
  };

  unlikepost(e:any){
    const data = {
      "postId":e._id,
      "isLiked":false
    }
    this._HomeService.likeUnlikePostImages(data).subscribe((res:any)=>{
      if(res.status == 200){
        e.isLiked = false;
        e.totalLikes = e.totalLikes - 1;
        this._SharedService.successToast(res.message);
      }else{
        this._SharedService.errorToast(res.message);
      }
    },(err)=>{
      console.log(err);
    });
  };

  likePostProduct(e:any){
    e.isLiked = true;
    e.totalLikes = e.totalLikes + 1;
    const data = {
      "productId":e.influencerId ? e.productId : e._id,
      "isLiked":true
    }
    this._ProductDetailService.likeUnlikeProduct(data).subscribe(res=>{
      // console.log(res,"like response");
    },(err)=>{
      console.log(err);
    });
  };

  unlikePostProduct(e:any){
    e.isLiked = false;
    e.totalLikes = e.totalLikes - 1;
    const data = {
      "productId":e.influencerId ? e.productId : e._id,
      "isLiked":false
    }
    this._ProductDetailService.likeUnlikeProduct(data).subscribe(res=>{
      // console.log(res,"unlike response");
    },(err)=>{
      console.log(err);
    });
  };

  savepost(e:any){
    e.isBookmarked = true;
    const data = {
      "postId":e._id,
      "isBookmarked":true
    };
    this._HomeService.bookmarkPostImage(data).subscribe(res=>{
      const repsonse:any = res;
      this._SharedService.successToast(repsonse.message);
    },(err)=>{
      console.log(err);
    });
  };

  unsavepost(e:any){
    e.isBookmarked = false;
    const data = {
      "postId":e._id,
      "isBookmarked":false
    };
    this._HomeService.bookmarkPostImage(data).subscribe(res=>{
      const repsonse:any = res;
      this._SharedService.successToast(repsonse.message);
    },(err)=>{
      console.log(err);
    });
  };

  savePostProduct(e:any){
    const data = {
      "productId":e.influencerId ? e.productId : e._id,
      "isWishlist":true
    };
    this._ProductDetailService.wishlistproduct(data).subscribe((res:any)=>{
      e.isWishlist = true;
      this._SharedService.successToast(res.message);
    },(err)=>{
      console.log(err);
    });
  };

  unsavePostProduct(e:any){
    const data = {
      "productId":e.influencerId ? e.productId : e._id,
      "isWishlist":false
    };
    this._ProductDetailService.wishlistproduct(data).subscribe((res:any)=>{
      e.isWishlist = false;
      this._SharedService.errorToast(res.message);
    },(err)=>{
      console.log(err);
    });
  };

  copylink(copydata:any){
    const postimgurl = `http://localhost:4200/imgpost?id=${copydata}`;
    this.clipboard.copy(postimgurl)
    this._SharedService.successToast("Link copied to clipboard.");
  };

  productCopyLink(item:any){
    if(item.influencerId){
      const data:any = {
        productId:item.productId,
        influencerId:item.influencerId
      }
      const value = JSON.stringify(data)
      const postimgurl = `http://localhost:4200/product-detail/${btoa(value)}`;
      this.clipboard.copy(postimgurl)
    }else{
      const postimgurl = `http://localhost:4200/product-detail/${btoa(item._id)}`;
      this.clipboard.copy(postimgurl)
    }

  }

  reportpostid(e:any){
    this.reportPostId = e;
  };

  reportimg(reportIssueName:any){
    const data = {
      "postId":this.reportPostId,
      "reportIssue":reportIssueName
    }
    this._HomeService.addPostImageReport(data).subscribe((res:any)=>{
      if(res.status === 201){
        $('#alertReport').modal('hide');
        $('#alertReported').modal('show');
      }else{
        this._SharedService.errorToast(res.message)
      }
    },(err)=>{
      console.log(err,"error");
    });
  };

  mutedaccount(userId:any){
    const data = {
      userId: userId,
      isMuted: true
    }
    this._HomeService.muteAccount(data).subscribe((res:any)=>{
      if(res.status === 200){
        this._SharedService.successToast(res.message);
        this.GetAllPostImages(this.pageNo,this.limit);
      }else{
        this._SharedService.errorToast(res.message);
      };
    },(err)=>{
      this._SharedService.errorToast(err);
    });
  };

  singlePostMutedAccount(userId:any){
    const data = {
      userId: userId,
      isMuted: true
    }
    this._HomeService.muteAccount(data).subscribe((res:any)=>{
      if(res.status === 200){
        this._SharedService.successToast(res.message);
        this.router.navigateByUrl('/home');
      }else{
        this._SharedService.errorToast(res.message);
      };
    },(err)=>{
      this._SharedService.errorToast(err);
    });
  };

  followUnfollowTaggedUser(e:any){
    const data = {
      userId: e._id,
      isFollowing: !e.isFollowing
    }
    this._HomeService.followAccount(data).subscribe((res:any)=>{
      if(res.status == 200){
        e.isFollowing = !e.isFollowing;
        this._SharedService.successToast(res.message);
        this.GetAllPostImages(this.pageNo,this.limit);
      }
      if(res.status == 500) this._SharedService.errorToast(res.message);
      if(res.status == 404) this._SharedService.errorToast(res.message);
      
    },(err)=>{
      this._SharedService.errorToast(err);
    });
  }

  followANDunfollow(e:any){
    const data = {
      userId:e.userDetails ? e.userDetails[0]._id : e.userId,
      isFollowing: !e.isFollowing
    }
    this._HomeService.followAccount(data).subscribe((res:any)=>{
      if(res.status == 200){
        e.isFollowing = !e.isFollowing;
        this._SharedService.successToast(res.message);
        this.GetAllPostImages(this.pageNo,this.limit);
      }
      if(res.status == 500) this._SharedService.errorToast(res.message);
      if(res.status == 404) this._SharedService.errorToast(res.message);
      
    },(err)=>{
      this._SharedService.errorToast(err);
    });
  }


  postImageOpen(data:any){
    this.postdetailsopen = !this.postdetailsopen;
    this.singlePostImageDetail = data;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  }; 

  productDetailsPage(item:any){
    if(item.influencerId){
      const data:any = {
        productId:item.productId,
        influencerId:item.influencerId
      }
      const value = JSON.stringify(data)
      this.router.navigate(['/product-detail',btoa(value)]);
    }else{
      this.router.navigate(['/product-detail',btoa(item._id)]);
    }
  }

  commentpost(item:any){
    this.iconClickType = {SinglePostData:item,type:"comment",iconClick:true}
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  };

  postshare(item:any){
    this.iconClickType = {SinglePostData:item,type:"sharePost",iconClick:true}
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  };

  promoteposts(item:any){
    this.iconClickType = {SinglePostData:item,type:"userPromote",iconClick:true}
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  };

  CoffeeIconClick(item:any){
    this.iconClickType = {SinglePostData:item,type:"coffee",iconClick:true}
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  };

  shoppop(item:any){
    if(item.images && item.images.length > 0 ){
      const data = { postId:item._id}
      this._HomeService.getPostImageWiseTaggedProducts(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.taggedProductList = res.data.productsList;
          this.taggedUserList = res.data.userList;
        }else{
          this._SharedService.errorToast(res.message);
        }
      },(err)=>{
        console.log(err,"shopproduct err");
      });    
      this.productshop = !this.productshop;
      this.sideoverhide = true;
      $('body').css({
        'overflow-y': 'hidden',
      });
    }
  };

  closesidebar(){
    this.postdetailsopen = false;
    this.iconClickType = {iconClick:false}
    this.sideoverhide = false;
    this.productshop = false;
    this.postProductComment = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };

  BuyNow(item:any){
    this.closesidebar();
    this.router.navigate(['/product-detail',btoa(item._id)]);
  }

  Wishlist(item:any){
    const data = {
      productId:item._id,
      isWishlist:true
    }
    this._HomeService.wishlistproduct(data).subscribe((res:any)=>{
      this._SharedService.successToast(res.message);
      item.isWishlist = true;
    },(err)=>{
      console.log(err,"err wishlist");
    })
  }

  Wishlistunsaved(item:any){
    const data = {
      productId:item._id,
      isWishlist:false
    }
    this._HomeService.wishlistproduct(data).subscribe((res:any)=>{
      this._SharedService.errorToast(res.message);
      item.isWishlist = false;
    },(err)=>{
      console.log(err,"err wishlist");
    })
  }
  hashtagclick(hashtag:any){
    const itm =window.btoa(JSON.stringify({hashtagName:hashtag}));
    localStorage.setItem("hasgtagsdetail",itm);
    this.router.navigate(['/hashtags-details/hashtags-postdetails']);
  }

  // ------------------product commentsection start----------------
  productPostComment(item:any){
    this.postProductComment = !this.postProductComment;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
    this.selectedProductId = item.influencerId ? item.productId : item._id;
    this.GetPostProductAllComments(this.selectedProductId);
  }

  GetPostProductAllComments(productId:any){
    const data = {
      productId
    };
    this._ProductDetailService.getProductAllComment(data).subscribe((res:any)=>{
      if(res.status == 200) {
        this.sidebarProductCommentList = res.data;
      }else{
        this._SharedService.errorToast(res.message)
      }
    },(err)=>{
      this._SharedService.errorToast('something went wrong!');
    });
  }

  toggleEmojiPickerProductComment(){
    this.showEmojiPickerProductComment = !this.showEmojiPickerProductComment;
  }

  addEmojiProductComment(event:any) {
    const { productCommentMessage } = this;
    const text = `${productCommentMessage}${event.emoji.native}`;
    this.productCommentMessage = text;
    this.showEmojiPickerProductComment = false;
  }

  productCommentBoxCancel(){
    this.productCommentMessage = '';
    this.showEmojiPickerProductComment = false;
  };

  postProductcomment(productId:any){
    this.showEmojiPickerProductComment = false;
    if(this.productCommentMessage !== null && this.productCommentMessage !== ''){
      const data = {
        productId:productId,
        comment:this.productCommentMessage.trim()
      };
      this._ProductDetailService.addProductComment(data).subscribe((res:any)=>{
        if(res.status == 201){
          const index = this.homedata.findIndex((item:any)=> {return item._id == res.data.productId})
          if(index !== -1){
            this.homedata[index].totalComments += 1
          }
          this.GetPostProductAllComments(res.data.productId);
          this.productCommentMessage = '';
        }else{
          this._SharedService.errorToast(res.message);
        }
      },(err)=>{
        this._SharedService.errorToast(err);
      });
    }else{
      this._SharedService.errorToast("comment required");
    }
  };

  editProductComment(item:any){
    this.selectedProductCommentItem =item;
    this.editedProductCommentMessage = item.comment;
  }

  editProductCommentEmojiOpen(){
    this.editPostCommentEmojiCommentBox = !this.editPostCommentEmojiCommentBox;
  };

  addProductCommentEmoji(event:any) {
    const { editedProductCommentMessage } = this;
    const text = `${editedProductCommentMessage}${event.emoji.native}`;
    this.editedProductCommentMessage = text;
    this.editPostCommentEmojiCommentBox = false;
  };

  cancelEditProductComment(){
    this.selectedProductCommentItem =undefined;
    this.editedProductCommentMessage = '';
    this.editPostCommentEmojiCommentBox = false;
  };

  saveEditProductComment(item:any){
    if(this.editedProductCommentMessage != null && this.editedProductCommentMessage != ''){
      const data = {
        commentId:item._id,
        comment:this.editedProductCommentMessage.trim()
      }
      this._ProductDetailService.editProductComment(data).subscribe((res:any)=>{
        if(res.status == 200){
          item.comment = res.comment;
          item.edited = true;
          this.cancelEditProductComment();
          this._SharedService.successToast(res.message);
        }else{
          this._SharedService.errorToast(res.message);
        }
      },(err)=>{
        this._SharedService.errorToast(err);
      });
    }else{
      this._SharedService.errorToast("comment required");
    };
  };

  deleteProductComment(item:any,index:any){
    $("#deleteProductCommentConfirmModal").modal("show");
    this.selectedProductCommentDeleteItem = item;
    this.selectedProductCommentDeleteIndex = index;
  };

  cancelDeleteProductComment(){
    this.selectedProductCommentDeleteItem = undefined;
    this.selectedProductCommentDeleteIndex = undefined;
    $("#deleteProductCommentConfirmModal").modal("hide");
  };

  confirmDeleteProductComment(){
    const data = {
      commentId:this.selectedProductCommentDeleteItem._id
    }
    console.log(data,"data")
    this._ProductDetailService.deleteProductComment(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.sidebarProductCommentList.splice(this.selectedProductCommentDeleteIndex, 1);
        const index = this.homedata.findIndex((item:any)=> {return item._id == this.selectedProductId})
        if(index !== -1){
          this.homedata[index].totalComments -= 1
        }
        this._SharedService.successToast(res.message);
        this.cancelDeleteProductComment();
      }else{
        this._SharedService.errorToast(res.message);
      }
    },(err)=>{
      this._SharedService.errorToast("something went wrong!");
    });
  }

  copyProductComment(content:any){
    this.clipboard.copy(content);
    this._SharedService.successToast("Comment copied to clipboard.");
  }

  LikeUnlikeProductComment(item:any){
    const data = {
      commentId:item._id,
      isLiked:!item.isLiked
    }
    this._ProductDetailService.commentLikeUnlike(data).subscribe((res:any)=>{
      if(res.status == 200){
        item.isLiked = !item.isLiked;
        if(item.isLiked) item.totalLikes += 1;
        else item.totalLikes -= 1;
        this._SharedService.successToast(res.message);
      }else{
        this._SharedService.errorToast(res.message);
      }
    },(err)=>{
      this._SharedService.errorToast(err);
    });
  };

  showAllProductReplyComment(commentId:any){
    this.forShowAllHideProductCommentId = commentId;
    const data = {
      productCommentId:commentId
    }
    this._ProductDetailService.getProductAllSubComment(data).subscribe((res:any)=>{
      if(res.status == 201){
        this.productReplyCommentList = res.data;
      }else{
        this._SharedService.errorToast(res.message);
      }
    },(err)=>{
      this._SharedService.errorToast("something went wrong!");
    });
  }

  hideAllProductReplyComment(commentId:any){
    this.forShowAllHideProductCommentId = undefined;
    this.productCommentId = undefined;
  }

  productReplyCommentBoxOpen(productCommentId:any){
    this.productCommentId = productCommentId
  }

  toggleEmojiPickerProductReplyComment(){
    this.showEmojiPickerProductReplyComment = !this.showEmojiPickerProductReplyComment;
  }

  addEmojiProductReplyComment(event:any) {
    const { productReplyCommentMessage } = this;
    const text = `${productReplyCommentMessage}${event.emoji.native}`;
    this.productReplyCommentMessage = text;
    this.showEmojiPickerProductReplyComment = false;
  }

  productReplyCommentBoxCancel(){
    this.productReplyCommentMessage = '';
    this.showEmojiPickerProductReplyComment = false;
    this.productCommentId = undefined;
  };

  postProductReplycomment(maincomment:any){
    this.showEmojiPickerProductReplyComment = false;
    if(this.productReplyCommentMessage != null && this.productReplyCommentMessage != ''){
      const data = {
        productCommentId:maincomment._id,
        comment:this.productReplyCommentMessage.trim()
      };
      this._ProductDetailService.addProductSubComment(data).subscribe((res:any)=>{
        if(res.status == 201){
          this.showAllProductReplyComment(res.data.productCommentId);
          maincomment.totalSubComments +=1;
          this.forShowAllHideProductCommentId = res.data.productCommentId
          this.productReplyCommentMessage = '';
          this._SharedService.successToast("Your Comment is Posted");
        }else{
          this._SharedService.errorToast(res.message);
        }
      },(err)=>{
        this._SharedService.errorToast('something went wrong!');
      });
    }else{
      this._SharedService.errorToast("please Type Your Comment");
    }; 
  };

  innerProductReplyCommentBoxOpen(replyCommentItem:any){
    this.selectedProductReplyCommentItem = replyCommentItem;
    this.toggleEditProductReplyComment = false;
    this.editedProductReplyCommentMessage = "";
  }

  editProductReplyComment(item:any){
    this.selectedProductReplyCommentItem = item;
    this.editedProductReplyCommentMessage = item.comment;
    this.toggleEditProductReplyComment = true;
  }
 
  editProductReplyCommentEmojiOpen(){
    this.editEmojiProductReplyCommentBox = !this.editEmojiProductReplyCommentBox
  }
 
  editAddEmojiProductReplyComment(event:any){
    const { editedProductReplyCommentMessage } = this;
    const text = `${editedProductReplyCommentMessage}${event.emoji.native}`;
    this.editedProductReplyCommentMessage = text;
    this.editEmojiProductReplyCommentBox = false;
  }
 
  cancelEditedProductReplyComment(){
    this.editEmojiProductReplyCommentBox = false;
    this.editedProductReplyCommentMessage = '';
    this.selectedProductReplyCommentItem = undefined;
  }
 
  saveEditedProductReplyComment(item:any){
    if(this.editedProductReplyCommentMessage !== null && this.editedProductReplyCommentMessage !== ''){
      let data = {
        subCommentId:item._id,
        comment: this.editedProductReplyCommentMessage.trim()
      }
      this._ProductDetailService.editProductSubComment(data).subscribe((res:any)=>{
        if(res.status ==200){
          this.cancelEditedProductReplyComment();
          item.comment = res.comment;
          item.edited = true;
          this._SharedService.successToast("Updated Comment is successfully posted.");
        }else{
          this._SharedService.errorToast(res.message);
        }
      },(err)=>{
        this._SharedService.errorToast("something went wrong!");
      });
    }else{
      this._SharedService.errorToast("values required.");
    }
  }

  deleteProductReplyComment(item:any,index:number){
    this.selectedDeleteProductReplyItem = item;
    this.selectedDeleteProductReplyIndex = index;
    $("#deleteProductReplyCommentConfirmModal").modal("show");
  }
 
  cancelDeleteProductReplyComment(){
    this.selectedDeleteProductReplyItem = undefined;
    this.selectedDeleteProductReplyIndex = undefined;
    $("#deleteProductReplyCommentConfirmModal").modal("hide");
  }
 
  confirmDeleteProductReplyComment(){
    const data = {
      subCommentId:this.selectedDeleteProductReplyItem._id
    }
    this._ProductDetailService.deleteProductSubComment(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message);
        const index = this.sidebarProductCommentList.findIndex((comment:any)=>{return comment._id == this.forShowAllHideProductCommentId});
        if(index !== -1){
          this.sidebarProductCommentList[index].totalSubComments -=1;
        }
        this.productReplyCommentList.splice(this.selectedDeleteProductReplyIndex, 1);
        this.cancelDeleteProductReplyComment();
      }else{
        $("#deleteProductReplyCommentConfirmModal").modal("hide");
        this._SharedService.errorToast(res.message);
      }
    },(err)=>{
      $("#deleteProductReplyCommentConfirmModal").modal("hide");
      this._SharedService.errorToast("something went wrong!");
    });
  }

  copyProductReplyComment(content:any){
    this.clipboard.copy(content);
    this._SharedService.successToast("Comment copied to clipboard.");
  }

  LikeUnlikeProductReplyComment(item:any){
    const data = {
      subCommentId:item._id,
      isLiked:!item.isLiked
    }
    this._ProductDetailService.subCommentLikeUnlike(data).subscribe((res:any)=>{
      if(res.status == 200){
        item.isLiked = !item.isLiked;
        if(item.isLiked) item.totalLikes += 1;
        else item.totalLikes -= 1;
        this._SharedService.successToast(res.message);
      }else{
        this._SharedService.errorToast(res.message);
      }
    },(err)=>{
      this._SharedService.errorToast("something went wrong!");
    });
  };
  // ------------------product commentsection end----------------

  @HostListener('window:scroll', ['$event'])
  onScroll(){
    if(!this.windowOnScroll){
        var docElement = $(document)[0].documentElement;
        var winElement = $(window)[0];
        if ((docElement.scrollHeight - winElement.innerHeight) == winElement.pageYOffset) {
          if(this.homedata.length !== this.totalDocs){
            this.GetAllPostImages(this.pageNo += 1, this.limit);
          }
        }
    }else{
      this.windowOnScroll = false;
    }
  }
  
};