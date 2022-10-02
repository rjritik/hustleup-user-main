import { Component, OnInit, Output,EventEmitter, Input, OnDestroy, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SharedService } from '../shared.service';
import { CreatechannelService } from './createchannel.service';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../auth/service';

@Component({
  selector: 'app-channelcreatebox',
  templateUrl: './channelcreatebox.component.html',
  styleUrls: ['./channelcreatebox.component.css']
})
export class ChannelcreateboxComponent implements OnInit,OnDestroy {
  @Output() channelBox = new EventEmitter<any>();
  parentData:any;
  @Input() set channelDetail(params: any) {
    this.parentData = params
    if(this.parentData == 'channelBoxOutsideclick'){
      this.channelBox.emit({clickType:"outside"});
      this.channelForm.reset()
      this.preText = ''
      this.selectedProfilePhoto = '';
      this.previewProfilePic = '';
    }
  }
  updateChannelboolean:boolean = false;
  channelHeading:any;
  switchChannelType:boolean;
  isUrlAvailable:any;
  channelType:any='';
  memberType:any='';
  selectedProfilePhoto:any='';
  previewProfilePic:any='';
  spinnerShow:boolean = false;
  formDataChannel:any = new FormData();

  private searchChannelUrlSubject: Subject<string> = new Subject()

  searchChannelUrlUnsub$: Subscription;
  createChannelUnsub$: Subscription;
  updateChannelUnsub$: Subscription;
  subscriptions: Subscription[] = []
  public preText: string = '';
  

  constructor(private _CreatechannelService:CreatechannelService,
              private _SharedService:SharedService,
              private _AuthenticationService:AuthenticationService,
              private sanitizer:DomSanitizer) { }
  channelForm:any = new FormGroup({
    channelName: new FormControl("",[Validators.required,Validators.maxLength(32),Validators.pattern("^[a-zA-Z0-9-]+$")]),
    channelDescription: new FormControl(""),
    urlName: new FormControl("",[Validators.required]),
    channelCheckbox: new FormControl(false),
    allowMember: new FormControl(false)
  });

  get f(){
    return this.channelForm;
  }

  ngOnInit(): void {
    if(this.parentData == 'Public'){
      this.channelBoxInsideClick()
      this.updateChannelboolean = false;
      this.channelType = 'public';
      this.channelHeading = 'Create a Public Channel'
      this.switchChannelType = false;
      this.preText = environment.publicDomain;
    }else if(this.parentData == 'Private'){
      this.channelBoxInsideClick()
      this.channelType = 'private';
      this.updateChannelboolean = false;
      this.channelHeading = 'Create a Private Channel'
      this.switchChannelType = true;
      this.channelForm.get('channelCheckbox').setValue(true);
      this.preText = environment.privateDomain; 
    }else if(this.parentData.channelType == 'public' ||this.parentData.channelType == 'signup'){
      this.channelBoxInsideClick()
      this.updateChannelboolean = true;
      this.isUrlAvailable = false;
      this.channelType = this.parentData.channelType;
      this.memberType = this.parentData.isAdmin ? 'admin' : 'user';
      this.channelHeading = 'Edit a Public Channel'
      this.switchChannelType = false;
      this.channelForm.patchValue({
        channelName:this.parentData.name,
        channelDescription:this.parentData.description,
        urlName:this.parentData.urlName,
        channelCheckbox:false,
        allowMember:this.parentData.allowAddMember
      });
      this.previewProfilePic = this.parentData.profilePic;
      this.preText =this.parentData.channelType == 'public' ? environment.publicDomain:environment.signUpDomain;
      this.channelForm.controls.channelName.disable();
      this.channelForm.controls.urlName.disable();
      
    }else if(this.parentData.channelType == 'private'){
      this.channelBoxInsideClick()
      this.updateChannelboolean = true;
      this.isUrlAvailable = false;
      this.channelType =this.parentData.channelType ;
      this.memberType = this.parentData.isAdmin ? 'admin' : 'user';
      this.channelHeading = 'Edit a Private Channel';
      this.switchChannelType = true;
      this.channelForm.patchValue({
        channelName:this.parentData.name,
        channelDescription:this.parentData.description,
        urlName:this.parentData.urlName,
        channelCheckbox:true,
        allowMember:this.parentData.allowAddMember
      });
      this.previewProfilePic = this.parentData.profilePic;
      this.preText =environment.privateDomain;
      this.channelForm.controls.channelName.disable();
      this.channelForm.controls.urlName.disable();
      this.channelForm.get('channelCheckbox').disable();
      
    }
    this.createChannelListen()
    this.updateChannelListen()
    this.DebounceMethods()
    this.UnsubscribeMethod()
    
  }
  

  DebounceMethods(){
    this.searchChannelUrlUnsub$ = this.searchChannelUrlSubject.pipe(debounceTime(500)).subscribe((searchTextValue:any) => {
      this.getchannelUrlStatus(searchTextValue);
    });
  }

  createChannelListen(){
    this.createChannelUnsub$ = this._SharedService.listen("createChannelEmit").subscribe((res:any)=>{
      if(res.status === 201){
        this._SharedService.successToast(res.message);
        this.cancelChannel();
      }else if(res.status === 409|| res.status === 401|| res.status === 500){
        this._SharedService.errorToast(res.message);
        this.spinnerShow = false;
      }
    })
  }

  updateChannelListen(){
    this.updateChannelUnsub$ = this._SharedService.listen("updateChannelEmit").subscribe((res:any)=>{
      if(res.status === 200 ){
        if(this._AuthenticationService.currentUserValue.username == res.data.senderUserDetail.username) this._SharedService.successToast(res.message);
        this.cancelChannel();
      }else if(res.status === 404|| res.status === 401|| res.status === 500){
        this._SharedService.errorToast(res.message);
        this.spinnerShow = false;
      }
    })
  }

  UnsubscribeMethod(){
    this.subscriptions.push(this.createChannelUnsub$)
    this.subscriptions.push(this.updateChannelUnsub$)
  }

  onChange(event:any) {
    if(event.target.files && event.target.files[0]) {
      // Image upload validation
      const mimeType = event.target.files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        this._SharedService.errorToast('only images are allowed');
        this.selectedProfilePhoto = '';
        this.previewProfilePic = '';
        return;
      }
      this.selectedProfilePhoto = event.target.files[0];
      // Show image preview
      const reader = new FileReader();
      reader.onload = (event: any) => {
      this.previewProfilePic=event.target.result;
    };
    reader.readAsDataURL(this.selectedProfilePhoto);
    }
  };

  channeNameChange(event:any){
    const updatedName = event.target.value.replaceAll(' ', '-');
    this.channelForm.get('channelName').setValue(updatedName);

  }

  typedUrl(f:any){
    if(f.value.urlName){
      this.searchChannelUrlSubject.next(f.value.urlName.trim()); 
    }else{
      this.isUrlAvailable = true;
    }
  }

  getchannelUrlStatus(searchTextValue:any){
    let data= {
      urlName: this.sanitizer.sanitize(SecurityContext.HTML, searchTextValue),
      channelType : this.sanitizer.sanitize(SecurityContext.HTML, this.channelType)
    }
    this._CreatechannelService.searchChannelsURL(data).subscribe((res:any) => {
      if(res.status == 409 || 404){
        this.isUrlAvailable = res.channelUrlAvailable
      }else{
        this._SharedService.errorToast(res.message)
      }
      
    })
  }

  switchbutton(event:any){
    if(event.target.checked){
      if(this.parentData && this.parentData.channelType == 'public'){
        this.channelHeading = 'Edit a Public Channel'
        this.channelType = 'public';
        this.channelForm.controls.urlName.enable();
        this.searchChannelUrlSubject.next(this.parentData.urlName);
      }else if(this.parentData && this.parentData.channelType == 'signup'){
        this.channelHeading = 'Edit a Public Channel'
        this.channelType = 'signup';
        this.channelForm.controls.urlName.enable();
        this.searchChannelUrlSubject.next(this.parentData.urlName);
      }else if(this.parentData && this.parentData.channelType == 'private'){
        this.channelHeading = 'Edit a Private Channel'
        this.isUrlAvailable = false;
        this.channelType = 'private';
      }else{
        this.channelHeading = 'Create a Private Channel';
        this.channelType = 'private';
      }
      this.preText = environment.privateDomain;
      this.switchChannelType = true;
      this.channelForm.get('channelCheckbox').setValue(true);
    }else {
      if(this.parentData && this.parentData.channelType == 'public'){
        this.channelHeading = 'Edit a Public Channel'
        this.channelType = 'public';
        this.preText = environment.publicDomain;
        this.channelForm.controls.urlName.disable();
        this.channelForm.get('urlName').setValue(this.parentData.urlName);
        this.isUrlAvailable = false;
        
      }else if(this.parentData && this.parentData.channelType == 'signup'){
        this.channelHeading = 'Edit a Public Channel'
        this.channelType = 'signup';
        this.preText = environment.signUpDomain;
        this.channelForm.controls.urlName.disable();
        this.channelForm.get('urlName').setValue(this.parentData.urlName);
        this.isUrlAvailable = false;
      }else if(this.parentData && this.parentData.channelType == 'private'){
        this.channelHeading = 'Edit a Private Channel'
        this.isUrlAvailable = false;
        this.channelType = 'private';
      }else{
        this.channelHeading = 'Create a Public Channel'
        this.preText = environment.publicDomain;
        this.channelType = 'public';
      }
      this.switchChannelType = false;                                                                                                                          
      
    }
  }

  cancelChannel(){
    this.channelBox.emit({clickType:"cancel"});
    this.channelForm.reset()
    this.preText = '';
    this.spinnerShow = false;
    this.selectedProfilePhoto = '';
    this.previewProfilePic = '';
  } 

  //-------create channel section start --------------------------------

  CreateChannel(f:any){
    if(f.valid && this.spinnerShow == false){
      if(this.channelType == 'public' || this.channelType == 'signup'){
        this.channelForm.get('allowMember').setValue(false);
      }
      if(this.channelType == 'private'){
        this.selectedProfilePhoto = '';
        this.previewProfilePic = '';
      }
      if(this.selectedProfilePhoto !== '' && this.selectedProfilePhoto !== undefined){
        if(this.selectedProfilePhoto.size/Math.pow(1024,2) <=10){
          this.formDataChannel.append('images',this.selectedProfilePhoto);
          this.uploadProfilePicForCreateChannel(f)
        }else{
          this._SharedService.InfoToast("Please Send Upto 10MB Media")
        }  
      }else{
        let data = {
          name: this.sanitizer.sanitize(SecurityContext.HTML, f.value.channelName),
          description: this.sanitizer.sanitize(SecurityContext.HTML, f.value.channelDescription),
          urlName: this.sanitizer.sanitize(SecurityContext.HTML, f.value.urlName),
          channelType: this.sanitizer.sanitize(SecurityContext.HTML, this.channelType),
          allowAddMember:f.value.allowMember,
          profilePic:this.selectedProfilePhoto
        }
        this._SharedService.emit("createChannel",data);
      }     
    }else{
      this.channelForm.markAllAsTouched()
    }
  };

  uploadProfilePicForCreateChannel(f:any){
    this.spinnerShow = true;
    this.formDataChannel.append('For','channel');
    this._CreatechannelService.uploadMedia(this.formDataChannel).subscribe((res:any)=>{
      if(res.status == 200){
        let data = {
          name: this.sanitizer.sanitize(SecurityContext.HTML, f.value.channelName),
          description: this.sanitizer.sanitize(SecurityContext.HTML, f.value.channelDescription),
          urlName: this.sanitizer.sanitize(SecurityContext.HTML, f.value.urlName),
          channelType: this.sanitizer.sanitize(SecurityContext.HTML, this.channelType),
          allowAddMember:f.value.allowMember,
          profilePic:res.Images[0].url
        }
        this._SharedService.emit("createChannel",data)
        this.formDataChannel.delete('images');
        this.formDataChannel.delete("For")
      }else{
        this.spinnerShow = false;
        this.formDataChannel.delete('images');
        this.formDataChannel.delete("For")
        this._SharedService.errorToast(res.message)
      }
    })
  }
  //-------create channel section end --------------------------------

  //-------update channel section start --------------------------------

  UpdateChannel(f:any){
    if(f.valid && this.spinnerShow == false){
      if(this.channelType == 'public'|| this.channelType == 'signup'){
        this.channelForm.get('allowMember').setValue(false);
      }
      if(this.channelType == 'private'){
        this.selectedProfilePhoto = '';
        this.previewProfilePic = '';
      }
      if(this.selectedProfilePhoto !== '' && this.selectedProfilePhoto !== undefined){
        if(this.selectedProfilePhoto.size/Math.pow(1024,2) <=10){
          this.formDataChannel.append('images',this.selectedProfilePhoto);
          this.uploadProfilePicForUpdateChannel(f);
        }else{
          this._SharedService.InfoToast("Please Send Upto 10MB Media");
        }  
      }else{
        let data = {
          channelId:this.parentData._id,
          description: this.sanitizer.sanitize(SecurityContext.HTML, f.value.channelDescription),
          urlName: this.sanitizer.sanitize(SecurityContext.HTML, f.getRawValue().urlName),
          channelType: this.sanitizer.sanitize(SecurityContext.HTML, this.channelType),
          allowAddMember:f.value.allowMember,
          memberType:this.memberType,
          profilePic:this.selectedProfilePhoto,
        }
        this._SharedService.emit("updateChannel",data) 
      }
    }else{
      this.channelForm.markAllAsTouched()
    }
  }

  uploadProfilePicForUpdateChannel(f:any){
    this.spinnerShow = true;
    this.formDataChannel.append('For','channel');
    this._CreatechannelService.uploadMedia(this.formDataChannel).subscribe((res:any)=>{
      if(res.status == 200){
        let data = {
          channelId:this.parentData._id,
          description: this.sanitizer.sanitize(SecurityContext.HTML, f.value.channelDescription),
          urlName: this.sanitizer.sanitize(SecurityContext.HTML, f.getRawValue().urlName),
          channelType: this.sanitizer.sanitize(SecurityContext.HTML, this.channelType),
          allowAddMember:f.value.allowMember,
          memberType:this.memberType,
          profilePic:res.Images[0].url
        }
        this._SharedService.emit("updateChannel",data);
        this.formDataChannel.delete('images');
        this.formDataChannel.delete("For");
      }else{
        this.spinnerShow = false;
        this.formDataChannel.delete('images');
        this.formDataChannel.delete("For");
        this._SharedService.errorToast(res.message);
      }
    });
  };

  //-------update channel section end --------------------------------

  channelBoxInsideClick(){
    this.channelBox.emit({clickType:"Inside"})
  }

  ngOnDestroy(){
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }
}