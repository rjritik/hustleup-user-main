import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../auth/service';
import { YourchannelService } from '../../modules/message/yourchannel/yourchannel.service';
import { SharedService } from '../shared.service';
import { Clipboard } from '@angular/cdk/clipboard';
declare var $:any;


@Component({
  selector: 'app-channel-updates',
  templateUrl: './channel-updates.component.html',
  styleUrls: ['./channel-updates.component.css']
})
export class ChannelUpdatesComponent implements OnInit,OnDestroy {
  public primeTableHeight:number=255;
  public updatesMessageList:any=[];
  public unReadUpdatesMessageList:any=[];
  public pendingMessageCount:number;
  public parentData:any;
  public activeTabType:any;
  public activeTabChannelId:any;
  public lastMessageId:any='';
  public totalReadMessageCount:number;
  public checkUpdatesVertScroll:any;
  public slideOptionsproduct = {nav:false, items: 1, loop:false};
  public selectedEditItem:any;
  public editedTypedText:any='';
  public editEmojimessagebox:boolean = false;
  public selectedDeleteItem:any;
  public selectedDeleteIndex:any;
  public sideoverhide:any;
  public selectedMessageItem:any;
  @ViewChild('content') content: ElementRef;
  @ViewChildren('readUpdatesMsg') readUpdatesMsg: QueryList<any>;
  public isScrolledToBottom:boolean = false;
  public scrollExitsAtBottom:boolean = true;
  public spinnerShow:boolean = false;
  public readChannelMessageSuccessFully :boolean = false;
  @Output() readChannelMessage = new EventEmitter<any>();


  @Input() set updatesData(params:any){
    this.parentData = params;
    if(this.activeTabChannelId !== this.parentData._id || this.activeTabType !== this.parentData.tabType){
      this.updatesMessageList=[];
      this.unReadUpdatesMessageList=[];
      this.lastMessageId='';
      this.activeTabChannelId = this.parentData._id;
      this.activeTabType = this.parentData.tabType;
      this.isScrolledToBottom = true;
      this.getUpdateMessagesList(this.activeTabChannelId,this.activeTabType,this.lastMessageId);
    }  
  }

  @Input() set channelMsgdivHeight(params:any){
    this.primeTableHeight = params
  }

  newChannelMessageUnsub$: Subscription; 
  updateChannelMessageUnsub$: Subscription; 
  deleteChannelMessageUnsub$: Subscription; 
  createOrRemoveChannelRepostedMessageUnsub$: Subscription; 
  likeUnlikeMessageUnsub$: Subscription; 
  newChannelReplyMessageUnsub$: Subscription; 
  deleteChannelReplyMessageUnsub$: Subscription; 
  readChannelMessageUnsub$: Subscription; 
  readChannelReplyMessageUnsub$: Subscription; 
  subscriptions: Subscription[] = [];

  constructor(private _YourchannelService: YourchannelService,private _SharedService: SharedService,private _AuthenticationService:AuthenticationService,private clipboard:Clipboard) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.content.nativeElement.onscroll = () => {
        if(this.content.nativeElement.scrollTop + this.content.nativeElement.clientHeight >= this.content.nativeElement.scrollHeight) {
          this.pendingMessageCount = 0;
          this.scrollExitsAtBottom = true;
        }else{
          this.scrollExitsAtBottom = false;
        }
      };
    }, 200);

    this.newChannelMessageListen();
    this.updateChannelMessageListen();
    this.deleteChannelMessageListen();
    this.createOrRemoveChannelRepostedMessageListen();
    this.likeUnlikeMessageListen();
    this.newChannelReplyMessageListen();
    this.deleteChannelReplyMessageListen();
    this.readChannelMessageEmitListen();
    this.readChannelReplyMessageEmitListen();
    this.UnsubscribeMethod();
  }

  async getUpdateMessagesList(channelId:any,messageFor:any,lastMessageId:any) {
    const data ={
      channelId,
      messageFor,
      lastMessageId
    }
    this._YourchannelService.getChannelMessage(data).subscribe((res:any) => {
      if(res.status === 200){
        this.totalReadMessageCount = res.data.totalReadMessageCount;
        if(this.lastMessageId ==''){
          this.lastMessageId = res.data.readMessages.length > 0 ? res.data.readMessages[0]._id : '';
          this.updatesMessageList = res.data.readMessages;
          this.unReadUpdatesMessageList = res.data.unReadMessages
        }else{
          this.lastMessageId = res.data.readMessages.length > 0 ? res.data.readMessages[0]._id : ''
          this.updatesMessageList = [...res.data.readMessages,...this.updatesMessageList]; 
        }
        setTimeout(() => {
          this.checkUpdatesVertScroll= this.content?.nativeElement?.scrollHeight>this.content?.nativeElement?.clientHeight;
          if(this.parentData && this.checkUpdatesVertScroll == true) {
            this.scrollToBottom();
          }else if(this.parentData && this.checkUpdatesVertScroll == false){
            this.isScrolledToBottom = false;
            if(this.unReadUpdatesMessageList.length !== 0){
              const params = {
                channelId:this.activeTabChannelId,
                messageFor:this.activeTabType
              }
              this.readChannelMessage.emit(params);
              setTimeout(() => {
                this.updatesMessageList = [...this.updatesMessageList,...this.unReadUpdatesMessageList]
                this.unReadUpdatesMessageList = []
              }, 2000);
            }
          }
        }, 0);
        if(this.parentData.updatesUnreadCount > 0){
          this.readChannelMessageEmitEvent()
        }
      }else if(res.status == 500 || res.status == 404){
        this._SharedService.errorToast(res.message)
      }
    })
  }
  //------------------------event listen section start----------------------------------------

  newChannelMessageListen(){
    this.newChannelMessageUnsub$ = this._SharedService.listen('newChannelMessageEmit').subscribe(async (res:any) => {
      if(res.status == 201){
        if(this.parentData && this.activeTabChannelId == res.data.createdMessageData.channelId && this.activeTabType == res.data.createdMessageData.messageFor){
          if(this._AuthenticationService.currentUserValue.username == res.data.senderUserDetail.username){
            this.updatesMessageList.push(res.data.createdMessageData)
            setTimeout(() => {
              this.readUpdatesMsg.toArray()[this.readUpdatesMsg.length-1].nativeElement.scrollIntoView({behavior: "smooth", block: "end"})
              this.pendingMessageCount = 0; 
              this.scrollExitsAtBottom = true; 
            }, 200);
          }else{
            if(this.parentData.isAdmin ==true){
              res.data.createdMessageData.isReposted = false;
              res.data.createdMessageData.self_message = false;
              this.updatesMessageList.push(res.data.createdMessageData)
            }else if(this.parentData.isAdmin ==false){
              res.data.createdMessageData.isReposted = false;
              res.data.createdMessageData.self_message = false;
              this.updatesMessageList.push(res.data.createdMessageData)
            }
            this.readChannelMessageEmitEvent();
            if(this.content.nativeElement.scrollTop + this.content.nativeElement.clientHeight >= this.content.nativeElement.scrollHeight) {
              setTimeout(() => {
                this.readUpdatesMsg.toArray()[this.readUpdatesMsg.length-1].nativeElement.scrollIntoView({behavior: "smooth", block: "end"})
                this.pendingMessageCount = 0; 
                this.scrollExitsAtBottom = true; 
              }, 200);
            }else{
              this.pendingMessageCount+=1;
            }
          }
          
        }
      }
      
    });
  };

  updateChannelMessageListen(){
    this.updateChannelMessageUnsub$=this._SharedService.listen("updateChannelMessageEmit").subscribe((res:any)=>{
      if(res.status === 200 && this.activeTabChannelId == res.data.channelId && this.activeTabType == res.data.messageFor){ 
        const msgIndex = this.getMessageIndex(res.data._id);
        if(msgIndex !== -1){
          this.updatesMessageList[msgIndex].message = res.data.message
          this.updatesMessageList[msgIndex].isEdited = res.data.isEdited
          this.selectedEditItem =undefined;
          this.editedTypedText = '';
        }
      }else if(res.status === 500 || res.status === 401){
        this._SharedService.errorToast(res.message);
      }else{
        this._SharedService.errorToast("not true any condition for updateChannelMessageEmit")
      }
    })
  };

  deleteChannelMessageListen(){
    this.deleteChannelMessageUnsub$ = this._SharedService.listen("deleteChannelMessageEmit").subscribe((res:any)=>{
      if(res.status === 200 && this.activeTabChannelId == res.data.channelId && this.activeTabType == res.data.messageFor){  
        if(this._AuthenticationService.currentUserValue.username == res.data.senderUserDetail.username)  {
          this._SharedService.successToast(res.data.message);
          $("#deleteCommentConfirmModal").modal("hide");
          this.spinnerShow = false;
        }
        const msgIndex = this.getMessageIndex(res.data.messageId);
        if(msgIndex !== -1) this.updatesMessageList.splice(msgIndex,1);
        this.updatesMessageList.forEach((ele:any) => {
          if(ele.quotesMessageId == res.data.messageId){
            ele.quotesMessage_details = undefined
          }
        });
        const withoutRepostedArray = this.updatesMessageList.filter((ele:any)=>{return ele.repostedMessageId !== res.data.messageId})
        this.updatesMessageList = withoutRepostedArray
      }else if(res.status === 500 || res.status === 401){
        this.spinnerShow = false;
        $("#deleteCommentConfirmModal").modal("hide");
        this._SharedService.errorToast(res.message);
      }else{
        this.spinnerShow = false;
        this._SharedService.errorToast("not true any condition for deleteChannelMessageEmit")
      }
    })
  };

  createOrRemoveChannelRepostedMessageListen(){
    this.createOrRemoveChannelRepostedMessageUnsub$ = this._SharedService.listen("createOrRemoveChannelRepostedMessageEmit").subscribe((res:any) =>{
      if(res.status == 200 && this.activeTabChannelId == res.data.channelId && this.activeTabType == res.data.messageFor){
        const msgIndex = this.getMessageIndex(res.data.messageId);
        if(msgIndex !== -1) this.updatesMessageList.splice(msgIndex,1);
        if(this._AuthenticationService.currentUserValue.username == res.data.senderUserDetail.username) this._SharedService.successToast(res.message)
      }else if(res.status === 500 || res.status === 404 || res.status === 401) {
        this._SharedService.errorToast(res.message);
      }
    })
  };

  likeUnlikeMessageListen(){
    this.likeUnlikeMessageUnsub$ = this._SharedService.listen("likeUnlikeMessageEmit").subscribe((res:any) =>{
      if(res.status == 200 && this.activeTabChannelId == res.data.messageDetails.channelId && this.activeTabType == res.data.messageDetails.messageFor){
        const msgIndex = this.getMessageIndex(res.data.messageDetails._id);
        if(msgIndex !== -1) {
          if(this._AuthenticationService.currentUserValue.username == res.data.senderUserDetail.username){
            this.updatesMessageList[msgIndex].isLiked = res.data.messageDetails.isLiked;
          }
          this.updatesMessageList[msgIndex].totalLikes = res.data.messageDetails.totalLikes;
        }
      }else if(res.status === 500 || res.status === 404) {
        this._SharedService.errorToast(res.message);
      }
    })
  };

  newChannelReplyMessageListen(){
    this.newChannelReplyMessageUnsub$=this._SharedService.listen("newChannelReplyMessageEmit").subscribe((res:any)=>{
      if(res.status === 201  && this.activeTabChannelId == res.data.channelId && this.activeTabType == res.data.messageFor){
        const msgIndex = this.getMessageIndex(res.data.createdReplyMessage.messageId);
        if(msgIndex !== -1) {
          if(this._AuthenticationService.currentUserValue.username !== res.data.senderUserDetail.username){// other member
            if(this.selectedMessageItem._id !== res.data.createdReplyMessage.messageId){
              this.updatesMessageList[msgIndex].unreadReplyMessagesCount += 1;
            }
          }
          this.updatesMessageList[msgIndex].replyCount = res.data.totalReplyMessageCount;
        }
      }
    });
  };

  deleteChannelReplyMessageListen(){
    this.deleteChannelReplyMessageUnsub$ = this._SharedService.listen("deleteChannelReplyMessageEmit").subscribe((res:any)=>{
      if(res.status === 200 && this.activeTabChannelId == res.data.channelId && this.activeTabType == res.data.messageFor){
        const msgIndex = this.getMessageIndex(res.data.messageId)
        if(msgIndex !== -1){
          this.updatesMessageList[msgIndex].replyCount -=1;
        }
      }
    });
  };

  readChannelMessageEmitListen(){
    this.readChannelMessageUnsub$ = this._SharedService.listen("readChannelMessageEmit").subscribe((res:any)=>{
      if(res.status === 200 && this.activeTabChannelId == res.data.channelId && this.activeTabType == res.data.messageFor){
        this.readChannelMessageSuccessFully = true;
      }else if(res.status ===500 || res.status ===404){
        this._SharedService.errorToast(res.message);
      }
    })
  };

  readChannelReplyMessageEmitListen(){
    this.readChannelReplyMessageUnsub$ = this._SharedService.listen("readChannelReplyMessageEmit").subscribe((res:any)=>{
      if(res.status === 200 && this.selectedMessageItem._id == res.data.messageId){
        const msgIndex = this.getMessageIndex(res.data.messageId)
        if(msgIndex !== -1) this.updatesMessageList[msgIndex].unreadReplyMessagesCount = 0;
      }
    })
  };


  UnsubscribeMethod(){
    this.subscriptions.push(this.newChannelMessageUnsub$);
    this.subscriptions.push(this.updateChannelMessageUnsub$);
    this.subscriptions.push(this.deleteChannelMessageUnsub$);
    this.subscriptions.push(this.createOrRemoveChannelRepostedMessageUnsub$);
    this.subscriptions.push(this.likeUnlikeMessageUnsub$);
    this.subscriptions.push(this.newChannelReplyMessageUnsub$);
    this.subscriptions.push(this.deleteChannelReplyMessageUnsub$);
    this.subscriptions.push(this.readChannelMessageUnsub$);
    this.subscriptions.push(this.readChannelReplyMessageUnsub$);
  };

  //------------------------event listen section End----------------------------------------

  readChannelMessageEmitEvent(){
    const readMsg = {
      channelId:this.activeTabChannelId, 
      messageFor:this.activeTabType
    }
    this._SharedService.emit("readChannelMessage",readMsg)
  };

  createQuote(item:any){
    this._SharedService.setQuoteItem(item);
  };

  createOrRemoveRepost(item:any,index:any){
    const data = {
      messageId: item._id,
    }
    this._SharedService.emit("createOrRemoveChannelRepostedMessage",data)
  };

  EditMessage(item:any){
    this.selectedEditItem =item;
    this.editedTypedText = item.message
  };

  editEmojiOpen(){
    this.editEmojimessagebox = !this.editEmojimessagebox;
  };

  editedAddEmoji(event:any) {
    const { editedTypedText } = this;
    const text = `${editedTypedText}${event.emoji.native}`;
    this.editedTypedText = text;
    this.editEmojimessagebox = false;
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
  
  DeleteMessage(item:any,index:any){
    $("#deleteCommentConfirmModal").modal("show");
    this.selectedDeleteItem = item;
    this.selectedDeleteIndex = index;
  };

  cancelDeleteMessage(){
    this.spinnerShow = false;
    this.selectedDeleteItem = undefined;
    $("#deleteCommentConfirmModal").modal("hide");
  };

  confirmDeleteMessage(){
    this.spinnerShow = true;
    const data = {
      messageId : this.selectedDeleteItem._id
    }
   this._SharedService.emit("deleteChannelMessage",data);
  };

  CopyMessage(item:any){
    this.clipboard.copy(item.message);
    this._SharedService.successToast("Message copied to clipboard.");
  };

  quotedmessageClick(item:any){
    // const matchIndex = this.singleChatMessageList.findIndex((ele:any) => {return ele._id === item._id} )
    // if(matchIndex !== -1) this.readmessage.toArray()[matchIndex].nativeElement.scrollIntoViewIfNeeded({behavior: "smooth", block: "center"})
  };

  GetAllrepliesList(params:any){
    this.selectedMessageItem = {...params,isAdmin:this.parentData.isAdmin,tabType:this.activeTabType,channelReplyBox:true} 
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
  };

  likeUnlikeMessage(item:any){
    const data = {
      messageId:item._id,
      isLiked:!item.isLiked
    };
    this._SharedService.emit("likeUnlikeMessage",data);
  };

  closesidebar(){
    this.sideoverhide = false;
    this.selectedMessageItem = {channelReplyBox:false}
    $('body').css({
      'overflow-y': 'auto',
    });
  };

  onScrollUp(){
    if (this.updatesMessageList.length+this.unReadUpdatesMessageList.length >= this.totalReadMessageCount+this.unReadUpdatesMessageList.length) return
    this.getUpdateMessagesList(this.activeTabChannelId,this.activeTabType,this.lastMessageId);
  };
   
  onScroll(event:any){
    if(this.unReadUpdatesMessageList.length !== 0){
      if(this.readChannelMessageSuccessFully){
        const params = {
          channelId:this.activeTabChannelId,
          messageFor:this.activeTabType
        }
        this.readChannelMessage.emit(params);
        this.readChannelMessageSuccessFully = false;
        setTimeout(() => {
          this.updatesMessageList = [...this.updatesMessageList,...this.unReadUpdatesMessageList]
          this.unReadUpdatesMessageList = []
        }, 2000);
      }
    }
    setTimeout(() => {
      if(this.content.nativeElement.scrollTop + this.content.nativeElement.clientHeight >= this.content.nativeElement.scrollHeight) {
        this.isScrolledToBottom = false; 
        this.scrollExitsAtBottom = true;
      }
    }, 200);
    
  };

  scrollToBottom() {
    if(this.isScrolledToBottom){
      if(this.unReadUpdatesMessageList.length == 0){
        this.readUpdatesMsg.toArray()[this.readUpdatesMsg.length-1].nativeElement.scrollIntoView({behavior: "smooth", block: "end"})
      }else{
        if(this.readUpdatesMsg.toArray().length > 0) this.readUpdatesMsg.toArray()[this.readUpdatesMsg.length-1].nativeElement.scrollIntoViewIfNeeded({behavior: "smooth", block: "center"})
      }
    }
  };

  getMessageIndex(id:any){
    return this.updatesMessageList.findIndex((ele:any)=>{return ele._id == id});
  };

  ngOnDestroy(){
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  };
}
