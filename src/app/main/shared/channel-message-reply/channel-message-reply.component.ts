import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren ,OnDestroy} from '@angular/core';
import { AuthenticationService } from '../../auth/service';
import { MessagechatService } from '../../modules/message/messagechat.service';
import { SharedService } from '../shared.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Subscription } from 'rxjs';
import { YourchannelService } from '../../modules/message/yourchannel/yourchannel.service';
import { getParamByISO } from 'iso-country-currency';
declare var $:any;

@Component({
  selector: 'app-channel-message-reply',
  templateUrl: './channel-message-reply.component.html',
  styleUrls: ['./channel-message-reply.component.css']
})
export class ChannelMessageReplyComponent implements OnInit,OnDestroy {
  @ViewChild('heightBottomMsgDiv') heightBottomMsgDiv: ElementRef;
  @ViewChildren('readReplymessages') readReplymessages: QueryList<any>;
  @ViewChild('replyContent') replyContent: ElementRef;
  primeTableHeight:number = 220;
  parentData:any;
  activeMessageId:any;
  lastReplyMessageId:any='';
  ReplyMessageList:any=[];
  unreadReplyMessageList:any=[];
  totalReadReplyMessageCount:number;
  checkReplyVertScroll:any;
  deleteMsgNotiBoolean:boolean = false;
  spinnerShow:boolean = false;
  @Input() set selectedMessage(params: any) {
    this.deleteMsgNotiBoolean = false;
    this.parentData = params
    if(this.parentData && this.parentData.channelReplyBox  == true){
      this.lastReplyMessageId='';
      this.ReplyMessageList=[];
      this.unreadReplyMessageList=[];
      this.activeMessageId = params._id;
      this.getchannelMessageReplyList(this.activeMessageId,this.lastReplyMessageId);
    }
  }
  @Output() closeSidebarEvent = new EventEmitter<any>();
  
  selectedEditItem:any;
  editedTypedText:any='';
  selectedDeleteItem:any;
  editEmojimessagebox:boolean = false;

  replySelectedEditItem:any;
  replyEditedTypedText:any='';
  replySelectedDeleteItem:any;
  replySelectedDeleteIndex:any;
  replyEditEmojimessagebox:boolean = false;

  updateChannelMessageUnsub$: Subscription;
  deleteChannelMessageUnsub$: Subscription;
  newChannelReplyMessageUnsub$: Subscription;
  updateChannelReplyMessageUnsub$: Subscription;
  deleteChannelReplyMessageUnsub$: Subscription;
  likeUnlikeReplyMessageUnsub$: Subscription;
  readChannelReplyMessageUnsub$: Subscription;
  subscriptions: Subscription[] = []
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');

  constructor(private _YourchannelService: YourchannelService,private _SharedService: SharedService,private _AuthenticationService:AuthenticationService,private clipboard:Clipboard) { }

  ngOnInit(): void {
    this.updateChannelMessageListen();
    this.deleteChannelMessageListen();
    this.newChannelReplyMessageListen();
    this.updateChannelReplyMessageListen();
    this.deleteChannelReplyMessageListen();
    this.likeUnlikeReplyMessageListen();
    this.readChannelReplyMessageEmitListen();
    this.UnsubscribeMethod();
  }

  getchannelMessageReplyList(messageId:any,lastReplyMessageId:any){
    const data = {
      messageId,
      lastReplyMessageId
    }
    this._YourchannelService.getChannelReplyMessage(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.totalReadReplyMessageCount = res.data.totalReadReplyMessageCount
        if(this.lastReplyMessageId ==''){
          if(res.data.readReplyMessages.length > 0){
            this.lastReplyMessageId = res.data.readReplyMessages.slice(-1).pop()._id;
          }
          this.ReplyMessageList = res.data.readReplyMessages;
        }else{
          if(res.data.readReplyMessages.length > 0){
            this.lastReplyMessageId = res.data.readReplyMessages.slice(-1).pop()._id;
          }
          this.ReplyMessageList = [...this.ReplyMessageList,...res.data.readReplyMessages]; 
        }
        if(this.ReplyMessageList.length == res.data.totalReadReplyMessageCount){
          this.unreadReplyMessageList = res.data.unreadReplyMessages;
          this.readChannelReplyMessageEmitEvent();
        }
        // if(this.parentData && this.parentData.unreadReplyMessagesCount > 0){
        // }
        setTimeout(() => {
          this.checkReplyVertScroll= this.replyContent?.nativeElement?.scrollHeight>this.replyContent?.nativeElement?.clientHeight;
          if(this.parentData && this.checkReplyVertScroll == true) {
          }else if(this.parentData && this.checkReplyVertScroll == false){
            if(this.ReplyMessageList.length == res.data.totalReadReplyMessageCount){
              setTimeout(() => {
                this.ReplyMessageList = [...this.ReplyMessageList,...this.unreadReplyMessageList]
                this.unreadReplyMessageList = []
              }, 2000);
            }
          }
        }, 0);
        
      }else if(res.status == 500 || res.status ==404 || res.status == 401){
        this._SharedService.errorToast(res.message);
      }
    })
  };

  readChannelReplyMessageEmitEvent(){
    const readReplyMsg = {
      messageId:this.activeMessageId
    }
    this._SharedService.emit("readChannelReplyMessage",readReplyMsg)
  }

  minHeightOfTable(){
    this.primeTableHeight = 220-105+this.heightBottomMsgDiv?.nativeElement?.offsetHeight; 
  };

  newCloseQuote(data:any){
    setTimeout(() => {
      this.minHeightOfTable();
    }, 50);
  };

  closesidebar(){
    this.activeMessageId = undefined;
    this.parentData = undefined;
    this.closeSidebarEvent.emit();
    $("#deletemessage").modal("hide");
  };

  // --------------------eventListing Section start------------------------------------


  updateChannelMessageListen(){
    this.updateChannelMessageUnsub$=this._SharedService.listen("updateChannelMessageEmit").subscribe((res:any)=>{
      if(this.parentData){
        if(res.status === 200 && this.activeMessageId == res.data._id){  
            this.parentData.message = res.data.message
            this.parentData.isEdited = res.data.isEdited
            this.selectedEditItem =undefined;
            this.editedTypedText = '';
        }else if(res.status === 500 || res.status === 401){
          this._SharedService.errorToast(res.message);
        }
      }
    })
  };

  deleteChannelMessageListen(){
    this.deleteChannelMessageUnsub$ = this._SharedService.listen("deleteChannelMessageEmit").subscribe((res:any)=>{
      if(this.parentData){
        if(res.status === 200 && this.activeMessageId == res.data.messageId){
          if(this._AuthenticationService.currentUserValue.username == res.data.senderUserDetail.username){
            this.closesidebar()
          }else{
            this.deleteMsgNotiBoolean = true;
          }
        }
      }
    })
  };

  newChannelReplyMessageListen(){
    this.newChannelReplyMessageUnsub$=this._SharedService.listen("newChannelReplyMessageEmit").subscribe((res:any)=>{
      if(res.status === 201 && this.activeMessageId == res.data.createdReplyMessage.messageId){ // active message hoy tyare
        if(this._AuthenticationService.currentUserValue.username == res.data.senderUserDetail.username){ //sender ni screen
          if(this.parentData.replyCount == this.ReplyMessageList.length){ // all replymessage read karel hoy
            this.ReplyMessageList.push(res.data.createdReplyMessage);
          }
        }else{ // other member screen
          if(this.parentData.replyCount == this.ReplyMessageList.length){ // all replymessage read karel hoy
            res.data.createdReplyMessage.self_message = false;
            this.ReplyMessageList.push(res.data.createdReplyMessage);
            this.readChannelReplyMessageEmitEvent();
          }
        }
        this.parentData.replyCount = res.data.totalReplyMessageCount;
      }
    });
  };
  
  updateChannelReplyMessageListen(){
    this.updateChannelReplyMessageUnsub$=this._SharedService.listen("editChannelReplyMessageEmit").subscribe((res:any)=>{
      if(res.status === 200 && this.activeMessageId == res.data.editedReplyMessage.messageId){
        const replyMsgIndex = this.getReplyMessageIndex(res.data.editedReplyMessage._id)
        if(replyMsgIndex !== -1){
          this.ReplyMessageList[replyMsgIndex].isEdited = res.data.editedReplyMessage.isEdited
          this.ReplyMessageList[replyMsgIndex].message = res.data.editedReplyMessage.message
          this.replySelectedEditItem =undefined;
          this.replyEditedTypedText = '';
        }
        if(this._AuthenticationService.currentUserValue.username == res.data.senderUserDetail.username){
          this._SharedService.successToast(res.message)
        }
      }else if(res.status == 500 || res.status == 401){
        this._SharedService.errorToast(res.message)
      }
    });
  };

  deleteChannelReplyMessageListen(){
    this.deleteChannelReplyMessageUnsub$ = this._SharedService.listen("deleteChannelReplyMessageEmit").subscribe((res:any)=>{
      if(res.status === 200 && this.activeMessageId == res.data.messageId){
        if(this._AuthenticationService.currentUserValue.username == res.data.senderUserDetail.username){
          this._SharedService.successToast(res.message);
          $("#deletereplymessage").modal("hide");
          this.spinnerShow = false;
        }
        const replyMsgIndex = this.getReplyMessageIndex(res.data.replyMessageId)
        if(replyMsgIndex !== -1){
          this.ReplyMessageList.splice(replyMsgIndex,1);
          this.parentData.replyCount -= 1;
        }
      }else if(res.status === 500 || res.status === 400 || res.status === 401 || res.status === 404){
        $("#deletereplymessage").modal("hide");
        this.spinnerShow = false;
        this._SharedService.errorToast(res.message);
      }else{
        this.spinnerShow = false;
        this._SharedService.errorToast("not true any condition for deleteChannelreplyMessageEmit");
      }
    });
  };

  likeUnlikeReplyMessageListen(){
    this.likeUnlikeReplyMessageUnsub$ = this._SharedService.listen("likeUnlikeReplyMessageEmit").subscribe((res:any) =>{
      if(this.parentData){
        if(res.status === 200 && this.activeMessageId == res.data.messageDetails.messageId){ 
          const replyMsgIndex = this.getReplyMessageIndex(res.data.messageDetails._id)
          if(replyMsgIndex !== -1){
            if(this._AuthenticationService.currentUserValue.username === res.data.senderUserDetail.username){
              this.ReplyMessageList[replyMsgIndex].isLiked = res.data.messageDetails.isLiked;
            }
            this.ReplyMessageList[replyMsgIndex].totalLikes = res.data.messageDetails.totalLikes;

          }
        }else if(res.status === 500 || res.status === 400 || res.status === 401 || res.status === 404){
          this._SharedService.errorToast(res.message);
        }
      }
    })
  };

  readChannelReplyMessageEmitListen(){
    this.readChannelReplyMessageUnsub$ = this._SharedService.listen("readChannelReplyMessageEmit").subscribe((res:any)=>{
      if(res.status === 200 && this.activeMessageId == res.data.messageId){
        
      }else if(res.status ===500 || res.status ===404){
        this._SharedService.errorToast(res.message);
      }
    })
  };

  UnsubscribeMethod(){
    this.subscriptions.push(this.updateChannelMessageUnsub$);
    this.subscriptions.push(this.deleteChannelMessageUnsub$);
    this.subscriptions.push(this.newChannelReplyMessageUnsub$);
    this.subscriptions.push(this.updateChannelReplyMessageUnsub$);
    this.subscriptions.push(this.deleteChannelReplyMessageUnsub$);
    this.subscriptions.push(this.likeUnlikeReplyMessageUnsub$);
    this.subscriptions.push(this.readChannelReplyMessageUnsub$);
  };

  // --------------------evenbtListing Section end-=----------------------------------

  // ---------------------replytab in main messagesection start---------------------------------

  EditMessage(item:any){
    this.selectedEditItem =item;
    this.editedTypedText = item.message
  };

  editEmojiOpen(){
    this.editEmojimessagebox = !this.editEmojimessagebox;
    this.replyEditEmojimessagebox = false
  };

  editedAddEmoji(event:any) {
    const { editedTypedText } = this;
    const text = `${editedTypedText}${event.emoji.native}`;
    this.editedTypedText = text;
    this.editEmojimessagebox = false;
    this.replyEditEmojimessagebox = false
  };

  cancelEditMessage(){
    this.selectedEditItem =undefined;
    this.editedTypedText = '';
  };

  saveEditMessage(){
    if(this.selectedEditItem._id != undefined){
      const data ={
        messageId:this.selectedEditItem._id,
        message:this.editedTypedText==''?undefined:this.editedTypedText
      }
      this._SharedService.emit("updateChannelMessage",data)
    }
  };

  DeleteMessage(item:any){
    this.selectedDeleteItem = item;
    $("#deletemessage").modal("show");
  };

  cancelDeleteMessage(){
    this.selectedDeleteItem = undefined;
    $("#deletemessage").modal("hide");
  };

  confirmDeleteMessage(){
    const data = {
      messageId : this.selectedDeleteItem._id
    }
    this._SharedService.emit("deleteChannelMessage",data)
  };

  CopyMessage(item:any){
    this.clipboard.copy(item.message);
    this._SharedService.successToast("Message copied to clipboard.");

  };
  /*------------------------ replytab in main messagesection end---------------------------------*/


  /* --------------------ReplyMessage Section Start---------------------------------*/
  EditReplyMessage(replyitem:any){
    this.replySelectedEditItem =replyitem;
    this.replyEditedTypedText = replyitem.message;
  };

  DeleteReplyMessage(replyitem:any,index:any){
    $("#deletereplymessage").modal("show");
    this.replySelectedDeleteItem = replyitem;
    this.replySelectedDeleteIndex = index;
  };

  CopyReplyMessage(replyitem:any){
    this.clipboard.copy(replyitem.message);
    this._SharedService.successToast("Message copied to clipboard.");
  };

  replyEditEmojiOpen(){
    this.replyEditEmojimessagebox = !this.replyEditEmojimessagebox;
    this.editEmojimessagebox = false;
  };

  replyEditedAddEmoji(event:any) {
    const { replyEditedTypedText } = this;
    const text = `${replyEditedTypedText}${event.emoji.native}`;
    this.replyEditedTypedText = text;
    this.editEmojimessagebox = false;
    this.replyEditEmojimessagebox = false
  };

  cancelReplyEditMessage(){
    this.replySelectedEditItem =undefined;
    this.replyEditedTypedText = '';
  };

  saveReplyEditMessage(){
    if(this.replySelectedEditItem._id != undefined){
      const data ={
        messageId:this.replySelectedEditItem._id,
        message:this.replyEditedTypedText==''?undefined:this.replyEditedTypedText
      }
      this._SharedService.emit("editChannelReplyMessage",data)
    }
    
  };

  cancelDeleteReplyMessage(){
    this.spinnerShow = false;
    this.replySelectedDeleteItem = undefined;
    this.replySelectedDeleteIndex = undefined;
    $("#deletereplymessage").modal("hide");
  };

  confirmDeleteReplyMessage(){
    this.spinnerShow = true;
    const data = {
      replyMessageId : this.replySelectedDeleteItem._id
    }
    this._SharedService.emit("deleteChannelReplyMessage",data)
  };

  likeUnlikeReplyMessage(item:any){
    const data = {
      messageId:item._id,
      isLiked:!item.isLiked
    };
    this._SharedService.emit("likeUnlikeReplyMessage",data);
  }

  onScrollUp(){
  }

  async onScroll(){
    if(this.ReplyMessageList.length == this.totalReadReplyMessageCount){
      setTimeout(() => {
        this.ReplyMessageList = [...this.ReplyMessageList,...this.unreadReplyMessageList]
        this.unreadReplyMessageList = []
      }, 2000);
    }
    if (this.ReplyMessageList.length +this.unreadReplyMessageList.length >= this.totalReadReplyMessageCount + this.unreadReplyMessageList.length) return
    await this.getchannelMessageReplyList(this.activeMessageId,this.lastReplyMessageId);
  }
  /* --------------------ReplyMessage Section End---------------------------------*/

  getReplyMessageIndex(id:any){
    return this.ReplyMessageList.findIndex((ele:any)=>{return ele._id == id});
  };

  ngOnDestroy(){
   this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  };

}
