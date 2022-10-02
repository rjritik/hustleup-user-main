import { Component, Input, OnInit,Output, EventEmitter,OnDestroy, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { AuthenticationService } from '../../auth/service';
import { MessagechatService } from '../../modules/message/messagechat.service';
import { SharedService } from '../shared.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Subscription } from 'rxjs';
import { getParamByISO } from 'iso-country-currency';
declare var $:any;

@Component({
  selector: 'app-message-reply',
  templateUrl: './message-reply.component.html',
  styleUrls: ['./message-reply.component.css']
})
export class MessageReplyComponent implements OnInit,OnDestroy,AfterViewInit {
  @ViewChild('heightBottomMsgDiv') heightBottomMsgDiv: ElementRef;
  @ViewChildren('messages') messages: QueryList<any>;
  @ViewChild('content') content: ElementRef;
  primeTableHeight:number = 220;
  parentData:any;
  checkReplyVertScroll:any;
  slideOptionsproduct = {nav:false, items: 1, loop:false};
  @Input() set selectedReply(params: any) {
    this.parentData = params
    setTimeout(() => {
      this.checkReplyVertScroll= this.content?.nativeElement?.scrollHeight>this.content?.nativeElement?.clientHeight;
      if(!this.checkReplyVertScroll &&this.parentData && this.parentData?.replyUnreadMessages?.length !== 0) {
        this.readReplayMessagesEmitEvent(this.parentData._id)
      }
    }, 0);
  }
  @Output() closeSidebarEvent = new EventEmitter<any>();
  @Output() scrollDownEvent = new EventEmitter<any>();
  
  selectedEditItem:any;
  editedTypedText:any='';
  selectedDeleteItem:any;
  editEmojimessagebox:boolean = false;

  replySelectedEditItem:any;
  replyEditedTypedText:any='';
  replySelectedDeleteItem:any;
  replySelectedDeleteIndex:any;
  replyEditEmojimessagebox:boolean = false;

  sendReplyUnsubscribe$: Subscription;
  sendUpdatedMessageUnsubscribe$: Subscription; 
  sendDeleteMessageUnsubscribe$: Subscription; 
  sendUpdatedReplayMessageUnsubscribe$: Subscription; 
  sendDeleteReplyMessageUnsubscribe$: Subscription;
  sendreadReplayMessagesUnsubscribe$: Subscription;
  subscriptions: Subscription[] = []
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');

  constructor( private _MessagechatService: MessagechatService, private _SharedService: SharedService,private _AuthenticationService:AuthenticationService,private clipboard:Clipboard) {

  }

  ngOnInit(): void {
    this.sendReplyEventListen()
    this.sendUpdatedMessageEventListen()
    this.sendDeleteMessageEventListen()
    this.sendUpdatedReplayMessageEventListen()
    this.sendDeleteReplyMessageEventListen()
    this.sendreadReplayMessagesListenEvent()
    this.UnsubscribeMethod()
  }

  minHeightOfTable(){
    this.primeTableHeight = 220-105+this.heightBottomMsgDiv?.nativeElement?.offsetHeight; 
  };

  newCloseQuote(data:any){
    // setTimeout(() => {
      this.minHeightOfTable();
    // }, 50);
  };

  sendReplyEventListen(){
    this.sendReplyUnsubscribe$ = this._SharedService.listen("sendReply").subscribe((res:any)=>{
      const response = {
        user_details:res[0].senderUserDetail,
        messageReply:res[0].messageReply,
        created_date:res[0].created_date,
        documents:res[0].documents,
        images:res[0].images,
        isEdited:res[0].isEdited,
        self_message:res[0].self_message,
        _id:res[0]._id
      }
      if(this.parentData){
        if(this.parentData._id == res[0].message_id){
          this.parentData.replyReadMessages.push(response);
          this.parentData.replyCount = res[0].replyCount+1
          if(this._AuthenticationService.currentUserValue.username == res[0].receiverUserDetail.username){
            this.readReplayMessagesEmitEvent(this.parentData._id)
          }
        }
      }
      
    })
  }

  sendUpdatedMessageEventListen(){
    this.sendUpdatedMessageUnsubscribe$ = this._SharedService.listen("sendUpdatedMessage").subscribe((res:any)=>{
      if(this.parentData){
        this.parentData.message = res?.message
        this.parentData.isEdited = res?.isEdited
        this.selectedEditItem =undefined;
        this.editedTypedText = '';
      }
    })
  }

  sendDeleteMessageEventListen(){
    this.sendDeleteMessageUnsubscribe$ = this._SharedService.listen("sendDeleteMessage").subscribe((res:any)=>{
      if(this._AuthenticationService.currentUserValue.username == res[0].user_details.username){
        this.closesidebar()
      } 
    })
  }

  sendUpdatedReplayMessageEventListen(){
    this.sendUpdatedReplayMessageUnsubscribe$ = this._SharedService.listen("sendUpdatedReplayMessage").subscribe((res:any)=>{
      const replyReadMsgIndex = this.parentData.replyReadMessages.findIndex((ele:any)=> {return ele._id == res._id})
      if(replyReadMsgIndex != -1){
        this.parentData.replyReadMessages[replyReadMsgIndex].messageReply = res.messageReply
        this.parentData.replyReadMessages[replyReadMsgIndex].isEdited = res.isEdited
      }else if(replyReadMsgIndex === -1){
        const replyUnreadMsgIndex = this.parentData.replyUnreadMessages.findIndex((ele:any)=> {return ele._id == res._id})
        if(replyUnreadMsgIndex !== -1){
          this.parentData.replyUnreadMessages[replyUnreadMsgIndex].messageReply = res.messageReply
          this.parentData.replyUnreadMessages[replyUnreadMsgIndex].isEdited = res.isEdited
        }
      }
      this.replySelectedEditItem =undefined;
      this.replyEditedTypedText = '';
    })
  }

  sendDeleteReplyMessageEventListen(){
    this.sendDeleteReplyMessageUnsubscribe$ = this._SharedService.listen("sendDeleteReplyMessage").subscribe((res:any)=>{
      if(this._AuthenticationService.currentUserValue.username == res.user_details.username){
        if(this.parentData){
          this.parentData.replyReadMessages.splice(this.replySelectedDeleteIndex,1);
          this.parentData.replyCount = res.replyCount
          $("#deletereplymessage").modal("hide");
        }
        
      }
    })
  };

  readReplayMessagesEmitEvent(messageId:any){
    if(messageId !== undefined){
      const readReplyMessagesData = {
        messageId:messageId,
      }
      this._SharedService.emit("readReplayMessages",readReplyMessagesData)
    }
    
  }
  
  sendreadReplayMessagesListenEvent(){
    this.sendreadReplayMessagesUnsubscribe$ = this._SharedService.listen("sendreadReplayMessages").subscribe((res:any)=>{
      if(res.status === 200) {
        setTimeout(() => {
          this.parentData.replyReadMessages = [...this.parentData.replyReadMessages,...this.parentData.replyUnreadMessages]
          this.parentData.replyUnreadMessages = []
        }, 2000);
       
      }
    })
  }

  UnsubscribeMethod(){
    this.subscriptions.push(this.sendReplyUnsubscribe$)
    this.subscriptions.push(this.sendUpdatedMessageUnsubscribe$)
    this.subscriptions.push(this.sendDeleteMessageUnsubscribe$)
    this.subscriptions.push(this.sendUpdatedReplayMessageUnsubscribe$)
    this.subscriptions.push(this.sendDeleteReplyMessageUnsubscribe$)
    this.subscriptions.push(this.sendreadReplayMessagesUnsubscribe$)
  }

  closesidebar(){
    this.parentData = undefined;
    this.closeSidebarEvent.emit();
    $("#deletemessage").modal("hide");
  };

  EditMessage(item:any){
    this.selectedEditItem =item;
    this.editedTypedText = item.message
  }

  DeleteMessage(item:any){
    this.selectedDeleteItem = item;
    $("#deletemessage").modal("show");
  }

  CopyMessage(item:any){
    this.clipboard.copy(item.message);
    this._SharedService.successToast("Message copied to clipboard.");

  }

  editEmojiOpen(){
    this.editEmojimessagebox = !this.editEmojimessagebox;
    this.replyEditEmojimessagebox = false
  }

  editedAddEmoji(event:any) {
    const { editedTypedText } = this;
    const text = `${editedTypedText}${event.emoji.native}`;
    this.editedTypedText = text;
    this.editEmojimessagebox = false;
    this.replyEditEmojimessagebox = false
  }

  cancelEditMessage(){
    this.selectedEditItem =undefined;
    this.editedTypedText = '';
  }

  saveEditMessage(){
    if(this.selectedEditItem._id != undefined){
      const data ={
        messageId:this.selectedEditItem._id,
        message:this.editedTypedText==''?undefined:this.editedTypedText
      }
      this._SharedService.emit("updateMessage",data)
    }
    
  }

  cancelDeleteMessage(){
    this.selectedDeleteItem = undefined;
    $("#deletemessage").modal("hide");
  }

  confirmDeleteMessage(){
    const data = {
      messageId : this.selectedDeleteItem._id
    }
    this._SharedService.emit("deleteMessage",data)
  }


 /* --------------------ReplyMessage Section Start---------------------------------*/
 EditReplyMessage(replyitem:any){
  this.replySelectedEditItem =replyitem;
  this.replyEditedTypedText = replyitem.messageReply
}

DeleteReplyMessage(replyitem:any,index:any){
  this.replySelectedDeleteItem = replyitem;
  this.replySelectedDeleteIndex = index
}

CopyReplyMessage(replyitem:any){
  this.clipboard.copy(replyitem.messageReply);
  this._SharedService.successToast("Message copied to clipboard.");

}

replyEditEmojiOpen(){
  this.replyEditEmojimessagebox = !this.replyEditEmojimessagebox;
  this.editEmojimessagebox = false
}

replyEditedAddEmoji(event:any) {
  const { replyEditedTypedText } = this;
  const text = `${replyEditedTypedText}${event.emoji.native}`;
  this.replyEditedTypedText = text;
  this.editEmojimessagebox = false;
  this.replyEditEmojimessagebox = false
}

cancelReplyEditMessage(){
  this.replySelectedEditItem =undefined;
  this.replyEditedTypedText = '';
}

saveReplyEditMessage(){
  if(this.replySelectedEditItem._id != undefined){
    const data ={
      replyMessageId:this.replySelectedEditItem._id,
      replyMessage:this.replyEditedTypedText==''?undefined:this.replyEditedTypedText
    }
    this._SharedService.emit("updateReplyMessage",data)
  }
  
}

cancelDeleteReplyMessage(){
  this.replySelectedDeleteItem = undefined;
  this.replySelectedDeleteIndex = undefined;
  $("#deletereplymessage").modal("hide");
}

confirmDeleteReplyMessage(){
  const data = {
    replyMessageId : this.replySelectedDeleteItem._id
  }
  this._SharedService.emit("deleteReplyMessage",data)
}

onScrollUp(){
  // this.scrollUpEvent.emit();
}

onScroll(){
  this.scrollDownEvent.emit();
  if(this.checkReplyVertScroll &&this.parentData&& this.parentData?.replyUnreadMessages?.length !== 0) {
    this.readReplayMessagesEmitEvent(this.parentData._id)
  }
}

scrollToBottom() {
  try {
    if(this.parentData?.isScrollToBottom) {
      this.messages.last.nativeElement.scrollIntoViewIfNeeded({behavior: "smooth", block: "end"});
      if(this.parentData?.replyUnreadMessages?.length !== 0) this.readReplayMessagesEmitEvent(this.parentData._id)
    }
  } catch (err) {}
}

ngAfterViewInit() {
  this.messages.changes.subscribe(()=>{
    // this.scrollToBottom()
  });
}
 /* --------------------ReplyMessage Section End---------------------------------*/

 ngOnDestroy(){
  this.subscriptions.forEach((subscription) => subscription.unsubscribe())
}

}
