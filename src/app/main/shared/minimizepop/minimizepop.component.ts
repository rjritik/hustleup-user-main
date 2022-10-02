import { Component, OnInit,OnDestroy, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from '../shared.service';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime, first } from 'rxjs/operators';
import { MinimizepopService } from './minimizepop.service';
import { AuthenticationService } from '../../auth/service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessagechatService } from '../../modules/message/messagechat.service';
import { getParamByISO } from 'iso-country-currency';
declare var $:any;

@Component({
  selector: 'app-minimizepop',
  templateUrl: './minimizepop.component.html',
  styleUrls: ['./minimizepop.component.css']
})
export class MinimizepopComponent implements OnInit,OnDestroy{
  clickCount = 0;
  popshowmain:boolean = false;
  popshowminimize:boolean = false;
  emojimessagebox:boolean = false;
  productboxmsg:boolean = false;
  savedRepliesPopup:boolean = false;
  createdsavedRepliesItem:boolean = false;
  popshowsub:boolean = false;
  popshowminimizesub:boolean = false;
  popminiemojsub:boolean = false;
  showmenuicon:boolean = false;
  Replies:boolean = false;
  usermain:boolean = true;
  productboxmsgsub:boolean = false;
  newmessageadduser:boolean;
  newMessageBoxBoolean:boolean = false;
  selectedUserDetail:any;

  private searchusersubject: Subject<string> = new Subject();
  showuserdataboolean:boolean = false;
  SearchedUserName:any='';
  SearchedUserId:any;
  selecteduserdata:any;
  usersearchdata:any = [];

  private searchproductsubject: Subject<string> = new Subject();
  SearchedProductName:any='';
  productsearchdata:any=[];
  selectedProduct:any;
  FinalSelectedProductId:any;
  isSearchedProductAvail:boolean = false

  TypedMessage:any='';
  selectedDocFile:any=[]
  selectedImageFile:any=[];
  formDataMessages:any = new FormData();
  
  editSavedReplies:boolean = true;
  DeleteSavedReplies:any;
  UpdateSavedReplies:any;
  SavedRepliesList:any=[];
  previewSelectedImage:any=[];

  searchusersubjectUnsubscribe$: Subscription;
  searchproductsubjectUnsubscribe$: Subscription; 
  getminipopUnsubscribe$: Subscription; 
  getUserDetailUnsubscribe$: Subscription; 
  sendMessageUnsubscribe$: Subscription; 
  subscriptions: Subscription[] = []
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');
  
  constructor(private _SharedService: SharedService,
              private _MinimizepopService:MinimizepopService,
              private _AuthenticationService:AuthenticationService,
              private spinner:NgxSpinnerService,
              private _MessagechatService:MessagechatService,
              private sanitizer:DomSanitizer) {
    this.GetObservables()
  }

  ngOnInit(): void{
    this.GetAllSavedRepliesMessages()
    this.DebounceMethods()
    this.SendMessageEventListen()
    this.UnsubscribeMethod()
  }

  DebounceMethods(){
    this.searchusersubjectUnsubscribe$ = this.searchusersubject.pipe(debounceTime(500)).subscribe((searchTextValue:any) => {
      this.getUsers(searchTextValue);
    });
    this.searchproductsubjectUnsubscribe$ = this.searchproductsubject.pipe(debounceTime(500)).subscribe((productsearchTextValue:any) => {
      this.getProducts(productsearchTextValue);
   });
  }

  GetObservables(){
    this.getminipopUnsubscribe$ = this._SharedService.getminipop().subscribe(m=>{
      if (m['text'] == 'truenew'){ 
        this.popshowmain = true;
        this.popshowminimize = false;
        this.newmessageadduser = true;
        this.newMessageBoxBoolean = false;
        this.SearchedUserId = undefined;
        this.SearchedUserName = '';
      }
      else if (m['text'] == 'minimizesub'){
        this.popshowsub = true;
        this.popshowminimizesub = false;
        this.newmessageadduser = false;
        this.newMessageBoxBoolean = false;
      }else{
        console.log("minimizepop & sub",m);
      }
    })

    this.getUserDetailUnsubscribe$ = this._SharedService.getUserDetail().subscribe((res:any)=>{
      if(res.text = "createNewMsgBox"){
        this.selectedUserDetail = res.userdetail;
        this.SearchedUserId = res.userdetail._id;
        this.SearchedUserName = res.userdetail.username;
        this.popshowmain = true;
        this.popshowminimize = false;
        this.newmessageadduser = false;
        this.newMessageBoxBoolean = true;
      }
    })
  }
  SendMessageEventListen(){
    this.sendMessageUnsubscribe$ = this._SharedService.listen('sendMessage').subscribe(async (res:any) => {
      this.spinner.hide();
      this.closepop();
    });
  }

  UnsubscribeMethod(){
    this.subscriptions.push(this.searchusersubjectUnsubscribe$)
    this.subscriptions.push(this.searchproductsubjectUnsubscribe$)
    this.subscriptions.push(this.getminipopUnsubscribe$)
    this.subscriptions.push(this.getUserDetailUnsubscribe$)
    this.subscriptions.push(this.sendMessageUnsubscribe$)
  }

  /* ------------------------SavedReplies Section Start---------------------------- */

  savedReplayForm:any = new FormGroup({
    replytitle: new FormControl(undefined,[Validators.required]),
    replymsg: new FormControl(undefined,[Validators.required]),
  });
  get f(){
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
          const index = this.SavedRepliesList.findIndex((element:any)=> element._id == this.UpdateSavedReplies._id)
          this.SavedRepliesList[index].replyTitle = f.value.replytitle
          this.SavedRepliesList[index].replyMessage = f.value.replymsg
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

  SearchUser(){
    if(this.SearchedUserName !== ''){
      this.searchusersubject.next(this.SearchedUserName);
    }
    if(this.SearchedUserName == ''){
      this.SearchedUserId = undefined
      this.SearchedUserName =''
    }
      
  }

  getUsers(searchTextValue:any){
    if(searchTextValue.trim() != ''){
      this.usersearchdata = []
      const data = {
        pattern:searchTextValue.trim(),
        forMessage :"forMessage"
      };
      this._MinimizepopService.getUsersList(data).subscribe((res:any)=>{
        if(res.status === 200){
          this.showuserdataboolean = true;
          res.data.map((item:any)=>{
            if(item.username.includes(this._AuthenticationService.currentUserValue.username)){

            }else{
              this.usersearchdata.push(item);
            }
          })
          // this.usersearchdata = res.data
        }else{
          this._SharedService.errorToast(res.massage)
        }
      });
    };
  };

  adduserdata(item:any){
    this.SearchedUserName = item.username
    this.SearchedUserId = item._id
    this.showuserdataboolean = false;
    this.selecteduserdata = item
  }
  onDocFileSelected(event:any) {
    if(event.target.files.length + this.selectedDocFile.length <=10 ){
      for (let i = 0; i < event.target.files.length; i++) {
        this.selectedDocFile.push({
          fileName:event.target.files[i]?.name,
          type:event.target.files[i]?.name.split('.').pop(),
          size:event.target.files[i]?.size,
          file:event.target.files[i]
        })
      }
    }else{
      this._SharedService.errorToast("only select 10 docs Files")
    }
  }

  removeSelectedDocFile(index:any){
    this.selectedDocFile.splice(index,1)
  }

  onImageFileSelected(event:any) {
    if(event.target.files.length + this.selectedImageFile.length <=10 ){
      for (let i = 0; i < event.target.files.length; i++) {
        this.selectedImageFile.push({
          fileName:event.target.files[i]?.name,
          type:event.target.files[i]?.name.split('.').pop(),
          size:event.target.files[i]?.size,
          file:event.target.files[i]
        })
        
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload = e =>  this.previewSelectedImage.push({image:reader.result?.toString()})
      }
    }else{
      this._SharedService.errorToast("only select 10 Images")
    }
    
  }

  msgpop(index:any){
    this.previewSelectedImage.splice(index,1);
    this.selectedImageFile.splice(index,1);
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
      if (this.clickCount === 1){
        // single
        this.selectedProduct = item
      } else if (this.clickCount === 2) {
        // double
        this.selectedProduct = item
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
    this.productsearchdata = [];
    this.SearchedProductName = '';
    this.isSearchedProductAvail = false;
  }
  productsend(){
    if(this.selectedProduct != 0){
      this.FinalSelectedProductId = this.selectedProduct._id
      this.productcancel()
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

  sendMessage(){
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
      const SendMessageDetail = {
        receiverId : this.SearchedUserId,
        message:this.TypedMessage.trim() == ''? undefined : this.TypedMessage.trim(),
        Images:this.selectedImageFile,
        Documents:this.selectedDocFile,
        productId:this.FinalSelectedProductId,
      }
      this.sendNewMessageEmitEvent(SendMessageDetail)
    }  
  }

  uploadImagesAndDocuments(){
    this.spinner.show();
    this._MessagechatService.uploadMedia(this.formDataMessages).subscribe((res:any)=>{
      if(res.status == 200){
        this.formDataMessages.delete("images")
        this.formDataMessages.delete("documents")
        const SendMessageDetail = {
          receiverId : this.SearchedUserId,
          message:this.TypedMessage.trim() == ''? undefined : this.TypedMessage.trim(),
          Images:res.Images,
          Documents:res.Documents,
          productId:this.FinalSelectedProductId,
        }
        this.sendNewMessageEmitEvent(SendMessageDetail)
      }else{
        this.formDataMessages.delete("images")
        this.formDataMessages.delete("documents")
        this._SharedService.errorToast(res.message)
      }
    })
  }

  sendNewMessageEmitEvent(params:any){
    if(this.SearchedUserId !== undefined && this.SearchedUserName !==''){
      if(params.Images.length !== 0 || params.Documents.length !== 0 || params.productId !== undefined){
        this._SharedService.emit('newMessage', params);
      }else if(this.TypedMessage.trim() != '' && this.TypedMessage != undefined){
        this._SharedService.emit('newMessage', params);
      }else{
        this._SharedService.errorToast("Please Type Some Text")
      }       
    }else{
      this._SharedService.errorToast("Please Select UserName")
    }
  }


  minimizepop(){
    this.popshowminimize = !this.popshowminimize; 
  }
  
  popshowminsub(){
    this.popshowminimizesub = !this.popshowminimizesub;
    this.popminiemojsub = false;
  }

  popshowminclosesub(){
    this.popshowsub = false;
    this.popshowminimizesub = false;
    this.popminiemojsub = false;
  }

  closepop(){
    this.popshowminimize = false;
    this.popshowmain = false;
    this.productboxmsg = false;
    this.emojimessagebox = false;
    this.createdsavedRepliesItem = false;
    this.SearchedUserName = "";
    this.SearchedUserId = undefined;
    this.TypedMessage = "";
    this.selectedImageFile = [];
    this.previewSelectedImage = [];
    this.selectedDocFile = [];
    this.FinalSelectedProductId = undefined;
    this.selectedProduct = undefined;
    this._SharedService.SetclearSearchedCM('')
  }

  popminisubemoji(){
    this.popminiemojsub = !this.popminiemojsub;
  }

  showmenuiconsub(){
    this.showmenuicon = !this.showmenuicon;
  }

  chatmsgreplies(){
    this.Replies = true;
    this.usermain = false;
  }
  repliesback(){
    this.Replies = false;
    this.usermain = true;
    this.popshowminimizesub = true;
  }

  productlistsub(){
    this.productboxmsgsub = !this.productboxmsgsub;
  }

  ngOnDestroy(){
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }
}
