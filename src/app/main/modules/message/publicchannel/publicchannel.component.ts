import { Component, OnInit,OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/main/auth/service';
import { CreatechannelService } from 'src/app/main/shared/channelcreatebox/createchannel.service';
import { MinimizepopService } from 'src/app/main/shared/minimizepop/minimizepop.service';
import { SharedService } from 'src/app/main/shared/shared.service';
declare var $:any;

@Component({
  selector: 'app-publicchannel',
  templateUrl: './publicchannel.component.html',
  styleUrls: ['./publicchannel.component.css']
})
export class PublicchannelComponent implements OnInit,OnDestroy {
  @ViewChild('heightBottomMsgDiv') heightBottomMsgDiv: ElementRef;
  primeTableHeight:number = 255 ;
  adduserdrop = false;
  channelbox = false;
  clickType:any='';
  channelDetail:any='';
  publicChannelList:any=[];
  pageNo:any=1;
  totalDocs:any;
  totalPages:any;
  activeChannelChatDetail:any;
  activeChannelChatBoolean = false;
  tabType:any = "discussions";
  activeChannelTabDetail:any;
  isMemberOfChannel:boolean = false;

  // ---------channelMember section start------------
  memberListPopup:boolean = false;
  listType:any='';
  membersList:any=[];
  memberPageNo:number = 1;
  memberTotalDocs:any;
  memberTotalPages:any;
  notificationSettingPopup = false;
  memberPattern:any='';
  // ---------channelMember section end------------

  // ---------searchchannel section start------------
  private channelSubject: Subject<string> = new Subject();
  searchChannelName:any="";
  searchedPublicChannelList:any=[];
  searchPageNo:any=1;
  searchTotalDocs:any;
  searchTotalPages:any;
  // ---------searchchannel section end------------

  // ---------searchuser section start------------
  private searchusersubject: Subject<string> = new Subject();
  SearchedUserName:any='';
  usersearchdata:any = [];
  memberType:any;
  userDetailNotAvail:boolean = false;
  selectedUserItem:any;
  // ---------searchuser section end------------
  
  searchusersubjectUnsubscribe$: Subscription; 
  channelSubjectUnsubscribe$: Subscription;
  createChannelUnsub$: Subscription; 
  updateChannelUnsub$: Subscription; 
  addMemberInChannelUnsub$: Subscription; 
  acceptOrRejectRequestUnsub$: Subscription; 
  convertMemberTypeByAdminUnsub$: Subscription; 
  removeMemberByAdminUnsub$: Subscription; 
  leaveChannelUnsub$: Subscription; 
  newChannelMessageUnsub$: Subscription; 
  subscriptions: Subscription[] = []

  constructor(private _CreatechannelService:CreatechannelService,private _SharedService:SharedService,private _MinimizepopService:MinimizepopService,public _AuthenticationService:AuthenticationService,private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getPublicChannelList(this.pageNo);
    this.createChannelListen();
    this.updateChannelListen();
    this.addMemberInChannelListen();
    this.acceptOrRejectRequestListen();
    this.convertMemberTypeByAdminListen();
    this.removeMemberByAdminListen();
    this.leaveChannelListen();
    this.newChannelMessageListen();
    this.DebounceMethods();
    this.UnsubscribeMethod();
  }

  getPublicChannelList(pageno:any){
    this.searchedPublicChannelList=[]
    const data ={
      pattern:"public",
      page: pageno,
      limit: 25,
      search:''
    }
    this._CreatechannelService.getAllChannel(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.totalDocs = res.data.totalDocs
        this.totalPages = res.data.totalPages
          if(this.pageNo === 1){
            this.publicChannelList = res.data.docs  
          }else{
            this.publicChannelList = [...this.publicChannelList,...res.data.docs]
          }
        
        console.log(this.publicChannelList,"this.publicChannelList")
      }
    })
  }

  //------------------------event listen section start----------------------------------------

  createChannelListen(){
    this.createChannelUnsub$ = this._SharedService.listen("createChannelEmit").subscribe((res:any)=>{
      if(res.status === 201 && res.data.channelType == "public"){
        this.publicChannelList.push(res.data) 
      }
    });
  };

  updateChannelListen(){
    this.updateChannelUnsub$ = this._SharedService.listen("updateChannelEmit").subscribe((res:any)=>{
      if(res.status === 200 && (res.data.singlechannelDetail.channelType == "public" || res.data.singlechannelDetail.channelType == "signup")){
        const index = this.getPublicChannelIndex(res.data.singlechannelDetail._id);
        if(index !== -1) this.publicChannelList[index] = res.data.singlechannelDetail;
        if(this.activeChannelChatDetail && this.activeChannelChatDetail._id === res.data.singlechannelDetail._id) this.activeChannelChatDetail = res.data.singlechannelDetail;
      }else if(res.status === 200 && res.data.channelType == "private"){
        const index = this.getPublicChannelIndex(res.data.singlechannelDetail._id);
        if(index !== 1) this.publicChannelList.splice(index,1);
        if(this.activeChannelChatDetail && this.activeChannelChatDetail._id === res.data.singlechannelDetail._id){
          this.activeChannelChatBoolean = false;
          this.activeChannelChatDetail = undefined;
        } 
      }
    });
  };

  addMemberInChannelListen(){
    this.addMemberInChannelUnsub$ = this._SharedService.listen("addMemberInChannelEmit").subscribe((res:any)=>{
      if(res.status === 200){
        if(this.activeChannelChatDetail && this.activeChannelChatDetail._id == res.data.channelId){
          if(this.adduserdrop == true && this.usersearchdata.length > 0) {
            const index = this.usersearchdata.findIndex((ele:any) => {return ele._id == res.data.receiverUserDetail._id})
            if(this.memberType == "user" && index !== -1) this.usersearchdata[index].isUserExits = 'requested as user'
            if(this.memberType == "admin" && index !== -1) this.usersearchdata[index].isUserExits = 'requested as admin'
          }
        }
      }else if(res.status === 409 ||res.status === 500 || res.status === 401){
        this._SharedService.errorToast(res.message)
      }
    })
  };

  acceptOrRejectRequestListen(){
    this.acceptOrRejectRequestUnsub$= this._SharedService.listen("acceptOrRejectRequestEmit").subscribe((res:any)=>{
      if(res.status == 200 && (res.data.channelType =='public' || res.data.channelType =='signup')){ 
        if(this._AuthenticationService.currentUserValue.username !== res.data.senderUserDetail.username){ //other member in code run with include receiver
          if(this.activeChannelChatDetail && this.activeChannelChatDetail._id == res.data.channelId){ //other member with include receiver in channel active
            if(res.data.isAccepted == true){
              this.activeChannelChatDetail.totalMembers = res.data.totalMembers;
            }
            if(this.adduserdrop == true && this.usersearchdata.length > 0) {
              const index = this.usersearchdata.findIndex((ele:any) => {return ele._id == res.data.senderUserDetail._id})
              if(index !== -1 && res.data.isAccepted == false) this.usersearchdata[index].isUserExits = false;
              if(index !== -1  && res.data.isAccepted == true) this.usersearchdata.splice(index,1);
            }
          }else{// other member in channel not active
            if(res.data.isAccepted == true){
              const channelIndex = this.getPublicChannelIndex(res.data.channelId);
              if(channelIndex !== -1) {
                this.publicChannelList[channelIndex].totalMembers = res.data.totalMembers;
              }
            }
          }
        }else if(this._AuthenticationService.currentUserValue.username == res.data.senderUserDetail.username){ // login user mate
          const channelIndex = this.getPublicChannelIndex(res.data.channelId);
          if(channelIndex !== -1) {
            this.publicChannelList[channelIndex].totalMembers = res.data.totalMembers;
            this.publicChannelList[channelIndex].isAdmin = res.data.memberType == "admin"?true : false;
          }
        }
        if(res.data.isAccepted == true){ // sender request accept kare tyare sender and receiver ne api call thase
          this.getPublicChannelList(this.pageNo);
        }
      }
    });
  };

  convertMemberTypeByAdminListen(){
    this.convertMemberTypeByAdminUnsub$= this._SharedService.listen("convertMemberTypeByAdminEmit").subscribe((res:any)=>{
      if(res.status == 200){
        if(this._AuthenticationService.currentUserValue.username == res.data.senderUserDetail.username){// login member mate 
          if(this.activeChannelChatDetail && this.activeChannelChatDetail._id === res.data.createdNotiDetail.link_id){
            if(this.memberListPopup == true){
              const index = this.membersList.findIndex((ele:any) => {return ele.userDetail._id == res.data.receiverUserDetail._id});
              if(index !== -1){
                this.membersList[index].memberType = res.data.updatedMemberData.memberType;
                if(this._AuthenticationService.currentUserValue.username == res.data.receiverUserDetail.username){
                  this.activeChannelChatDetail.isAdmin = res.data.isAdmin;
                }
              }
            }
            this._SharedService.successToast(res.message);
          }
        }else{ // other member mate with include receiver
          const channelIndex = this.getPublicChannelIndex(res.data.createdNotiDetail.link_id);
          if(channelIndex !== -1) {
            if(this._AuthenticationService.currentUserValue.username == res.data.receiverUserDetail.username) this.publicChannelList[channelIndex].isAdmin = res.data.isAdmin;
            if(this.memberListPopup == true){
              if(this.activeChannelChatDetail && this.activeChannelChatDetail._id === res.data.createdNotiDetail.link_id) this.showMemberList();
            }
          }
        }
      }else if(res.status == 500 || res.status == 401){
        this._SharedService.errorToast(res.message);
      }
    });
  };

  removeMemberByAdminListen(){
    this.removeMemberByAdminUnsub$= this._SharedService.listen("removeMemberByAdminEmit").subscribe((res:any)=>{
      if(res.status === 200) {
        if(this._AuthenticationService.currentUserValue.username == res.data.senderUserDetail.username){// login member mate
          if(this.activeChannelChatDetail && this.activeChannelChatDetail._id == res.data.channelId){
            const memberIndex= this.membersList.findIndex((member:any) => {return member.userDetail._id == res.data.receiverUserDetail._id});
            if(memberIndex !== -1) this.membersList.splice(memberIndex, 1);
            this.activeChannelChatDetail.totalMembers = res.data.totalMembers;
          }
          this._SharedService.successToast(res.message);
        }else if(this._AuthenticationService.currentUserValue.username == res.data.receiverUserDetail.username){ // receiver mate etle je member ne remove kare che te
          const channelIndex = this.getPublicChannelIndex(res.data.channelId);
          if(channelIndex !== -1) this.publicChannelList.splice(channelIndex,1);
          if(this.activeChannelChatDetail && this.activeChannelChatDetail._id == res.data.channelId) this.activeChannelChatBoolean = false;
        }else{ // other member includes receiver
          const channelIndex = this.getPublicChannelIndex(res.data.channelId);
          if(channelIndex !== -1) this.publicChannelList[channelIndex].totalMembers = res.data.totalMembers;
          if(this.activeChannelChatDetail && this.activeChannelChatDetail._id == res.data.channelId) {
            if(this.memberListPopup == true){
              const memberIndex= this.membersList.findIndex((member:any) => {return member.userDetail._id == res.data.receiverUserDetail._id});
              if(memberIndex !== -1) {
                if(this._AuthenticationService.currentUserValue.username !== this.membersList[memberIndex].userDetail.username){
                  this.membersList.splice(memberIndex, 1);
                } 
              }
            }
          }
        }
      }else if(res.status === 401 || res.status === 500) {
        this._SharedService.errorToast(res.message);
      }
    });
  };

  leaveChannelListen(){
    this.leaveChannelUnsub$= this._SharedService.listen("leaveChannelEmit").subscribe((res:any)=>{
      if(res.status === 200){
        const channelIndex = this.getPublicChannelIndex(res.data.channelId);
        if(channelIndex !== -1){
          if(this._AuthenticationService.currentUserValue.username == res.data.senderUserDetail.username){// login member mate 
            this.publicChannelList.splice(channelIndex,1);
            this.activeChannelChatBoolean = false;
            $("#Remove-channel").modal("hide");
            this._SharedService.successToast(res.message);
          }else{
            this.publicChannelList[channelIndex].totalMembers = res.data.totalMembers
            if(this.activeChannelChatDetail && this.activeChannelChatDetail._id == res.data.channelId){
              this.activeChannelChatDetail.totalMembers = res.data.totalMembers
              if(this.memberListPopup == true){
                const memberIndex = this.membersList.findIndex((member:any) => {return member.userDetail._id == res.data.senderUserDetail._id});
                this.membersList.splice(memberIndex,1)
              }
            }
          }
        }
      }else if(res.status === 500 || res.status === 401){
        this._SharedService.errorToast(res.message);
      }
    });
  };

  newChannelMessageListen(){
    this.newChannelMessageUnsub$ = this._SharedService.listen('newChannelMessageEmit').subscribe(async (res:any) => {
      if(res.status == 201){
        if(this._AuthenticationService.currentUserValue.username !== res.data.senderUserDetail.username){ // all other member without sender
          if(this.activeChannelChatDetail?._id == res.data.createdMessageData.channelId){//active channel hoy
            if(this.tabType !== res.data.createdMessageData.messageFor){// active tab na hoy
              const channelIndex = this.getPublicChannelIndex(res.data.createdMessageData.channelId);
              if(channelIndex !== -1){
                if(res.data.createdMessageData.messageFor == 'updates'){
                  this.publicChannelList[channelIndex].updatesUnreadCount +=1; 
                }
                if(res.data.createdMessageData.messageFor == 'discussions'){
                  this.publicChannelList[channelIndex].discussionsUnreadCount += 1;
                }
              }
            }
          }else{//active channel no hoy
            const channelIndex = this.getPublicChannelIndex(res.data.createdMessageData.channelId);
            if(channelIndex !== -1){
              if(res.data.createdMessageData.messageFor == 'updates'){
                this.publicChannelList[channelIndex].updatesUnreadCount +=1 ;
              }
              if(res.data.createdMessageData.messageFor == 'discussions'){
                this.publicChannelList[channelIndex].discussionsUnreadCount += 1;
              }
            }
          }
        }
      }
    });
  };

  readChannelMessage(data:any){
    if(this.activeChannelChatDetail._id == data.channelId){
      if(data.messageFor == 'updates'){
        this.activeChannelChatDetail.updatesUnreadCount = 0
      }
      if(data.messageFor == 'discussions'){
        this.activeChannelChatDetail.discussionsUnreadCount = 0
      }
    }
  };

  UnsubscribeMethod(){
    this.subscriptions.push(this.createChannelUnsub$);
    this.subscriptions.push(this.updateChannelUnsub$);
    this.subscriptions.push(this.addMemberInChannelUnsub$);
    this.subscriptions.push(this.acceptOrRejectRequestUnsub$);
    this.subscriptions.push(this.convertMemberTypeByAdminUnsub$);
    this.subscriptions.push(this.removeMemberByAdminUnsub$);
    this.subscriptions.push(this.leaveChannelUnsub$);
    this.subscriptions.push(this.newChannelMessageUnsub$);
  }

  //------------------------event listen section end----------------------------------------

  searchChannel(){ 
    this.pageNo=1;
    this.searchPageNo=1;
    if(this.searchChannelName ==''){
      this.getPublicChannelList(this.pageNo);
    }else{
      this.channelSubject.next(this.searchChannelName);
    }
  };

  searchGetPublicList(pageno:any,searchvalue:any) {
    this.publicChannelList=[]
    const data ={
      pattern:"public",
      page: pageno,
      limit: 25,
      search:searchvalue
    }
    this._CreatechannelService.getAllChannel(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.searchTotalDocs = res.data.totalDocs;
        this.searchTotalPages = res.data.totalPages;
        if(this.searchPageNo === 1){
          this.searchedPublicChannelList = res.data.docs;  
        }else{
          this.searchedPublicChannelList = [...this.searchedPublicChannelList,...res.data.docs];
        }
      }else{
        this._SharedService.errorToast(res.message);
      }
    });
  };

  DebounceMethods(){
    this.searchusersubjectUnsubscribe$ = this.searchusersubject.pipe(debounceTime(500)).subscribe((searchTextValue:any) => {
      this.getUsersList(searchTextValue);
    });
    this.channelSubjectUnsubscribe$ = this.channelSubject.pipe(debounceTime(500)).subscribe((channelsearchTextValue:any) => {
      this.searchGetPublicList(this.searchPageNo,channelsearchTextValue);
   });
  };

  channelChatDetails(item: any) {
    if(this.activeChannelChatDetail?._id !== item._id){
      this.activeChannelChatBoolean = true;
      this.activeChannelChatDetail = item;
      this.activeChannelTabDetail = {...this.activeChannelChatDetail,tabType:this.tabType,channelBox:true};
      this.adduserdrop = false;
      this.notificationSettingPopup = false;
      this.memberListPopup = false;
      this.checkUserMemberOfChannel(item._id);
    }
  };

  checkUserMemberOfChannel(channelId:any){
    const data= {
      channelId,
    }
    this._CreatechannelService.checkUserMemberOfChannel(data).subscribe((res:any)=>{
      if(res.status === 200){
        this.isMemberOfChannel = res.isMemberOfChannel;
      }else{
        this._SharedService.errorToast(res.message);
      }
    });
  };


  //--------------------create channel section start--------------------------------

  ChannelPopup(params:any){
    this.channelDetail = params;
    // this.channelbox = !this.channelbox;
    this.channelbox = true;
  };

  channelBox(event:any){
    this.clickType = event.clickType;
    if(event.clickType == "cancel"){
      this.channelbox = false;
    }else if(event.clickType == "Inside"){
      this.channelbox = true;
    }else if(event.clickType == 'outside'){
      this.channelbox = false;
      this.cdr.detectChanges();
    }
  };

  onClickedchannelBoxOutside(e:Event){
    if(this.channelbox == true && this.clickType !== "Inside"){
      this.channelDetail = 'channelBoxOutsideclick';
    }else{
      this.clickType = '';
    }
  };

  //--------------------create channel section end--------------------------------

  // ------------------------channelMemberlistpopup section start--------------------------
  showMemberList(){
    this.membersList = [];
    this.memberListPopup = true; 
    this.listType = "Members";
    this.memberPageNo = 1;
    this.getChannelMemberList(this.memberPageNo);
  };

  getChannelMemberList(pageno:any){
    const data = {
      channelId:this.activeChannelChatDetail._id,
      pattern:this.listType,
      page:pageno,
      limit:10
    }
    this._CreatechannelService.getChannelMemberList(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.memberTotalDocs =res.data.totalDocs;
        this.memberTotalPages = res.data.totalPages;
        if(this.memberPageNo === 1){
          this.membersList = res.data.docs;
        }else{
          this.membersList = [...this.membersList,...res.data.docs];
        }
      }else{
        this._SharedService.errorToast(res.message);
      }
    });
  };

  closeMemberPopup(){
    this.membersList = [];
    this.memberListPopup = false;
    this.listType = '';
  };

  onMemberScrollDown(){
    if (this.membersList.length >= this.memberTotalDocs) return
    if(this.memberPageNo <this.memberTotalPages) this.memberPageNo += 1
    this.getChannelMemberList(this.memberPageNo);
  };

  convertMemberTypeByAdmin(item:any){
    const data = {
      channelId:item.channelId,
      memberId:item.userDetail._id,
      memberType:item.memberType == 'user' ? 'admin' : 'user',
    }
    this._SharedService.emit("convertMemberTypeByAdmin",data);
  };

  RemoveMember(item:any){
    const data = {
      channelId:item.channelId,
      memberId:item.userDetail._id
    }
    this._SharedService.emit("removeMemberByAdmin",data);
  };

  // -----------------------channelMemberlistpopup section start--------------------------------

  //-----------------------addAdmin section start----------------------------------

  addAdmin(params:any){
    this.memberType = params;
    this.SearchedUserName = '';
    this.usersearchdata = [];
    this.adduserdrop = true;
    this.userDetailNotAvail = false;
  };

  closeUserPopup(){
    this.memberType = undefined;
    this.SearchedUserName = '';
    this.usersearchdata = [];
    this.adduserdrop = false;
    this.userDetailNotAvail = false;
  };

  SearchUser(){
    this.searchusersubject.next(this.SearchedUserName);   
  };

  getUsersList(searchTextValue:any){
    this.usersearchdata = []
    const data = {
      channelId: this.activeChannelChatDetail._id,
      // memberType:this.memberType,
      pattern:searchTextValue.trim()
    };
    this._MinimizepopService.getUsersList(data).subscribe((res:any)=>{
      if(res.status === 200){
        res.data.map((item:any)=>{
          if(item.username.includes(this._AuthenticationService.currentUserValue.username)){
          }else{
            this.usersearchdata.push(item);
          }
        })
        if(this.usersearchdata.length === 0){
          this.userDetailNotAvail = true;
        }else{
          this.userDetailNotAvail = false;
        }
      }else{
        this._SharedService.errorToast(res.massage)
      }
    });
  };

  addMemberInPublicChannel(item:any){
    this.selectedUserItem = item;
    const data={
      channelId:this.activeChannelChatDetail._id,
      memberType:this.memberType,
      memberId:item._id
    }
    this._SharedService.emit("addMemberInChannel",data);
  };

  //-----------------------addAdmin section end----------------------------------

  showAllAdminList(){
    this.memberListPopup = true;
    this.membersList=[];
    this.listType = "Admin";
    this.memberPageNo = 1;
    this.getChannelMemberList(this.memberPageNo);
  };

  editPublicChannel(params:any){
    this.channelDetail = params;
    this.channelbox = true;
  };

  cancelLeaveChannel(){
    $("#Remove-channel").modal("hide");
  };

  leaveChannel(){
    const data = {
      channelId:this.activeChannelChatDetail._id
    }
    this._SharedService.emit("leaveChannel",data);
  };

  notificationSettingOpen(){
    this.notificationSettingPopup = true; 
  };

  notificationSettingClose(){
    this.notificationSettingPopup = false; 
  };

  publicUpdatesTab(){
    this.tabType = "updates";
    this.activeChannelTabDetail = {...this.activeChannelChatDetail,tabType:this.tabType,channelBox:true};
  };

  publicDiscussionsTab(){
    this.tabType = "discussions";
    this.activeChannelTabDetail = {...this.activeChannelChatDetail,tabType:this.tabType,channelBox:true};
  };

  channelListScrollDown(){
    if(this.searchChannelName == ""){
      if (this.publicChannelList.length >= this.totalDocs) return
      if(this.pageNo <this.totalPages) this.pageNo += 1;
      this.getPublicChannelList(this.pageNo);
    }else{
      if (this.searchedPublicChannelList.length >= this.searchTotalDocs) return
      if(this.searchPageNo <this.searchTotalPages) this.searchPageNo += 1;
      this.searchGetPublicList(this.searchPageNo,this.searchChannelName);
    }
  };
  
  minHeightOfTable(){
    this.primeTableHeight = (255-100) + this.heightBottomMsgDiv?.nativeElement?.offsetHeight; 
  };

  newCloseQuote(data:any){
    setTimeout(() => {
      this.minHeightOfTable();
    }, 50);
  };

  getPublicChannelIndex(id:any){
    return this.publicChannelList.findIndex((ele:any)=>{return ele._id == id})
  };

  ngOnDestroy(){
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  };
}
