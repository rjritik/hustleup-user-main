import { Component, OnInit, OnDestroy, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { HomeService } from 'src/app/main/modules/home/home.service';
import { SharedService } from '../../shared.service';
import { RightmenuService } from './rightmenu.service';
import { getParamByISO } from 'iso-country-currency';
import { MessagechatService } from 'src/app/main/modules/message/messagechat.service'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Select2OptionData } from 'ng-select2';
declare var $:any;

@Component({
  selector: 'app-rightmenu',
  templateUrl: './rightmenu.component.html',
  styleUrls: ['./rightmenu.component.css']
})
export class RightmenuComponent implements OnInit,OnDestroy{
  navbarsub = true;
  shopCartIcon = true;
  loginmenu:boolean;
  cartProductCount:number = 0;
  IsUserNdInfluencer:boolean = false;
  profilePic:any;
  notificationList:any=[];
  pageNo:number = 1;
  totalPages:any;
  totalDocs:any;
  showNotiPopup:boolean = false;
  notificationIndex:number | undefined;
  slidebarToggle:boolean = false;
  slidebarToggleRight:boolean = false;
  msgSlidebarToggle:boolean = false;
  msgSlidebarToggleRight:boolean = false;
  selectedNotification:any;
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');

  currentUserUnsub$:Subscription;
  acceptOrRejectRequestUnsub$:Subscription;
  addMemberInChannelUnsub$:Subscription;
  navbarsubUnsub$:Subscription;
  GetCartListLengthUnsub$:Subscription;
  convertMemberTypeByAdminUnsub$:Subscription;
  removeMemberByAdminUnsub$:Subscription;
  createFollowNotificationEmitUnsub$:Subscription;
  createRemoveSelfDropNotificationEmitUnsub$:Subscription;
  subscriptions: Subscription[] = [];
  menuShowingResponsive:boolean = false;
  unreadCounter:number;
  ChatMemberList: any =[]; 
  public Reasons:any = Array<Select2OptionData>();

  constructor(
    private _AuthenticationService:AuthenticationService,
    private _router:Router,
    private _SharedService:SharedService,
    private _RightmenuService:RightmenuService,
    private _HomeService:HomeService,
    private _MessagechatService:MessagechatService,
    private sanitizer:DomSanitizer
  ){
    this.navbarsubUnsub$ = this._AuthenticationService.navbarsub.subscribe(res=>{
      // redirect to home if already logged in
      if(this._AuthenticationService.currentUserValue){
        this.loginmenu = false;
      }else{
        this.navbarsub = res;
        this.loginmenu = true;
      }
    });

    this.subscriptions.push(
      this._AuthenticationService.shopCartIcon.subscribe(res=>{
        this.shopCartIcon = res;
      },err=>{
        console.log(err,"err - shopCartIcon");
      })
    )
    
    this.GetCartListLengthUnsub$ = this._SharedService.GetCartListLength.subscribe((data:any)=>{
      this.cartProductCount = data;
    });
  }

  ngOnInit(): void {
    if (window.innerWidth < 992) {
      this.menuShowingResponsive = true;
    }
    this.currentUserUnsub$ = this._AuthenticationService.currentUser.subscribe((currentUserDetail:any)=>{
      if(currentUserDetail && currentUserDetail?.profilePic) this.profilePic = currentUserDetail.profilePic
    });
    if(this._AuthenticationService.isUser == true || this._AuthenticationService.isInfluencer == true){
      this.IsUserNdInfluencer = true;
    }else{
      this.IsUserNdInfluencer = false;
    }
    this.getNotificationList(this.pageNo)
    this.addMemberInChannelListen()
    this.acceptOrRejectRequestListen()
    this.convertMemberTypeByAdminListen()
    this.removeMemberByAdminListen()
    this.createFollowNotificationEmitListen()
    this.createRemoveSelfDropNotificationEmitListen()
    this.UnsubscribeMethods()

    this.subscriptions.push(
      this._SharedService.GetLeftSidebarMobile.subscribe(res=>{
        this.slidebarToggle = res;
      }),
      this._SharedService.getRightSidebarMobile.subscribe(res=>{
        this.slidebarToggleRight = res;    
      }),
    )

    this.Reasons = [
      {
        id: 'Ordered out of excitement and realised its of no need',
        text: 'Ordered out of excitement and realised its of no need'
      },
      {
        id: 'Recipient not available at the estimated time/day of delivery',
        text: 'Recipient not available at the estimated time/day of delivery'
      },
      {
        id: 'Found the same product on another website or a shop at a lower price',
        text: 'Found the same product on another website or a shop at a lower price'
      },
      {
        id: 'Changed my mind and opt for another product/brand instead',
        text: 'Changed my mind and opt for another product/brand instead'
      },
      {
        id: 'Product is taking too long to be delivered',
        text: 'Product is taking too long to be delivered'
      },
      {
        id: 'My reason is not listed above',
        text: 'My reason is not listed above'
      },
    ]
  }

  ReturnForm: any = new FormGroup({
    reasontype: new FormControl('', [Validators.required]),
    comment: new FormControl(undefined, [Validators.required])
  });

  get f() {
    return this.ReturnForm;
  }

  openNotificationPopup(){
    this.showNotiPopup = !this.showNotiPopup
    if(this.showNotiPopup && this.unreadCounter){
      this._RightmenuService.readNotifications().subscribe((res:any)=>{
        if(res.status == 200){
          this.unreadCounter = 0;
        }
      },err=>{
        console.log(err,"readNotifications - error")
      });
    }
  }

  onClickedNotiPupupOutside(e: Event) {
    if(this.showNotiPopup == true){
      this.showNotiPopup = false;
    }
  }

  addMemberInChannelListen(){
    this.addMemberInChannelUnsub$ = this._SharedService.listen("addMemberInChannelEmit").subscribe((res:any)=>{
      if(res.status == 200){
        if(this._AuthenticationService.currentUserValue.username == res.data.receiverUserDetail.username){
          this.pageNo = 1
          this.getNotificationList(this.pageNo);
          //receiver mate notification data push
        }
      }
    });
  };

  acceptOrRejectRequestListen(){
    this.acceptOrRejectRequestUnsub$= this._SharedService.listen("acceptOrRejectRequestEmit").subscribe((res:any)=>{
      if(res.status == 200){
        if(this._AuthenticationService.currentUserValue.username == res.data.senderUserDetail.username){ // sender request accept or reject kare tyare splice karavavu
          this.notificationList.splice(this.notificationIndex,1);
          this._SharedService.successToast(res.message);
        }
      }else if(res.status == 500 || res.status == 404){
        this._SharedService.errorToast(res.message);
      }
    });
  };

  convertMemberTypeByAdminListen(){
    this.convertMemberTypeByAdminUnsub$= this._SharedService.listen("convertMemberTypeByAdminEmit").subscribe((res:any)=>{
      if(res.status == 200 && this._AuthenticationService.currentUserValue.username == res.data.receiverUserDetail.username){//receiver member notification mate
        this.pageNo = 1;
        this.getNotificationList(this.pageNo)
      }
    })
  }

  removeMemberByAdminListen(){
    this.removeMemberByAdminUnsub$= this._SharedService.listen("removeMemberByAdminEmit").subscribe((res:any)=>{
      if(res.status === 200  && this._AuthenticationService.currentUserValue.username == res.data.receiverUserDetail.username) {// receiver mate notification update karvi
        this.pageNo = 1;
        this.getNotificationList(this.pageNo)
      }
    })
  }

  createFollowNotificationEmitListen(){
    this.createFollowNotificationEmitUnsub$= this._SharedService.listen("create-follow-notification-emit").subscribe((res:any)=>{
      if(res.status === 201  && this._AuthenticationService.currentUserValue.username == res.data.receiverUserDetail.username) {// receiver mate notification update karvi
        if(this.showNotiPopup == true){
          this.pageNo = 1;
          this.getNotificationList(this.pageNo);
        }
      }else {
        this._SharedService.errorToast(res.message);
      }
    })
  }

  createRemoveSelfDropNotificationEmitListen(){
    this.createRemoveSelfDropNotificationEmitUnsub$= this._SharedService.listen("create-remove-self-drop-notification-emit").subscribe((res:any)=>{
      console.log(res,"create-remove-self-drop-notification-emit")
      if((res.status === 201 || res.status === 200 ) && this._AuthenticationService.currentUserValue.username == res.data.receiverUserDetail.username) {// receiver mate notification update karvi
        if(this.showNotiPopup == true){
          this.pageNo = 1;
          this.getNotificationList(this.pageNo);
        }
      }else{
        this._SharedService.errorToast(res.message)
      }
    })
  }

  UnsubscribeMethods(){
    this.subscriptions.push(this.currentUserUnsub$);
    this.subscriptions.push(this.acceptOrRejectRequestUnsub$);
    this.subscriptions.push(this.navbarsubUnsub$);
    this.subscriptions.push(this.GetCartListLengthUnsub$);
    this.subscriptions.push(this.addMemberInChannelUnsub$);
    this.subscriptions.push(this.convertMemberTypeByAdminUnsub$);
    this.subscriptions.push(this.removeMemberByAdminUnsub$);
    this.subscriptions.push(this.createFollowNotificationEmitUnsub$);
    this.subscriptions.push(this.createRemoveSelfDropNotificationEmitUnsub$);
  }

  getNotificationList(pageno:any){
    const data={
      page:pageno,
      limit:10
    }
    this._RightmenuService.notificationlist(data).subscribe((res:any) =>{
      console.log(res,"res")
      if(res.status === 200){
        this.totalPages = res.data.totalPages;
        this.totalDocs = res.data.totalDocs;
        this.unreadCounter = res.unreadCount;
        if(this.pageNo === 1){
          this.notificationList = res.data.docs; 
        }else{
          this.notificationList = [...this.notificationList,...res.data.docs]
        }
      }
    })
  }

  acceptRequest(item:any,index:any){
    this.notificationIndex = index;

    const data = {
      channelId:item.channelMemberReq._id,
      isAccepted:true
    }
    this._SharedService.emit("acceptOrReject",data)
  }

  rejectRequest(item:any,index:any){
    this.notificationIndex = index;
    const data = {
      channelId:item.channelMemberReq._id,
      isAccepted:false
    }
    this._SharedService.emit("acceptOrReject",data)
  }

  shoppincartopen(){
    const data = {
      cartIconClick:true
    }
    this._SharedService.setCartSideBarOpen(data);
  }

  logout(){
    this._AuthenticationService.logout();
    this._SharedService.emit("logout","disconnetmethod")
    this._router.navigate(['/accounts/login']);
  }

  leftSliderBar(){
    this.slidebarToggle = !this.slidebarToggle;
    this._SharedService.GetLeftSidebar(this.slidebarToggle);
  }

  rightSliderBar(){
    this.slidebarToggleRight = !this.slidebarToggleRight;
    this._SharedService.getRightSidebar(this.slidebarToggleRight);
  }
  
  messagesLeftSliderBar(){
    this.msgSlidebarToggle = !this.msgSlidebarToggle;
    this._SharedService.GetLeftSidebar(this.msgSlidebarToggle);
  }

  messagesRightSliderBar(){
    this.msgSlidebarToggleRight = !this.msgSlidebarToggleRight;
    this._SharedService.getRightSidebar(this.msgSlidebarToggleRight);
  }

  followUnfollowUser(e:any){
    const data = {
      userId: e._id,
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

  openSelfDropRequest(item:any,index:number){
    $("#selfDropConfirmModal").modal("show");
    $('body').css({
      'overflow-y': 'hidden',
    });
    $('.header').css({
      'position': 'static',
    });
    this.showNotiPopup = false;
    this.selectedNotification = item;
    this.notificationIndex = index;
  }

  rejectSelfDropRequest(item:any,index:number){
    $("#rejectSelfDropRequest").modal("show");
    $('body').css({
      'overflow-y': 'hidden',
    });
    $('.header').css({
      'position': 'static',
    });
    this.showNotiPopup = false;
    this.selectedNotification = item;
    this.notificationIndex = index;
  }

  cancelNotReceived(){
    $("#rejectSelfDropRequest").modal("hide");
    $('body').css({
      'overflow-y': 'auto',
    });
    $('.header').css({
      'position': 'sticky',
    });
  }

  confirmSelfDropRequest(){
    const data = {
      notificationId: this.selectedNotification._id,
      reqType: "accept"
    }
    this._RightmenuService.acceptOrCancelSelfDropReq(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.notificationList.splice(this.notificationIndex,1);
        this._SharedService.successToast(res.message);
        $("#selfDropConfirmModal").modal("hide");
      }else{
        this._SharedService.errorToast(res.message);
        $("#selfDropConfirmModal").modal("hide");
      }
    })
  }

  requestForNotReceived(f:any){
    if(f.valid){
      const data = {
        notificationId: this.selectedNotification._id,
        reqType: "cancel",
        cancellationReason:this.sanitizer.sanitize(SecurityContext.HTML, f.value.reasontype),
        cancellationComment:this.sanitizer.sanitize(SecurityContext.HTML, f.value.comment)
      }
      this._RightmenuService.acceptOrCancelSelfDropReq(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.notificationList.splice(this.notificationIndex,1);
          this._SharedService.successToast(res.message);
          $("#rejectSelfDropRequest").modal("hide");
        }else{
          this._SharedService.errorToast(res.message);
          $("#rejectSelfDropRequest").modal("hide");
        }
      })
    }else{
      this.ReturnForm.markAllAsTouched();
    }
  }

  cancelSelfDropRequest(){
    $("#selfDropConfirmModal").modal("hide");
    $('body').css({
      'overflow-y': 'auto',
    });
    $('.header').css({
      'position': 'sticky',
    });
    this.selectedNotification = undefined;
    this.notificationIndex = undefined;
  }

  getAllChatMembers(){
    const data = {
      pattern:"messages"
    }
    this._MessagechatService.getAllChatMembers(data).subscribe((res: any) => {
      if (res.status === 200) {
        this.ChatMemberList = res.data;
      }
    }, (err => {
      console.log(err, "err - data");
    }));
  }

  userchatdetails(item:any){      
    this._router.navigate(['/message/messages'], { queryParams: { auid: item._id } });
  }
  
  allMessageList(){
    this._router.navigate(['/message/messages']);
  }

  ngOnDestroy(){
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }
}