import { Component, EventEmitter, Input, OnInit, Output,SecurityContext } from '@angular/core';
import { SharedService } from 'src/app/main/shared/shared.service';
import { HomeService } from '../../../home/home.service';
import { Clipboard } from '@angular/cdk/clipboard';
declare var $:any;


@Component({
  selector: 'app-post-image-comment-reply',
  templateUrl: './post-image-comment-reply.component.html',
  styleUrls: ['./post-image-comment-reply.component.css']
})
export class PostImageCommentReplyComponent implements OnInit {
  //--------parent comment section start--------
  public selectedEditItem:any;
  public editedTypedText:any='';
  public editEmojiCommentBox:boolean = false;
  public selectedDeleteItem:any;
  public spinnerShow:boolean = false;
  //--------parent comment section End--------

  //---replycomment section start------------
  public parentData:any;
  public deleteCommentNotiBoolean:boolean = false;
  public ReplyCommentList:any=[];
  public activeCommentId:any;
  @Output() closeSidebarEvent = new EventEmitter<any>();
  @Output() updateCommentEvent = new EventEmitter<any>();
  @Input() set selectedComment(params: any) {
    this.deleteCommentNotiBoolean = false;
    this.parentData = params
    if(this.parentData && this.parentData.commentBox  == true){
      this.ReplyCommentList=[];
      this.activeCommentId = params._id;
      this.getAllReplyCommentList(this.activeCommentId);
    }
  }

  public replyEmojiCommentBox:boolean = false;
  public TypedReplyComment:any='';
  public selectedReplyItem:any;
  public TypedEditedReplyComment:any='';
  public editEmojiReplyCommentBox:boolean = false;
  public selectedDeleteReplyItem:any;
  public selectedDeleteReplyIndex:number |undefined;
  //---replycomment section end------------

  constructor(private _HomeService:HomeService,private _SharedService:SharedService,private clipboard: Clipboard) { }

  ngOnInit(): void {
  }
  
  getAllReplyCommentList(commentId:any){
    const data = {
      postImageCommentId:commentId
    }
    this._HomeService.postImageSubCommentsgetall(data).subscribe((res:any)=>{
      if(res.status == 201){
        this.ReplyCommentList = res.data;
      }else{
        this._SharedService.errorToast(res.message);
      }
    },(err)=>{
      this._SharedService.errorToast("something went wrong!");
    });
  }

  // ---------------------parent comment section start----------------------------------
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
          const params= {
            commentId:item._id,
            comment:res.comment,
            type:"sideBarEditComment"
          }
          this.updateCommentEvent.emit(params);
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

  deleteComment(item:any){
    $("#sidebarDeleteCommentConfirmModal").modal("show");
    this.selectedDeleteItem = item;
  };

  cancelDeleteMainComment(){
    this.spinnerShow = false;
    this.selectedDeleteItem = undefined;
    $("#sidebarDeleteCommentConfirmModal").modal("hide");
  };

  confirmDeleteMainComment(){
    this.spinnerShow = true;
    const data = {
      commentId:this.selectedDeleteItem._id
    }
    this._HomeService.deleteComment(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.spinnerShow = false;
        const params= {
          commentId:this.selectedDeleteItem._id,
          type:"sideBarDeleteComment"
        }
        this.updateCommentEvent.emit(params);
        this._SharedService.successToast(res.message);
        this.closesidebar();
        this.cancelDeleteMainComment();
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
  //------------------- parent comment section End---------------------------------------------

  //------------------- reply comment section Start---------------------------------------------

  replyEmojiOpen(){
    this.replyEmojiCommentBox = !this.replyEmojiCommentBox;
  }

  addReplyEmoji(event:any) {
    const { TypedReplyComment } = this;
    const text = `${TypedReplyComment}${event.emoji.native}`;
    this.TypedReplyComment = text;
    this.replyEmojiCommentBox = false;
  }

  sendReplyComment(){
    if(this.TypedReplyComment != null && this.TypedReplyComment != ''){
      const data = {
        postImageCommentId:this.activeCommentId,
        comment:this.TypedReplyComment.trim()
      };
      this._HomeService.addPostImageSubComment(data).subscribe((res:any)=>{
        if(res.status == 201){
          this.getAllReplyCommentList(res.data.postImageCommentId);
          const params= {
            commentId:this.activeCommentId,
            type:"sideBarAddReplyComment"
          }
          this.updateCommentEvent.emit(params);
          this.parentData.totalComments +=1;
          this.TypedReplyComment = '';
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
  }

  editReplyComment(item:any){
    this.selectedReplyItem = item;
    this.TypedEditedReplyComment = item.comment;
  }

  editReplyEmojiOpen(){
    this.editEmojiReplyCommentBox = !this.editEmojiReplyCommentBox
  }

  editReplyAddEmoji(event:any){
    const { TypedEditedReplyComment } = this;
    const text = `${TypedEditedReplyComment}${event.emoji.native}`;
    this.TypedEditedReplyComment = text;
    this.editEmojiReplyCommentBox = false;
  }

  cancelEditedReplyComment(){
    this.editEmojiReplyCommentBox = false;
    this.TypedEditedReplyComment = '';
    this.selectedReplyItem = undefined;
  }

  saveEditedReplyComment(item:any){
    if(this.TypedEditedReplyComment != null && this.TypedEditedReplyComment != ''){
      let data = {
        subCommentId:item._id,
        comment: this.TypedEditedReplyComment.trim()
      }
      this._HomeService.editPostImageSubComment(data).subscribe((res:any)=>{
        if(res.status ==200){
          this.cancelEditedReplyComment();
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

  deleteReplyComment(item:any,index:number){
    this.selectedDeleteReplyItem = item;
    this.selectedDeleteReplyIndex = index;
    $("#deleteReplyCommentConfirmModal").modal("show");
  }

  cancelDeleteReplyComment(){
    this.selectedDeleteReplyItem = undefined;
    this.selectedDeleteReplyIndex = undefined;
    $("#deleteReplyCommentConfirmModal").modal("hide");
  }

  confirmDeleteReplyComment(){
    this.spinnerShow = true;
    const data = {
      subCommentId:this.selectedDeleteReplyItem._id
    }
    this._HomeService.deleteSubComment(data).subscribe((res:any)=>{
      if(res.status == 200){
        this._SharedService.successToast(res.message);
        this.spinnerShow = false;
        this.cancelDeleteReplyComment();
        const params= {
          commentId:this.activeCommentId,
          type:"sideBarDeleteReplyComment"
        }
        this.updateCommentEvent.emit(params);
        this.parentData.totalComments -=1;
        this.ReplyCommentList.splice(this.selectedDeleteReplyIndex, 1);
      }else{
        this.spinnerShow = false;
        $("#deleteReplyCommentConfirmModal").modal("hide");
        this._SharedService.errorToast(res.message);
      }
    },(err)=>{
      this.spinnerShow = false;
      $("#deleteReplyCommentConfirmModal").modal("hide");
      this._SharedService.errorToast("something went wrong!");
    });
  }

  copyReplyComment(content:any){
    this.clipboard.copy(content);
    this._SharedService.successToast("Comment copied to clipboard.");
  }

  LikeUnlikeReplyComment(item:any){
    const data = {
      subCommentId:item._id,
      isLiked:!item.isLiked
    }
    this._HomeService.commentLikeUnlikeinner(data).subscribe((res:any)=>{
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

  //------------------- reply comment section End---------------------------------------------


  closesidebar(){
    this.activeCommentId = undefined;
    this.parentData = undefined;
    this.closeSidebarEvent.emit();
    $("#sidebarDeleteCommentConfirmModal").modal("hide");
  };

}
