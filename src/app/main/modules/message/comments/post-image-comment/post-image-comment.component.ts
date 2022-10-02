import { Component, EventEmitter, Input, OnInit, Output,SecurityContext } from '@angular/core';
import { SharedService } from 'src/app/main/shared/shared.service';
import { HomeService } from '../../../home/home.service';
import { Clipboard } from '@angular/cdk/clipboard';
declare var $:any;

@Component({
  selector: 'app-post-image-comment',
  templateUrl: './post-image-comment.component.html',
  styleUrls: ['./post-image-comment.component.css']
})
export class PostImageCommentComponent implements OnInit {
  public parentData:any;
  public mainCommentList:any=[];
  private postImageId:number;
  public TypedComment:any='';
  public spinnerShow:boolean = false;
  public emojiCommentBox = false;
  public selectedEditItem:any;
  public editedTypedText:any='';
  public editEmojiCommentBox:boolean = false;
  public selectedDeleteItem:any;
  public selectedDeleteIndex:number |undefined;
  public sideoverhide:any;
  public selectedCommentItem:any;



  @Input() set activePostsDetail(params:any){
    this.parentData = params;
    this.mainCommentList=[];
    this.postImageId = this.parentData._id;
    this.GetPostImagesAllComments(this.postImageId);
  }
  @Output() totalCommentCount = new EventEmitter<any>();

  constructor(private _HomeService:HomeService,private _SharedService:SharedService,private clipboard: Clipboard) { }

  ngOnInit(): void {
  }

  GetPostImagesAllComments(postImageId:any){
    const data = {
      postImageId
    };
    this._HomeService.getPostImageAllComments(data).subscribe((res:any)=>{
      if(res.status == 201) {
        this.mainCommentList = res.data;
      }else{
        this._SharedService.errorToast(res.message)
      }
    },(err)=>{
      this._SharedService.errorToast(err);
    });
  }

  emojiOpen(){
    this.emojiCommentBox = !this.emojiCommentBox;
  }

  addEmoji(event:any) {
    const { TypedComment } = this;
    const text = `${TypedComment}${event.emoji.native}`;
    this.TypedComment = text;
    this.emojiCommentBox = false;
  }

  sendComment(){
    this.spinnerShow = true;
    this.emojiCommentBox = false;
    if(this.TypedComment !== null && this.TypedComment !== ''){
      const data = {
        postImageId:this.postImageId,
        comment:this.TypedComment.trim()
      };
      this._HomeService.postImageComments(data).subscribe((res:any)=>{
        if(res.status == 201){
          const params= {
            postId:res.data.postImageId,
            type:"addComment"
          }
          this.totalCommentCount.emit(params);
          this.GetPostImagesAllComments(res.data.postImageId);
          this.TypedComment = '';
          this.spinnerShow = false;
        }else{
          this._SharedService.errorToast(res.message) 
          this.spinnerShow = false;
        }
      },(err)=>{
        this._SharedService.errorToast(err);
        this.spinnerShow = false;
      });
    }else{
      this._SharedService.errorToast("comment required");
      this.spinnerShow = false;
    }
  };

  editComment(item:any){
    this.selectedEditItem =item;
    this.editedTypedText = item.comment;
  }

  editEmojiOpen(){
    this.editEmojiCommentBox = !this.editEmojiCommentBox;
  };

  editedAddEmoji(event:any) {
    const { editedTypedText } = this;
    const text = `${editedTypedText}${event.emoji.native}`;
    this.editedTypedText = text;
    this.editEmojiCommentBox = false;
  };

  cancelEditComment(){
    this.selectedEditItem =undefined;
    this.editedTypedText = '';
  };

  saveEditComment(item:any){
    if(this.editedTypedText != null && this.editedTypedText != ''){
      const data = {
        commentId:item._id,
        comment:this.editedTypedText.trim()
      }
      this._HomeService.editComment(data).subscribe((res:any)=>{
        if(res.status == 200){
          item.comment = res.comment;
          item.edited = true;
          this.cancelEditComment();
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

  deleteComment(item:any,index:any){
    $("#deleteCommentConfirmModal").modal("show");
    this.selectedDeleteItem = item;
    this.selectedDeleteIndex = index;
  };

  cancelDeleteComment(){
    this.spinnerShow = false;
    this.selectedDeleteItem = undefined;
    this.selectedDeleteIndex = undefined;
    $("#deleteCommentConfirmModal").modal("hide");
  };

  confirmDeleteComment(){
    this.spinnerShow = true;
    const data = {
      commentId:this.selectedDeleteItem._id
    }
    this._HomeService.deleteComment(data).subscribe((res:any)=>{
      if(res.status == 200){
        const params= {
          postId:this.postImageId,
          type:"deleteComment"
        }
        this.totalCommentCount.emit(params);
        this.mainCommentList.splice(this.selectedDeleteIndex, 1);
        this._SharedService.successToast(res.message);
        this.cancelDeleteComment();
      }else{
        this.spinnerShow = false;
        this._SharedService.errorToast(res.message);
      }
    },(err)=>{
      this.spinnerShow = false;
      this._SharedService.errorToast("something went wrong");
    });
  }

  commentCopy(content:any){
    this.clipboard.copy(content);
    this._SharedService.successToast("Comment copied to clipboard.");
  }

  LikeUnlikeComment(item:any){
    const data = {
      commentId:item._id,
      isLiked:!item.isLiked
    }
    this._HomeService.commentLikeUnlike(data).subscribe((res:any)=>{
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

  GetAllrepliesList(item:any){
    this.selectedCommentItem = {...item,commentBox:true}
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  };

  updateComment(params:any){
    if(this.selectedCommentItem?._id == params.commentId){
      const index = this.getCommentIndex(params.commentId);
      if(index !== -1){
        if(params.type =='sideBarEditComment') {
          this.mainCommentList[index].edited = true;
          this.mainCommentList[index].comment = params.comment;
        }else if(params.type =='sideBarDeleteComment') {
          this.mainCommentList.splice(index,1);
          const msgdeleteParams= {
            postId:this.selectedCommentItem.postImageId,
            type:"deleteComment"
          }
          this.totalCommentCount.emit(msgdeleteParams);
        }else if(params.type =='sideBarAddReplyComment') {
          this.mainCommentList[index].totalComments +=1;
        }else if(params.type =='sideBarDeleteReplyComment') {
          this.mainCommentList[index].totalComments -=1;
        }
      }
    }
  }

  closesidebar(){
    this.sideoverhide = false;
    this.selectedCommentItem = undefined;
    $('body').css({
      'overflow-y': 'auto',
    });
  };

  getCommentIndex(id:any){
    return this.mainCommentList.findIndex((comment:any) => {return comment._id == id});
  }
}
