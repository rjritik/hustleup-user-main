import { Component, OnDestroy, OnInit,Output, EventEmitter ,Input, ChangeDetectorRef, ElementRef, ViewChild, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AuthenticationService } from '../../auth/service';
import { MessagechatService } from '../../modules/message/messagechat.service';
import { MinimizepopService } from '../minimizepop/minimizepop.service';
import { SharedService } from '../shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $:any;

@Component({
  selector: 'app-bottommessagebox',
  templateUrl: './bottommessagebox.component.html',
  styleUrls: ['./bottommessagebox.component.css']
})
export class BottommessageboxComponent implements OnInit,OnDestroy{
  @Output() newCloseQuote = new EventEmitter<string>();
  @ViewChild('textArea') public textArea: ElementRef;
  emojimessagebox = false;
  productboxmsg = false;
  savedRepliesPopup = false;
  createdsavedRepliesItem = false;
  @Input() ActiveUserChatDetail:any

  private searchproductsubject: Subject<string> = new Subject();
  SearchedProductName:any;
  productsearchdata:any=[];
  TypedMessage:any='';
  selectedDocFile:any=[];
  selectedImageFile:any=[];
  selectedProductId:any;
  FinalSelectedProductId:any;
  isSearchedProductAvail:boolean = false;
  clickCount = 0;

  editSavedReplies:boolean = true;
  DeleteSavedReplies:any;
  UpdateSavedReplies:any;
  SavedRepliesList:any=[];
  showIsTyping:boolean = false;

  selectedQuoteItem:any;
  enterkeylisten:boolean = false;
  previewSelectedImage:any=[];

  private typeMessagesubject: Subject<any> = new Subject();

  formDataMessages:any = new FormData();
  spinnerShow:boolean = false;

  getQuoteItemUnsubscribe$: Subscription;
  typeMessagesubjectUnsubscribe$: Subscription;
  searchproductsubjectUnsubscribe$: Subscription; 
  sendUser_typingUnsubscribe$: Subscription; 
  sendUser_stopped_typingUnsubscribe$: Subscription; 
  sendMessageUnsubscribe$: Subscription; 
  sendReplyUnsubscribe$: Subscription; 
  channelMessageTypingUnsub$: Subscription; 
  stopChannelMessageTypingUnsub$: Subscription; 
  newChannelMessageUnsub$: Subscription; 
  channelReplyMessageTypingUnsub$: Subscription; 
  stopChannelReplyMessageTypingUnsub$: Subscription; 
  newChannelReplyMessageUnsub$: Subscription; 
  subscriptions: Subscription[] = []

  constructor(private _SharedService: SharedService,
              private _MinimizepopService:MinimizepopService,
              private _AuthenticationService:AuthenticationService,
              private _MessagechatService: MessagechatService,
              private cdr: ChangeDetectorRef,
              private sanitizer:DomSanitizer) {}

  ngOnInit(): void {
    this.sendUser_typingEventListing()
    this.sendUser_stopped_typingEventListing()
    this.DebounceMethods()
    this.SendMessageEventListen();
    this.sendReplyEventListen();
    this.channelMessageTypingListing();
    this.stopChannelMessageTypingListing();
    this.newChannelMessageListen();
    this.channelReplyMessageTypingListing();
    this.stopChannelReplyMessageTypingListing();
    this.newChannelReplyMessageListen();
    this.GetQuoteItem();
    this.UnsubscribeMethod();
  }

  EnterSendMessage(){
    if(this.ActiveUserChatDetail?.messageBox == true){
      this.sendNewMessage()
    }else if(this.ActiveUserChatDetail?.replyBox == true){
      this.sendReplyMessage()
    }else if(this.ActiveUserChatDetail?.channelBox == true){
      this.sendNewChannelMessage()
    }else if(this.ActiveUserChatDetail?.channelReplyBox == true){
      this.sendNewChannelReplyMessage()
    }
  }

  GetQuoteItem(){
    this.getQuoteItemUnsubscribe$ = this._SharedService.getQuoteItem().subscribe((res:any)=>{
      this.selectedQuoteItem = res
      this.newCloseQuote.emit('quoteClose');
    })
  }

  DebounceMethods(){
    this.typeMessagesubjectUnsubscribe$ = this.typeMessagesubject.pipe(debounceTime(500)).subscribe((params:any) => {     
      if(this.ActiveUserChatDetail.messageBox == true){
        this._SharedService.emit("user_stopped_typing",params)
      }else if(this.ActiveUserChatDetail.replyBox == true){
        //replymessage typing event call karvi
      }else if(this.ActiveUserChatDetail?.tabType == 'updates' || this.ActiveUserChatDetail?.tabType == 'discussions'){
        this._SharedService.emit("stopChannelMessageTyping",params)
      }else if(this.ActiveUserChatDetail.channelReplyBox == true){
        this._SharedService.emit("stopChannelReplyMessageTyping",params)
      }
    });
    this.searchproductsubjectUnsubscribe$ = this.searchproductsubject.pipe(debounceTime(500)).subscribe((productsearchTextValue:any) => {
      this.getProducts(productsearchTextValue);
    });
  }

  sendUser_typingEventListing(){
    this.sendUser_typingUnsubscribe$ = this._SharedService.listen("sendUser_typing").subscribe(async (res:any)=>{
      if(this.ActiveUserChatDetail?.user_details?.username == res.userDetail.username){
        this.showIsTyping = res.typing
      }
    })
  }

  sendUser_stopped_typingEventListing(){
    this.sendUser_stopped_typingUnsubscribe$ = this._SharedService.listen("sendUser_stopped_typing").subscribe((res:any)=>{
      this.showIsTyping = res.typing
    })
  }

  SendMessageEventListen(){
    this.sendMessageUnsubscribe$ = this._SharedService.listen('sendMessage').subscribe(async (res:any) => {
      this.clearMessagedetail();
      this.FinalSelectedProductId = undefined;
      this.selectedProductId = undefined;
      this._SharedService.SetclearSearchedCM('');
      this.selectedQuoteItem = undefined;
      this.newCloseQuote.emit('quoteClose');
    });
  }

  sendReplyEventListen(){
    this.sendReplyUnsubscribe$ = this._SharedService.listen("sendReply").subscribe((res:any)=>{
      this.clearMessagedetail();
      this._SharedService.SetclearSearchedCM('');
    })
  }

  channelMessageTypingListing(){
    this.channelMessageTypingUnsub$ = this._SharedService.listen("channelMessageTypingEmit").subscribe((res:any)=>{
      if(this.ActiveUserChatDetail && this.ActiveUserChatDetail._id == res.data.channelId  && this.ActiveUserChatDetail.tabType == res.data.messageFor){
        this.showIsTyping = res.data.typing
      }
      
    })
  }

  stopChannelMessageTypingListing(){
    this.stopChannelMessageTypingUnsub$ = this._SharedService.listen("stopChannelMessageTypingEmit").subscribe((res:any)=>{
      if(this.ActiveUserChatDetail && this.ActiveUserChatDetail._id == res.data.channelId  && this.ActiveUserChatDetail.tabType == res.data.messageFor){
        this.showIsTyping = res.data.typing
      }
      
    })
  }

  newChannelMessageListen(){
    this.newChannelMessageUnsub$ = this._SharedService.listen('newChannelMessageEmit').subscribe(async (res:any) => {
      if(res.status == 201 && this._AuthenticationService.currentUserValue.username ==  res.data.senderUserDetail.username){ // sender mate
        this.clearMessagedetail();
        this.FinalSelectedProductId = undefined;
        this.selectedProductId = undefined;
        // this._SharedService.SetclearSearchedCM('');
        this.selectedQuoteItem = undefined;
        this.newCloseQuote.emit('quoteClose');
      }else if(res.status === 500 || res.status === 401 || res.status === 400){
        this._SharedService.errorToast(res.message)
        this.spinnerShow = false;
      }
      
    });
  }

  channelReplyMessageTypingListing(){
    this.channelReplyMessageTypingUnsub$ = this._SharedService.listen("channelReplyMessageTypingEmit").subscribe((res:any)=>{
      if(res.status === 200 && this.ActiveUserChatDetail && this.ActiveUserChatDetail._id == res.data.messageId){
        this.showIsTyping = res.data.typing
      }else if(res.status === 500 || res.status === 401 || res.status === 400){
        this._SharedService.errorToast(res.message)
      }
    });
  }

  stopChannelReplyMessageTypingListing(){
    this.stopChannelReplyMessageTypingUnsub$ = this._SharedService.listen("stopChannelReplyMessageTypingEmit").subscribe((res:any)=>{
      if(res.status === 200 && this.ActiveUserChatDetail && this.ActiveUserChatDetail._id == res.data.messageId){
        this.showIsTyping = res.data.typing
      }else if(res.status === 500 || res.status === 401 || res.status === 400){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  newChannelReplyMessageListen(){
    this.newChannelReplyMessageUnsub$ = this._SharedService.listen('newChannelReplyMessageEmit').subscribe(async (res:any) => {
      if(res.status == 201 && this._AuthenticationService.currentUserValue.username ==  res.data.senderUserDetail.username){ // sender mate
        this.clearMessagedetail();
        this.newCloseQuote.emit('quoteClose');
      }else if(res.status === 500 || res.status === 401 || res.status === 400){
        this._SharedService.errorToast(res.message)
        this.spinnerShow = false;
      }
      
    });
  }

  clearMessagedetail(){
    this.TypedMessage = "";
    this.selectedImageFile = [];
    this.previewSelectedImage = [];
    this.selectedDocFile = [];
    this.productcancel();
    this.spinnerShow = false;
  }

  UnsubscribeMethod(){
    this.subscriptions.push(this.getQuoteItemUnsubscribe$);
    this.subscriptions.push(this.typeMessagesubjectUnsubscribe$);
    this.subscriptions.push(this.searchproductsubjectUnsubscribe$);
    this.subscriptions.push(this.sendUser_typingUnsubscribe$);
    this.subscriptions.push(this.sendUser_stopped_typingUnsubscribe$);
    this.subscriptions.push(this.sendMessageUnsubscribe$);
    this.subscriptions.push(this.sendReplyUnsubscribe$);
    this.subscriptions.push(this.channelMessageTypingUnsub$);
    this.subscriptions.push(this.stopChannelMessageTypingUnsub$);
    this.subscriptions.push(this.newChannelMessageUnsub$);
    this.subscriptions.push(this.channelReplyMessageTypingUnsub$);
    this.subscriptions.push(this.stopChannelReplyMessageTypingUnsub$);
    this.subscriptions.push(this.newChannelReplyMessageUnsub$);
  }

  /*------------------------SavedReplies Section Start----------------------------*/

  savedReplayForm:any = new FormGroup({
    replytitle: new FormControl(undefined,[Validators.required]),
    replymsg: new FormControl(undefined,[Validators.required]),
  });
  get f() {
    return this.savedReplayForm;
  }

  GetAllSavedRepliesMessages(){
    this._MinimizepopService.getAllRepliesMessagesList().subscribe((res:any)=>{
      if(res.status == 200){
        this.SavedRepliesList = res.data;
      }else this._SharedService.errorToast(res.message)
    })
  }

  createReplySubmit(f:any){
    if (f.valid) {
      let data ={
        replyTitle: this.sanitizer.sanitize(SecurityContext.HTML, f.value.replytitle),
        replyMessage: this.sanitizer.sanitize(SecurityContext.HTML, f.value.replymsg)
      }

      this._MinimizepopService.addRepliesMessages(data).subscribe((res:any)=>{
        if(res.status == 201){
          this.SavedRepliesList.push(res.data);
          this._SharedService.successToast(res.message);
          this.savedtemplate()
        }else this._SharedService.errorToast(res.message)
      })
      
    }else{
      this.savedReplayForm.markAllAsTouched()
    }
  }

  EditSavedReply(item:any){
    this.UpdateSavedReplies = item
    this.savedReplayForm.patchValue({
      replytitle: item.replyTitle,
      replymsg: item.replyMessage
    });
    this.editSavedReplies = false
    this.createdsavedRepliesItem = true;
    this.savedRepliesPopup = false;
    this.productboxmsg = false;
    this.emojimessagebox = false;  
  }

  UpdateReplySubmit(f:any){
    if (f.valid) {
      let data ={
        replyMessageId:this.UpdateSavedReplies._id,
        replyTitle: this.sanitizer.sanitize(SecurityContext.HTML, f.value.replytitle),
        replyMessage: this.sanitizer.sanitize(SecurityContext.HTML, f.value.replymsg)
      }

      this._MinimizepopService.editRepliesMessages(data).subscribe((res:any)=>{
        if(res.status === 200){
          let index = this.SavedRepliesList.findIndex((element:any)=> element._id == this.UpdateSavedReplies._id)
          this.SavedRepliesList[index].replyTitle = this.sanitizer.sanitize(SecurityContext.HTML, f.value.replytitle)
          this.SavedRepliesList[index].replyMessage = this.sanitizer.sanitize(SecurityContext.HTML, f.value.replymsg)
          this._SharedService.successToast(res.message);
          this.savedtemplate()
        }else this._SharedService.errorToast(res.message)
      })
      
    }else{
      this.savedReplayForm.markAllAsTouched()
    }
  }

  DeleteSavedReply(item:any){
    this.DeleteSavedReplies = item
  }

  ConfirmSavedRepliesDelete(){
    const data = {
      replyMessageId:this.DeleteSavedReplies._id
    }
    this._MinimizepopService.deleteRepliesMessage(data).subscribe((res:any)=>{
      if(res.status == 200){
        const index = this.SavedRepliesList.findIndex((element:any)=> element._id == this.DeleteSavedReplies._id)
        this.SavedRepliesList.splice(index, 1);
        this._SharedService.successToast(res.message)
        $("#savedlist-delete").modal("hide");
      }else{
        this._SharedService.errorToast(res.message)
      }
    })
  }

  selectSavedReplyMessage(item:any){
    this.TypedMessage = item.replyMessage
    this.savedtemplate()
  }

  savedtemplate(){
    this.savedRepliesPopup = !this.savedRepliesPopup;
    // this.popshowminimize = true;
    this.createdsavedRepliesItem = false;
    this.emojimessagebox = false;
    this.productboxmsg = false;
    this.editSavedReplies = true;
    this.savedReplayForm.reset();
  }

  savedRepliesNewCreate(){
    this.createdsavedRepliesItem = !this.createdsavedRepliesItem;
    this.editSavedReplies = true;
    this.savedRepliesPopup = false;
    this.productboxmsg = false;
    this.emojimessagebox = false;
  }

  /*------------------------SavedReplies Section End----------------------------*/

  quoteClose(){
    this.selectedQuoteItem = undefined;
    this.newCloseQuote.emit('quoteClose');
  }

  messageTypeKeyDown(){
    if(this.ActiveUserChatDetail){
      const data:any ={};
      if(this.ActiveUserChatDetail.messageBox == true){
        data.chatroom_id = this.ActiveUserChatDetail._id
        this._SharedService.emit("user_typing",data)
      }else if(this.ActiveUserChatDetail.replyBox == true){
        //replymessage typing event call karvi
      }else if(this.ActiveUserChatDetail.tabType == 'updates' || this.ActiveUserChatDetail.tabType == 'discussions'){
        data.channelId = this.ActiveUserChatDetail._id
        data.messageFor = this.ActiveUserChatDetail?.tabType
        this._SharedService.emit("channelMessageTyping",data)
      }else if(this.ActiveUserChatDetail.channelReplyBox == true){
        data.messageId = this.ActiveUserChatDetail._id
        data.channelId = this.ActiveUserChatDetail.channelId
        data.messagefor = this.ActiveUserChatDetail.messageFor
        this._SharedService.emit("channelReplyMessageTyping",data)
      }
      this.typeMessagesubject.next(data);
    }
  }

  emojiopen(){
    this.createdsavedRepliesItem = false;
    this.savedRepliesPopup = false;
    this.productboxmsg = false;
    this.emojimessagebox = !this.emojimessagebox;
  }

  addEmoji(event:any) {
    const { TypedMessage } = this;
    const text = `${TypedMessage}${event.emoji.native}`;
    this.TypedMessage = text;
    this.emojimessagebox = false;
  }

  async onDocFileSelected(event:any){
    this.textArea.nativeElement.focus();
    if(event.target.files.length + this.selectedDocFile.length <=10 ){
      for (let i = 0; i < event.target.files.length; i++) {
        await this.selectedDocFile.push({
          fileName:event.target.files[i]?.name,
          type:event.target.files[i]?.name.split('.').pop(),
          size:event.target.files[i]?.size,
          file:event.target.files[i]
        });
        // this.cdr.detectChanges()
        await this.newCloseQuote.emit('quoteClose');
      }
    }else{
      this._SharedService.errorToast("only select 10 docs Files")
    }
  }

  async onImageFileSelected(event:any){
    this.textArea.nativeElement.focus();
    if(event.target.files.length + this.selectedImageFile.length <=10 ){
      for (let i = 0; i < event.target.files.length; i++) {
        await this.selectedImageFile.push({
          fileName:event.target.files[i]?.name,
          type:event.target.files[i]?.name.split('.').pop(),
          size:event.target.files[i]?.size,
          file:event.target.files[i]
        })
        // this.cdr.detectChanges()
        const reader = new FileReader();
        await reader.readAsDataURL(event.target.files[i]);
        reader.onload = async (e:any) =>  {
          await this.previewSelectedImage.push({image:reader.result?.toString()})
          // this.cdr.detectChanges()
        }
        this.newCloseQuote.emit('quoteClose'); 
      }
    }else{
      this._SharedService.errorToast("only select 10 Image Files")
    }
  }

  onImageRemove(index:any){
    this.previewSelectedImage.splice(index,1);
    this.selectedImageFile.splice(index,1);
    this.newCloseQuote.emit('quoteClose');
  }

  removeSelectedDocFile(index:any){
    this.selectedDocFile.splice(index,1);
    this.newCloseQuote.emit('quoteClose');
  }

  productlist(){
    this.productboxmsg =!this.productboxmsg ;
    this.emojimessagebox = false;
    this.createdsavedRepliesItem = false;
    this.savedRepliesPopup = false;
  }

  SearchProduct(){
    this.searchproductsubject.next(this.SearchedProductName);
  }

  getProducts(productsearchTextValue:any){
    if(productsearchTextValue.trim() != ''){
      this.productsearchdata = [];
      const data = {
        pattern:productsearchTextValue.trim()
      };
      this._MinimizepopService.getProductList(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.productsearchdata = res.data
          if(this.productsearchdata.length === 0) this.isSearchedProductAvail = true;
        }
        if(res.status == 500){
          this._SharedService.errorToast(res.message)
        }
        if(res.status == 401){
          this._SharedService.errorToast(res.message)
        }
      });
    };
  };

  Selectproduct(item:any){
    this.clickCount++;
    setTimeout(() => {
      if (this.clickCount === 1) {
        // single
        this.selectedProductId = item._id
      } else if (this.clickCount === 2) {
        // double
        this.selectedProductId = item._id
        this.productsend()
      }
      this.clickCount = 0;
    }, 250)
  }

  productcancel(){
    this.productboxmsg = false;
    this.emojimessagebox = false;
    this.createdsavedRepliesItem = false;
    this.savedRepliesPopup = false;
    this.isSearchedProductAvail = false;
  }

 async productsend(){
    if(this.selectedProductId !== undefined){
      this.FinalSelectedProductId = this.selectedProductId
    }
    if(this.ActiveUserChatDetail?.messageBox == true){
      let SendMessageDetail = {
        receiverId : this.ActiveUserChatDetail.user_details._id,
        message: this.TypedMessage.trim() == ''? undefined : this.TypedMessage.trim(),
        productId:this.FinalSelectedProductId,
        Images:[],
        Documents:[],
        quotesMessageId:null
      }
      this.sendNewMessageEmitEvent(SendMessageDetail)
    }else if(this.ActiveUserChatDetail?.tabType == 'updates' || this.ActiveUserChatDetail?.tabType == 'discussions'){
      let sendNewChannelMsgDetail = {
        channelId:this.ActiveUserChatDetail?._id,
        message: this.TypedMessage.trim() == ''? undefined : this.TypedMessage.trim(),
        messageFor:this.ActiveUserChatDetail?.tabType,
        Images:[],
        Documents:[],
        productId:this.FinalSelectedProductId,
        quotesMessageId:null
      }
      this.sendNewChannelMessageEmitEvent(sendNewChannelMsgDetail)
    }
    
  }

  //----------new message in messages start ------------
  sendNewMessage(){
    if(this.spinnerShow == false){
      if(this.selectedImageFile.length !== 0 || this.selectedDocFile.length !== 0){
        const ImageDocSizeArray:any = []
        this.selectedImageFile.forEach((ele:any) =>ImageDocSizeArray.push(ele.size) )
        this.selectedDocFile.forEach((ele:any) =>ImageDocSizeArray.push(ele.size) )

        const totalDataSize = ImageDocSizeArray.reduce((preVal:any, cVal:any) => preVal + cVal,0);
        if(totalDataSize/Math.pow(1024,2) <=10){
          for(let item of this.selectedImageFile){
            this.formDataMessages.append('images',item.file);
          }
          for(let item of this.selectedDocFile){
            this.formDataMessages.append('documents',item.file);
          }
          this.uploadImagesAndDocuments()
        }else{
          this._SharedService.InfoToast("Please Send Upto 10MB Media")
        }  
      }else{
        let SendMessageDetail = {
          receiverId : this.ActiveUserChatDetail?.user_details?._id,
          message: this.TypedMessage.trim() == ''? undefined : this.TypedMessage.trim(),
          Images:this.selectedImageFile,
          Documents:this.selectedDocFile,
          productId:this.FinalSelectedProductId,
          quotesMessageId:this.selectedQuoteItem?._id === undefined?null:this.selectedQuoteItem._id
        }
        this.sendNewMessageEmitEvent(SendMessageDetail)
      }
    } else{
      this._SharedService.InfoToast("please Wait some Time.")
    } 
  }

  uploadImagesAndDocuments(){
    this.spinnerShow = true;
    this.formDataMessages.append('For','message');
    this._MessagechatService.uploadMedia(this.formDataMessages).subscribe((res:any)=>{
      if(res.status == 200){
        this.formDataDeleteFunc()
        let SendMessageDetail = {
          receiverId : this.ActiveUserChatDetail?.user_details?._id,
          message: this.TypedMessage.trim() == ''? undefined : this.TypedMessage.trim(),
          Images:res.Images ?? [],
          Documents:res.Documents ?? [],
          productId:this.FinalSelectedProductId,
          quotesMessageId:this.selectedQuoteItem?._id === undefined?null:this.selectedQuoteItem._id
        }
        this.sendNewMessageEmitEvent(SendMessageDetail)
      }else{
        this.spinnerShow = false;
        this.formDataDeleteFunc();
        this._SharedService.errorToast(res.message)
      }
    })
  }

  sendNewMessageEmitEvent(params:any){
    if(this.ActiveUserChatDetail?.user_details?._id !== undefined){
      if(params.quotesMessageId == null){
        if(params.Images.length !== 0 || params.Documents.length !== 0 || params.productId !== undefined){
          this._SharedService.emit('newMessage', params);
        }else if(this.TypedMessage.trim() != '' && this.TypedMessage != undefined){
          this._SharedService.emit('newMessage', params);
        }else{
          this._SharedService.errorToast("Please Type Some Text")
        }       
      }else if(this.TypedMessage.trim() != '' && this.TypedMessage != undefined){
        this._SharedService.emit('newMessage', params);
      }else{
        this._SharedService.errorToast("Please Type Some Text")
      } 
    }else{
      this._SharedService.errorToast("Please Select UserName")
    }
  }
  //----------new message in messages end --------------

  //----------replymessage in messages start ------------
  sendReplyMessage(){
    if(this.spinnerShow == false){
      if(this.selectedImageFile.length !== 0 || this.selectedDocFile.length !== 0){
        const ImageDocSizeArray:any = []
        this.selectedImageFile.forEach((ele:any) =>ImageDocSizeArray.push(ele.size) )
        this.selectedDocFile.forEach((ele:any) =>ImageDocSizeArray.push(ele.size) )

        const totalDataSize = ImageDocSizeArray.reduce((preVal:any, cVal:any) => preVal + cVal,0);
        if(totalDataSize/Math.pow(1024,2) <=10){
          for(let item of this.selectedImageFile){
            this.formDataMessages.append('images',item.file);
          }
          for(let item of this.selectedDocFile){
            this.formDataMessages.append('documents',item.file);
          }
          this.uploadReplyImagesAndDocuments()
        }else{
          this._SharedService.InfoToast("Please Send Upto 10MB Media")
        }  
      }else{
        let replyMessageData = {
          messageId : this.ActiveUserChatDetail._id,
          messageReply: this.TypedMessage.trim() == ''? undefined : this.TypedMessage.trim(),
          Images:this.selectedImageFile,
          Documents:this.selectedDocFile,
          // productId:this.FinalSelectedProductId
        }
        this.sendReplyNewMessageEmitEvent(replyMessageData)
      }
    }else{
      this._SharedService.InfoToast("please Wait some Time.")
    } 
  }

  uploadReplyImagesAndDocuments(){
    this.spinnerShow = true;
    this.formDataMessages.append('For','message');
    this._MessagechatService.uploadMedia(this.formDataMessages).subscribe((res:any)=>{
      if(res.status == 200){
        this.formDataDeleteFunc()
        let replyMessageData = {
          messageId : this.ActiveUserChatDetail._id,
          messageReply: this.TypedMessage.trim() == ''? undefined : this.TypedMessage.trim(),
          Images:res.Images ?? [],
          Documents:res.Documents ?? [],
          // productId:this.FinalSelectedProductId
        }
      this.sendReplyNewMessageEmitEvent(replyMessageData)
      }else{
        this.spinnerShow = false;
        this.formDataDeleteFunc();
        this._SharedService.errorToast(res.message)
      }
    })
  }

  sendReplyNewMessageEmitEvent(params:any){
    if(this.ActiveUserChatDetail?._id !== undefined){
      if(params.Images.length !== 0 || params.Documents.length !== 0){
        this._SharedService.emit('replyMessage', params);
      }else if(this.TypedMessage.trim() != '' && this.TypedMessage != undefined){
        this._SharedService.emit('replyMessage', params);
      }else{
        this._SharedService.errorToast("Please Type Some Text")
      } 
    }else{
     this._SharedService.errorToast("Please Select UserName")
    }
  }

  //----------replymessage in messages end ------------

  //----------send updates & Discussion for private and public newmessage  start ------------
  sendNewChannelMessage(){
    if(this.spinnerShow == false){
      if(this.selectedImageFile.length !== 0 || this.selectedDocFile.length !== 0){
        const ImageDocSizeArray:any = []
        this.selectedImageFile.forEach((ele:any) =>ImageDocSizeArray.push(ele.size) )
        this.selectedDocFile.forEach((ele:any) =>ImageDocSizeArray.push(ele.size) )

        const totalDataSize = ImageDocSizeArray.reduce((preVal:any, cVal:any) => preVal + cVal,0);
        if(totalDataSize/Math.pow(1024,2) <=10){
          for(let item of this.selectedImageFile){
            this.formDataMessages.append('images',item.file);
          }
          for(let item of this.selectedDocFile){
            this.formDataMessages.append('documents',item.file);
          }
          this.uploadChannelImagesAndDocuments()
        }else{
          this._SharedService.InfoToast("Please Send Upto 10MB Media")
        }  
      }else{
        let sendNewChannelMsgDetail = {
          channelId:this.ActiveUserChatDetail?._id,
          message: this.TypedMessage.trim() == ''? undefined : this.TypedMessage.trim(),
          messageFor:this.ActiveUserChatDetail?.tabType,
          Images:this.selectedImageFile,
          Documents:this.selectedDocFile,
          productId:this.FinalSelectedProductId,
          quotesMessageId:this.selectedQuoteItem?._id === undefined?null:this.selectedQuoteItem._id
        }
        this.sendNewChannelMessageEmitEvent(sendNewChannelMsgDetail)
      }
  }else{
    this._SharedService.InfoToast("please Wait some Time.")
  }
  }

  uploadChannelImagesAndDocuments(){
    this.spinnerShow = true;
    this.formDataMessages.append('For','channel');
    this._MessagechatService.uploadMedia(this.formDataMessages).subscribe((res:any)=>{
      if(res.status == 200){
        this.formDataDeleteFunc()
        let sendNewChannelMsgDetail = {
          channelId:this.ActiveUserChatDetail?._id,
          message: this.TypedMessage.trim() == ''? undefined : this.TypedMessage.trim(),
          messageFor:this.ActiveUserChatDetail?.tabType,
          Images:res.Images ?? [],
          Documents:res.Documents ?? [],
          productId:this.FinalSelectedProductId,
          quotesMessageId:this.selectedQuoteItem?._id === undefined?null:this.selectedQuoteItem._id
        }
        this.sendNewChannelMessageEmitEvent(sendNewChannelMsgDetail)
      }else{
        this.spinnerShow = false;
        this.formDataDeleteFunc()
        this._SharedService.errorToast(res.message)
      }
    })
  }

  sendNewChannelMessageEmitEvent(params:any){ 
    if(this.ActiveUserChatDetail?._id !== undefined){
      if(params.quotesMessageId == null){
        if(params.Images.length !== 0 || params.Documents.length !== 0 || params.productId !== undefined){
          this._SharedService.emit('newChannelMessage', params);
        }else if(this.TypedMessage.trim() != '' && this.TypedMessage != undefined){
          this._SharedService.emit('newChannelMessage', params);
        }else{
          this._SharedService.errorToast("Please Type Some Text")
        }       
      }else if(this.TypedMessage.trim() != '' && this.TypedMessage != undefined){
        this._SharedService.emit('newChannelMessage', params);
      }else{
        this._SharedService.errorToast("Please Type Some Text")
      } 
    }else{
      this._SharedService.errorToast("Please Select UserName")
    }
  }
  //----------send updates & Discussion for private and public newmessage end ------------

  //----------send updates & Discussion for private and public replyMessage  start ------------
  sendNewChannelReplyMessage(){
    if(this.spinnerShow == false){
      if(this.selectedImageFile.length !== 0 || this.selectedDocFile.length !== 0){
        const ImageDocSizeArray:any = []
        this.selectedImageFile.forEach((ele:any) =>ImageDocSizeArray.push(ele.size) )
        this.selectedDocFile.forEach((ele:any) =>ImageDocSizeArray.push(ele.size) )

        const totalDataSize = ImageDocSizeArray.reduce((preVal:any, cVal:any) => preVal + cVal,0);
        if(totalDataSize/Math.pow(1024,2) <=10){
          for(let item of this.selectedImageFile){
            this.formDataMessages.append('images',item.file);
          }
          for(let item of this.selectedDocFile){
            this.formDataMessages.append('documents',item.file);
          }
          this.uploadChannelReplyImagesAndDocuments()
        }else{
          this._SharedService.InfoToast("Please Send Upto 10MB Media")
        }  
      }else{
        let sendNewChannelReplyMsgDetail = {
          messageId : this.ActiveUserChatDetail._id,
          message: this.TypedMessage.trim() == ''? undefined : this.TypedMessage.trim(),
          Images:this.selectedImageFile,
          Documents:this.selectedDocFile,
          // productId:this.FinalSelectedProductId,
          // quotesMessageId:this.selectedQuoteItem?._id === undefined?null:this.selectedQuoteItem._id
        }
        this.sendNewChannelReplyMessageEmitEvent(sendNewChannelReplyMsgDetail)
      }
    }
  }

  uploadChannelReplyImagesAndDocuments(){
    this.spinnerShow = true;
    this.formDataMessages.append('For','channel');
    this._MessagechatService.uploadMedia(this.formDataMessages).subscribe((res:any)=>{
      if(res.status == 200){
        this.formDataDeleteFunc()
        let sendNewChannelReplyMsgDetail = {
          messageId : this.ActiveUserChatDetail._id,
          message: this.TypedMessage.trim() == ''? undefined : this.TypedMessage.trim(),
          Images:res.Images ?? [],
          Documents:res.Documents ?? [],
        }
        this.sendNewChannelReplyMessageEmitEvent(sendNewChannelReplyMsgDetail)
      }else{
        this.spinnerShow = false;
        this.formDataDeleteFunc()
        this._SharedService.errorToast(res.message)
      }
    })
  }

  sendNewChannelReplyMessageEmitEvent(params:any){ 
    if(this.ActiveUserChatDetail?._id !== undefined){
      if(params.Images.length !== 0 || params.Documents.length !== 0){
        this._SharedService.emit('newChannelReplyMessage', params);
      }else if(this.TypedMessage.trim() != '' && this.TypedMessage != undefined){
        this._SharedService.emit('newChannelReplyMessage', params);
      }else{
        this._SharedService.errorToast("Please Type Some Text")
      } 
    }else{
     this._SharedService.errorToast("Please Select UserName")
    }
  }

  //----------send updates & Discussion for private and public replyMessage end ------------

  formDataDeleteFunc(){
    this.formDataMessages.delete("images")
    this.formDataMessages.delete("documents")
    this.formDataMessages.delete("For")
  }


  ngOnDestroy(){
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
    // localStorage.removeItem("ActiveUserChatDetail")
    this.enterkeylisten = false;
  }
}

