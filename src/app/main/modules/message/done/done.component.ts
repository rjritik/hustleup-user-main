import { Component, ElementRef, OnDestroy, OnInit, ViewChild, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { SharedService } from '../../../shared/shared.service';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { MessagechatService } from '../messagechat.service';
import { Subscription } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { Base64 } from 'js-base64';
import { getParamByISO } from 'iso-country-currency';
declare var $:any;

@Component({
  selector: 'app-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.css']
})
export class DoneComponent implements OnInit,OnDestroy,AfterViewInit{
  @ViewChild('hightbottommsg') elementView: ElementRef;
  @ViewChild('myList') public myList: ElementRef;
  @ViewChildren('readmessage') readmessage: QueryList<any>;

  ChatMemberList: any = [];
  pageNo:any=1;
  singleChatMessageList: any = [];
  UnreadMessageList:any=[];
  totalDocs:any;
  totalPages:any;
  ActiveUserChatDetail:any;
  activechatboolean = false;
  SearchChatMembertext:any='';
  // sendLikeUnlikeMessageUnscribe:Subscription;
  emojimessagebox:boolean = false;
  replyTypeMessage:any='';
  replySelectedItem:any;
  selectedReply:any;
  replyemojimessagebox:boolean = false;
  selectedEditItem:any;
  editedTypedText:any='';
  editEmojimessagebox:boolean = false;
  slideOptionsproduct = {nav:false, items: 1, loop:false};
  selectedDeleteItem:any;
  selectedDeleteIndex:any;
  // moreReplies:boolean = true;
  selectedRepostIndex:any;
  primeTableHeight:number = 213;

  sideoverhide:any;
  replyBox:any;
  replyPageNo:any=1;
  replyTotalPages:any;
  replyTotalDocs:any;
  replyUnreadMessageList:any=[];
  replyReadMessageList:any=[];

  GetclearSearchedCMUnsubscribe$: Subscription;
  markAsUndoneEmitUnsubscribe$: Subscription;
  sendreplyUnsubscribe$: Subscription; 
  sendUpdatedMessageUnsubscribe$: Subscription; 
  sendDeleteMessageUnsubscribe$: Subscription; 
  sendDeleteAllMessageUnsubscribe$: Subscription; 
  sendRespostedMessageUnsubscribe$: Subscription; 
  sendDeleteReplyMessageUnsubscribe$: Subscription;
  sendUnreadMessagesUnsubscribe$: Subscription;
  sendReadUnreadMessagesUnsubscribe$: Subscription;
  sendreadReplayMessagesUnsubscribe$: Subscription;
  subscriptions: Subscription[] = []

  disableScrollDown = true;
  verticalScrollbarAvailable:boolean

  isScrolledToBottom:boolean = false;
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');

  constructor( private _MessagechatService: MessagechatService, private _SharedService: SharedService,private _AuthenticationService:AuthenticationService,private clipboard:Clipboard) {}

  ngOnInit(): void{
    this.GetclearSearchedCMUnsubscribe$ = this._SharedService.GetclearSearchedCM.subscribe((res:any)=>{
      this.SearchChatMembertext = res
    })
    if(this.ChatMemberList.length === 0) this.ActiveUserChatDetail = undefined;
    this.sendReplyEventListen()
    this.markAsUndoneEmitListenEvent()
    this.sendUpdatedMessageEventListen()
    this.sendDeleteMessageEventListen()
    this.sendDeleteAllMessageEventListen()
    this.sendRespostedMessageEventListen()
    this.sendDeleteReplyMessageEventListen()
    this.sendUnreadMessagesEventListen()
    this.sendReadUnreadMessagesListenEvent()
    this.sendreadReplayMessagesListenEvent()
    this.GetAllChatMembers()
    this.UnsubscribeMethod();
  }

  minHeightOfTable(){
    this.primeTableHeight = (213-100) + this.elementView?.nativeElement?.offsetHeight;
  };

  newCloseQuote(data:any){
    setTimeout(() => {
      this.minHeightOfTable();
    }, 50);
  };

  markAsUndoneEmitListenEvent() {
    this.markAsUndoneEmitUnsubscribe$ = this._SharedService.listen('markAsUndoneEmit').subscribe((res: any) => {
      if(this._AuthenticationService.currentUserValue.username == res.senderUser_detail.username){ //sender screen
        const receiverIndex = this.ChatMemberList.findIndex((ele:any)=>{return ele.user_details._id === res.receiverUser_detail._id})
        if(receiverIndex !== -1) this.ChatMemberList.splice(receiverIndex, 1);
        if(this.ActiveUserChatDetail && this.ActiveUserChatDetail.user_details._id == res.receiverUser_detail._id){
          this.activechatboolean = false;
        }
      }
      if(this._AuthenticationService.currentUserValue.username == res.receiverUser_detail.username){//receiver screen
        const senderIndex = this.ChatMemberList.findIndex((ele:any)=>{return ele.user_details._id === res.senderUser_detail._id})
        if(senderIndex !== -1) this.ChatMemberList.splice(senderIndex, 1);
        if(this.ActiveUserChatDetail && this.ActiveUserChatDetail.user_details._id == res.senderUser_detail._id){
          this.activechatboolean = false;
        }
      }
    });
  }

  async chatMemberSortingFunction(){
    const tempArray:any[] = [];
    const nullarray: any[] = [];
    await this.ChatMemberList.forEach((element:any) => {
      if(element?.messages?.created_date == undefined){
        nullarray.push(element)
      }else{
        tempArray.push(element)
      }
    });
    const sortedArray = tempArray.sort((a:any, b:any) => {
      return new Date(b.messages.created_date).getTime() - new Date(a.messages.created_date).getTime();
    })
    this.ChatMemberList = [...sortedArray,...nullarray]
  }

  sendUnreadMessagesEventListen(){
    this.sendUnreadMessagesUnsubscribe$ = this._SharedService.listen("sendUnreadMessages").subscribe((res:any) =>{
      if(this.ActiveUserChatDetail && this.ActiveUserChatDetail.user_details._id == res.senderUserDetail._id){
        this.readUnreadMessagesEmitEvent(res.senderUserDetail._id)
      }else{
        const index = this.ChatMemberList.findIndex((ele:any)=>{return ele.user_details._id === res.senderUserDetail._id})
        if(index !== -1) this.ChatMemberList[index].user_details.messageCount = res.receiverUserDetail?.messageCount
      }

    })
  }

  readUnreadMessagesEmitEvent(receiverId:any){
    const readUnreadMessagesData = {
      receiverId:receiverId,
    }
    console.log(readUnreadMessagesData,"readUnreadMessagesData")
    this._SharedService.emit("readUnreadMessages",readUnreadMessagesData)
  }
  
  sendReadUnreadMessagesListenEvent(){
    this.sendReadUnreadMessagesUnsubscribe$ = this._SharedService.listen("sendReadUnreadMessages").subscribe((res:any)=>{
      if(res.status === 200) {
        const index = this.ChatMemberList.findIndex((ele:any)=>{return ele.user_details._id === res.senderUserDetail._id})
        if(index !== -1) this.ChatMemberList[index].user_details.messageCount = res.senderUserDetail.messageCount

        setTimeout(() => {
          this.singleChatMessageList = [...this.singleChatMessageList,...this.UnreadMessageList]
          this.UnreadMessageList = []
        }, 2000);
       
      }
    })
  }

  sendReplyEventListen(){
    this.sendreplyUnsubscribe$ = this._SharedService.listen("sendReply").subscribe((res:any)=>{
      const readMsgIndex = this.singleChatMessageList.findIndex((ele:any)=> {return ele._id == res[0].message_id})
      if(readMsgIndex == -1){
        const unreadMsgIndex = this.UnreadMessageList.findIndex((ele:any)=> {return ele._id == res[0].message_id})
        if(unreadMsgIndex !== -1) {
          this.UnreadMessageList[unreadMsgIndex].replyCount = res[0].replyCount+1
        }
      }else this.singleChatMessageList[readMsgIndex].replyCount = res[0].replyCount+1
      //show pendingreplymessagecount
      if(this._AuthenticationService.currentUserValue.username == res[0].receiverUserDetail.username){  //receivercheck
        if(this.replySelectedItem){
          if(this.replySelectedItem._id !== res[0].message_id){ //activecheck
            const memberIndex = this.ChatMemberList.findIndex((ele:any)=>{return ele.user_details._id === res[0].senderUserDetail._id })
            if(memberIndex !== -1) this.ChatMemberList[memberIndex].user_details.replayMessagesCount = res[0].unreadReplayMessageCount 
          }
        }else{// replynot selected so is inactive so show pendingreply count
          const memberIndex = this.ChatMemberList.findIndex((ele:any)=>{return ele.user_details._id === res[0].senderUserDetail._id })
          if(memberIndex !== -1) this.ChatMemberList[memberIndex].user_details.replayMessagesCount = res[0].unreadReplayMessageCount;
          if(readMsgIndex == -1){
            const unreadMsgIndex = this.UnreadMessageList.findIndex((ele:any)=> {return ele._id == res[0].message_id})
            if(unreadMsgIndex !== -1) {
              this.UnreadMessageList[unreadMsgIndex].replayUnreadCount = res[0].unreadReplayMessageCount;
            }
          }else{
            this.singleChatMessageList[readMsgIndex].replayUnreadCount = res[0].unreadReplayMessageCount
          }
        }
      } 
    })
  };

  sendUpdatedMessageEventListen(){
    this.sendUpdatedMessageUnsubscribe$=this._SharedService.listen("sendUpdatedMessage").subscribe((res:any)=>{
      const msgIndex = this.singleChatMessageList.findIndex((ele:any)=> {return ele._id == res._id})
      if(msgIndex != -1){
        this.singleChatMessageList[msgIndex].message = res.message
        this.singleChatMessageList[msgIndex].isEdited = res.isEdited
      }
      this.selectedEditItem =undefined;
      this.editedTypedText = '';
    })
  };

  sendDeleteMessageEventListen(){
    this.sendDeleteMessageUnsubscribe$ = this._SharedService.listen("sendDeleteMessage").subscribe((res:any)=>{
      if(this._AuthenticationService.currentUserValue.username == res[0].user_details.username){
        console.log(this.singleChatMessageList.length == this.selectedDeleteIndex+1)
        if(this.singleChatMessageList.length == this.selectedDeleteIndex+1){
          const index = this.ChatMemberList.findIndex((ele:any)=>{return ele._id == this.ActiveUserChatDetail._id})
          this.ChatMemberList[index].messages.message = res[0].message
          this.ChatMemberList[index].messages.created_date = res[0].created_date
        }
        this.singleChatMessageList.splice(this.selectedDeleteIndex,1);
        this.chatMemberSortingFunction()
      }
    })
  };

  sendDeleteAllMessageEventListen(){
    this.sendDeleteAllMessageUnsubscribe$ = this._SharedService.listen("sendDeleteAllMessage").subscribe((res:any)=>{
      $("#deleteallmessage").modal("hide");
      this.singleChatMessageList = [];
      const index = this.ChatMemberList.findIndex((ele:any)=>{return ele._id == this.ActiveUserChatDetail._id})
      this.ChatMemberList[index].messages.message =undefined;
      this.ChatMemberList[index].messages.created_date = undefined;
      this.chatMemberSortingFunction()
      this._SharedService.successToast(res.message)
    })
  };

  sendRespostedMessageEventListen(){
    this.sendRespostedMessageUnsubscribe$ = this._SharedService.listen("sendRespostedMessage").subscribe((res:any) =>{
      if(res.status == 200){
        this.singleChatMessageList.splice(this.selectedRepostIndex,1)
        this._SharedService.successToast(res.message);
        this.selectedRepostIndex = undefined;
      }
    })
  };

  sendDeleteReplyMessageEventListen(){
    this.sendDeleteReplyMessageUnsubscribe$ = this._SharedService.listen("sendDeleteReplyMessage").subscribe((res:any)=>{
      if(this._AuthenticationService.currentUserValue.username == res.user_details.username){
        const msgIndex = this.singleChatMessageList.findIndex((ele:any)=>{return ele._id == res.messageId})
        this.singleChatMessageList[msgIndex].replyCount = res.replyCount
      }
    })
  };

  sendreadReplayMessagesListenEvent(){
    this.sendreadReplayMessagesUnsubscribe$ = this._SharedService.listen("sendreadReplayMessages").subscribe((res:any)=>{
      if(res.status === 200) {
        setTimeout(() => {
          const msgIndex = this.singleChatMessageList.findIndex((ele:any)=>{return ele._id == res.messageId})
          this.singleChatMessageList[msgIndex].replayUnreadCount = res.unReadReplayMessagesCount
          const index = this.ChatMemberList.findIndex((ele:any)=>{return ele.user_details._id === res.senderUserDetail._id})
          if(index !== -1) this.ChatMemberList[index].user_details.replayMessagesCount = res.unReadReplayMessagesCount
        },2000)
      }
    })
  }

  UnsubscribeMethod(){
    this.subscriptions.push(this.GetclearSearchedCMUnsubscribe$)
    this.subscriptions.push(this.markAsUndoneEmitUnsubscribe$)
    // this.subscriptions.push(this.sendMessageUnsubscribe$)
    this.subscriptions.push(this.sendreplyUnsubscribe$)
    this.subscriptions.push(this.sendUpdatedMessageUnsubscribe$)
    this.subscriptions.push(this.sendDeleteMessageUnsubscribe$)
    this.subscriptions.push(this.sendDeleteAllMessageUnsubscribe$)
    this.subscriptions.push(this.sendRespostedMessageUnsubscribe$)
    this.subscriptions.push(this.sendDeleteReplyMessageUnsubscribe$)
    this.subscriptions.push(this.sendUnreadMessagesUnsubscribe$)
    this.subscriptions.push(this.sendReadUnreadMessagesUnsubscribe$)
    this.subscriptions.push(this.sendreadReplayMessagesUnsubscribe$)
  }

  GetAllChatMembers(){
    const data = {
      pattern:"done"
    }
    this._MessagechatService.getAllChatMembers(data).subscribe((res: any) => {
      if (res.status === 200) {
        this.ChatMemberList = res.data;
      }
    }, (err => {
      console.log(err, "err - data");
    }));
  }

  userchatdetails(item: any) {
    if(this.ActiveUserChatDetail?._id !== item._id){
      this.activechatboolean = true;
      this.ActiveUserChatDetail = {_id:item._id,user_details:item.user_details,messageBox:true};
      this.pageNo=1;
      this.GetChatMessageList(this.ActiveUserChatDetail._id,this.pageNo)
      this.disableScrollDown = false
      
    }
    
  }

  GetChatMessageList(chatroomId:any,pageno:any){
    const data = {
      chatroom_id: chatroomId,
      page: pageno,
      limit: 10
    }
    this._MessagechatService.getChatMessageList(data).subscribe(async (res: any) => {
      if (res.status === 200) {
        this.totalDocs = await res.data.totalDocs
        this.totalPages = await res.data.totalPages
        this.UnreadMessageList = res.data.docs.unreadMessages
        
        if(this.pageNo === 1){
          this.singleChatMessageList = res.data.docs.readMessages  
        }else{
          this.singleChatMessageList = [...res.data.docs.readMessages,...this.singleChatMessageList]
        }

        setTimeout(() => {
          this.verticalScrollbarAvailable= this.myList.nativeElement.scrollHeight>this.myList.nativeElement.clientHeight;
          if(!this.verticalScrollbarAvailable && this.UnreadMessageList.length !== 0) this.readUnreadMessagesEmitEvent(this.ActiveUserChatDetail.user_details._id)
        }, 0);
        this.isScrolledToBottom = true;
      }
    })   
  }

  createQuote(item:any){
    this._SharedService.setQuoteItem(item);
    // setTimeout(() => {
    //   this.minHeightOfTable();
    // }, 50);
  }

  createRepost(item:any,index:any){
    this.selectedRepostIndex = index
    const data = {
      messageId: item._id,
    }
    this._SharedService.emit("respostedMessage",data)
  }


  replyEmojiOpen(){
    this.replyemojimessagebox = !this.replyemojimessagebox;
  }
  
  addReplyEmoji(event:any){
    const { replyTypeMessage } = this;
    const text = `${replyTypeMessage}${event.emoji.native}`;
    this.replyTypeMessage = text;
    this.replyemojimessagebox = false;
  }

  GetAllrepliesList(params:any){
    this.replySelectedItem = params;
    this.replyPageNo=1;
    this.sideoverhide = true;
    $('body').css({
      'overflow-y': 'hidden',
    });
    this.replyListApi(params._id,this.replyPageNo)
  }

  replyListApi(id:any,pageno:any){
    const data = {
      messageReplyId:id,
      page: pageno,
      limit: 10
    }
    this._MessagechatService.getChatMessagesListReplysList(data).subscribe(async(res:any)=>{
      if(res.status == 200){
        this.replyTotalPages = await  res.data.totalPages
        this.replyTotalDocs = await res.data.totalDocs
        if(this.replyPageNo === 1){
          this.replyReadMessageList = res.data.docs.readMessages
          this.selectedReply = {isScrollToBottom:true,replyBox:true,...this.replySelectedItem,replyReadMessages:this.replyReadMessageList,replyUnreadMessages:this.replyUnreadMessageList}  
        }else{
          this.replyReadMessageList = [...this.replyReadMessageList,...res.data.docs.readMessages]
          this.selectedReply = {isScrollToBottom:false,replyBox:true,...this.replySelectedItem,replyReadMessages:this.replyReadMessageList,replyUnreadMessages:this.replyUnreadMessageList}
        }
        if(this.replyReadMessageList.length == res.data.totalDocs){
          this.replyUnreadMessageList = res.data.docs.unreadMessages
          this.selectedReply = {isScrollToBottom:false,replyBox:true,...this.replySelectedItem,replyReadMessages:this.replyReadMessageList,replyUnreadMessages:this.replyUnreadMessageList}
        }
      }else{
        this._SharedService.errorToast(res.message)
      }
    })
  }

  EditMessage(item:any){
    this.selectedEditItem =item;
    this.editedTypedText = item.message
  }
  
  editEmojiOpen(){
    this.editEmojimessagebox = !this.editEmojimessagebox;
  }

  editedAddEmoji(event:any) {
    const { editedTypedText } = this;
    const text = `${editedTypedText}${event.emoji.native}`;
    this.editedTypedText = text;
    this.editEmojimessagebox = false;
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

  DeleteMessage(item:any,index:any){
    this.selectedDeleteItem = item;
    this.selectedDeleteIndex = index
  }

  cancelDeleteMessage(){
    this.selectedDeleteItem = undefined;
  }

  confirmDeleteMessage(){
    const data = {
      messageId : this.selectedDeleteItem._id
    }
    this._SharedService.emit("deleteMessage",data)
  }

  CopyMessage(item:any){
    this.clipboard.copy(item.message);
    this._SharedService.successToast("Message copied to clipboard.");
  }

  // markAsDone(){
  //   const data = {
  //     chatroomId:this.ActiveUserChatDetail._id,
  //     pattern:"markAsDone"
  //   }
  //   this._MessagechatService.markAsDoneUndoneMember(data).subscribe((res:any)=>{
  //     if(res.status == 200){
  //       this.activechatboolean = false;
  //       const index = this.ChatMemberList.findIndex((item:any)=>{ return item._id == this.ActiveUserChatDetail._id})
  //       this.ChatMemberList.splice(index,1)
  //       this._SharedService.successToast(res.message)
  //     }else if(res.status == 409){
  //       this._SharedService.InfoToast(res.message)
  //     }else{
  //       this._SharedService.errorToast(res.message)
  //     }
  //   })
  // }

  // moveToSpam(){
  //   const data ={
  //     chatroomId:this.ActiveUserChatDetail._id,
  //   }
  //   console.log(data,"data")
  //   this._MessagechatService.moveToSpamMember(data).subscribe((res:any)=>{
  //     if(res.status == 200){
  //       this.activechatboolean = false;
  //       const index = this.ChatMemberList.findIndex((item:any)=>{ return item._id == this.ActiveUserChatDetail._id})
  //       this.ChatMemberList.splice(index,1)
  //       this._SharedService.successToast(res.message)
  //     }else if(res.status == 409){
  //       this._SharedService.InfoToast(res.message)
  //     }else{
  //       this._SharedService.errorToast(res.message)
  //     }
  //   })

  // }

  markAsUndone(){
    const data ={
      chatroomId:this.ActiveUserChatDetail._id,
      pattern:"markAsUndone"
    }
    this._MessagechatService.markAsDoneUndoneMember(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.activechatboolean = false;
        const index = this.ChatMemberList.findIndex((item:any)=>{ return item._id == this.ActiveUserChatDetail._id})
        this.ChatMemberList.splice(index,1)
        this._SharedService.successToast(res.message)
      }else if(res.status == 409){
        this._SharedService.InfoToast(res.message)
      }else{
        this._SharedService.errorToast(res.message)
      }
    })
  }

  moveToSpam(){
    const data ={
      chatroomId:this.ActiveUserChatDetail._id,
    }
    this._MessagechatService.moveToSpamMember(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.activechatboolean = false;
        const index = this.ChatMemberList.findIndex((item:any)=>{ return item._id == this.ActiveUserChatDetail._id})
        this.ChatMemberList.splice(index,1)
        this._SharedService.successToast(res.message)
      }else if(res.status == 409){
        this._SharedService.InfoToast(res.message)
      }else{
        this._SharedService.errorToast(res.message)
      }
    })

  }

  confirmDeleteAllMessage(){
    $("#deleteallmessage").modal("show");
    const data = {
      chatroom_id:this.ActiveUserChatDetail._id
    }
    this._SharedService.emit("deleteAllMessage",data)
  }

  cancelDeleteAllMessage(){
    $("#deleteallmessage").modal("hide");
  }

  NewMsgBox() {
    this._SharedService.minimizeres('truenew');
  }

  createNewMsgBox(){
    const data = {
      text:'createNewMsgBox',
      userdetail:this.ActiveUserChatDetail.user_details
    }
    this._SharedService.setUserDetail(data);
  }

  composemsgdown() {
    this._SharedService.minimizeres('minimizesub');
  }

  chatMemberKeyup(event:any){
    console.log(event.key,"event")
  }

  onScroll() {
    if(this.UnreadMessageList.length !== 0){
      this.readUnreadMessagesEmitEvent(this.ActiveUserChatDetail.user_details._id)
    }
  }

  onScrollUp(){
    if (this.singleChatMessageList.length +this.UnreadMessageList.length >= this.totalDocs+this.UnreadMessageList.length) return
    if(this.pageNo <this.totalPages) this.pageNo += 1
    this.GetChatMessageList(this.ActiveUserChatDetail._id,this.pageNo)
  }

  quotedmessageClick(item:any){
    const matchIndex = this.singleChatMessageList.findIndex((ele:any) => {return ele._id === item._id} )
    if(matchIndex !== -1) this.readmessage.toArray()[matchIndex].nativeElement.scrollIntoViewIfNeeded({behavior: "smooth", block: "center"})
  }

  closesidebar(){
    this.sideoverhide = false;
    this.selectedReply = {isScrollToBottom:false,replyBox:false}
    $('body').css({
      'overflow-y': 'auto',
    });
  };

  replyScrollDown(){
    if (this.replyReadMessageList.length +this.replyUnreadMessageList.length >= this.replyTotalDocs+this.replyUnreadMessageList.length) return
    if(this.replyPageNo <this.replyTotalPages) this.replyPageNo += 1
    this.replyListApi(this.replySelectedItem._id,this.replyPageNo)
  }

  scrollToBottom() {
    try {
      setTimeout(() => {
        if(this.isScrolledToBottom && this.pageNo == 1){
          if(this.UnreadMessageList.length == 0){
            this.readmessage.toArray()[this.readmessage.length-1].nativeElement.scrollIntoView({behavior: "smooth", block: "end"})
          }else{
            this.readmessage.toArray()[this.readmessage.length-1].nativeElement.scrollIntoView({behavior: "smooth", block: "center"})
          }
          
        }
      }, 200);
        
      // this.readmessage.last.nativeElement.scrollIntoViewIfNeeded({behavior: "smooth", block: "end"});
      // this.readmessage.toArray()[this.readmessage.length-1].nativeElement.scrollTo({left: 0 , top: this.myList.nativeElement.scrollHeight, behavior: 'smooth'});
      
    } catch (err) {}
  }

  ngAfterViewInit() {
    this.readmessage.changes.subscribe((e:any)=>{
      if(e.length !== 0){
        this.scrollToBottom()
      }
    });
  }

  ngOnDestroy(){
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  } 
}

