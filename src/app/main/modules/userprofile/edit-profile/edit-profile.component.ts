import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from './confirmed.validator';
import { ImageCroppedEvent, base64ToFile } from "ngx-image-cropper";
import { UserprofileService } from '../userprofile.service';
import { SharedService } from 'src/app/main/shared/shared.service';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/main/auth/service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit{
  imgChangeEvt: any = "";
  cropImgPreview: any = "";
  uploadtoggle:any = true;
  data: any;
  profilePic: any;
  formData:any = new FormData();
  addNo:any = [];
  oldpassword:any;
  activedeactive:boolean;
  
  // edit profile data
  userpic:any;
  fullName:any;
  username:any;
  dob:any;
  bio:any;
  Website:any;
  gender:any;
  recomment:boolean;
  email:any;
  registermobile:any;

  constructor(private _FormBuilder:FormBuilder, 
              private _UserprofileService:UserprofileService, 
              private _SharedService:SharedService, 
              private _authentication:AuthenticationService, 
              private _router:Router,
              private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this._UserprofileService.viewUserDetail().subscribe(res=>{
      const response:any = res;
      this.userpic = `${response.profilePic}`;
      this.fullName = response.fullName;
      this.username = response.username;
      this.dob = formatDate(response.dateOfBirth, 'yyyy-MM-dd', 'en-IN');
      this.bio = response.bio;
      this.Website = response.website;
      this.gender = response.gender;
      this.recomment = response.replyToComments;
      this.email = response.email;
      this.registermobile = response.mobile;
      this.addNo = response.phoneForCustomer
    })
  }
  // name
  editModeToggle = true;
  edit() {this.editModeToggle = false}
  saveChanges() {
    this.editModeToggle = true;
    let data = {
      "fullName": this.sanitizer.sanitize(SecurityContext.HTML, this.fullName)
    }
    this._UserprofileService.editprofile(data).subscribe(res=>{
        const response:any = res;
        if(response.status === 200){
          this._SharedService.successToast(response.message);
        }else{
          this._SharedService.errorToast(response.message);
        }
    });
  }
  cancelEdit() {this.editModeToggle = true;}

  // your username
  editModeToggle1 = true;
  edit1() {this.editModeToggle1 = false}
  saveChanges1() {this.editModeToggle1 = true;
    let data = {
      "username": this.sanitizer.sanitize(SecurityContext.HTML, this.username)
    }
    this._UserprofileService.editprofile(data).subscribe(res=>{
        const response:any = res;
        if(response.status === 200){
          this._SharedService.successToast(response.message);
        }else{
          this._SharedService.errorToast(response.message);
        }
    });
  }
  cancelEdit1() {this.editModeToggle1 = true;}

  // Date of Birth
  editModeToggle2 = true;
  edit2() {this.editModeToggle2 = false}
  saveChanges2() {this.editModeToggle2 = true;
    const data = {
      "dateOfBirth":this.dob
    }
    this._UserprofileService.editprofile(data).subscribe(res=>{
        const response:any = res;
        if(response.status === 200){
          this._SharedService.successToast(response.message);
        }else{
          this._SharedService.errorToast(response.message);
        }
    });
  }
  cancelEdit2() {this.editModeToggle2 = true;}

  // Bio
  editModeToggle3 = true;
  edit3() {this.editModeToggle3 = false}
  saveChanges3() {this.editModeToggle3 = true;
    let data = {
      "bio": this.sanitizer.sanitize(SecurityContext.HTML, this.bio)
    }
    this._UserprofileService.editprofile(data).subscribe(res=>{
        const response:any = res;
        if(response.status === 200){
          this._SharedService.successToast(response.message);
        }else{
          this._SharedService.errorToast(response.message);
        }
    });
  }
  cancelEdit3() {this.editModeToggle3 = true;}  

  // Website
  editModeToggle4 = true;
  edit4() {this.editModeToggle4 = false}
  saveChanges4() {this.editModeToggle4 = true;
    let data = {
      "website": this.sanitizer.sanitize(SecurityContext.HTML, this.Website)
    }
    this._UserprofileService.editprofile(data).subscribe(res=>{
        const response:any = res;
        if(response.status === 200){
          this._SharedService.successToast(response.message);
        }else{
          this._SharedService.errorToast(response.message);
        }
    });
  }
  cancelEdit4() {this.editModeToggle4 = true;}
  
  // Your email
  editModeToggle5 = true;
  edit5() {this.editModeToggle5 = false}
  saveChanges5() {this.editModeToggle5 = true;
    let data = {
      "email": this.sanitizer.sanitize(SecurityContext.HTML, this.email)
    }
    this._UserprofileService.editprofile(data).subscribe(res=>{
        const response:any = res;
        if(response.status === 200){
          this._SharedService.successToast(response.message);
        }else{
          this._SharedService.errorToast(response.message);
        }
    });
  }
  cancelEdit5() {this.editModeToggle5 = true;}  

  // Your Registered Mobile
  editModeToggle6 = true;
  edit6() {this.editModeToggle6 = false}
  saveChanges6() {this.editModeToggle6 = true;
    let data = {
      "mobile": this.sanitizer.sanitize(SecurityContext.HTML, this.registermobile)
    }
    this._UserprofileService.editprofile(data).subscribe(res=>{
        const response:any = res;
        if(response.status === 200){
          this._SharedService.successToast(response.message);
        }else{
          this._SharedService.errorToast(response.message);
        }
    });
  }
  cancelEdit6() {this.editModeToggle6 = true;}

  // Your phone number
  editModeToggle7 = true;
  edit7() {this.editModeToggle7 = false}
  saveChanges7() {this.editModeToggle7 = true;
    const data = {
      "phoneForCustomer":this.addNo
    }
    this._UserprofileService.editprofile(data).subscribe(res=>{
        const response:any = res;
        if(response.status === 200){
          this._SharedService.successToast(response.message);
        }else{
          this._SharedService.errorToast(response.message);
        }
    });
  }
  cancelEdit7() {this.editModeToggle7 = true;}

  //images upload with crop
  onFileChange(event: any): void{
    this.imgChangeEvt = event;
    if(this.cropImgPreview != null ){
      this.uploadtoggle = false;
    }
  }
  
  base64ToFile(data:any, filename:any) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename,{ type: mime });
  }

  cropImg(e: ImageCroppedEvent) {
    this.cropImgPreview = e.base64;
    const fileToReturn = this.base64ToFile(
      e.base64,
      'profile_pic',
    )
    this.profilePic = fileToReturn
  }
  imgLoad() {
    // display cropper tool
  }
  initCropper() {
    // init cropper
  }
  imgFailed() {
    // error msg
  }
  profileuploadcancel(){
    this.cropImgPreview = "",
    this.imgChangeEvt = "";
    this.uploadtoggle = true;
  }

  // Profile PicUpload
  imagesuploadsave(){
    this.formData.append("profilePic",this.profilePic);
    this._UserprofileService.uploadprofilepic(this.formData).subscribe(res=>{
        const response:any = res;
        this.formData.delete("profilePic");
        if(response.status === 200){
          this._SharedService.successToast(response.message);
          this.userpic = `${response.image}`;
          this.cropImgPreview = "",
          this.imgChangeEvt = "";
          this.uploadtoggle = true;
        }else{
          this._SharedService.errorToast(response.message);
        }
    });
  }

  changeGender(e:any){
    let data = {
      "gender": this.sanitizer.sanitize(SecurityContext.HTML, e.target.value)
    }
    this._UserprofileService.editprofile(data).subscribe(res=>{
        const response:any = res;
        if(response.status === 200){
          this._SharedService.successToast(response.message);
        }else{
          this._SharedService.errorToast(response.message);
        }
    });
  }

  replyComment(e:any){
    const data = {
      "replyToComments":e.target.value
    }
    this._UserprofileService.editprofile(data).subscribe(res=>{
        const response:any = res;
        if(response.status === 200){
          this._SharedService.successToast(response.message);
        }else{
          this._SharedService.errorToast(response.message);
        }
    });
  }

  addanothernumber(){
    this.addNo.push({phone: null});
    this.editModeToggle7 = false;
  }

  ondelete(data:any){
    this.addNo.splice(data,1);
    const datas = {
      "phoneForCustomer":this.addNo
    }
    this._UserprofileService.editprofile(datas).subscribe(res=>{
        const response:any = res;
        if(response.status === 200){
          this._SharedService.successToast(response.message);
        }else{
          this._SharedService.errorToast(response.message);
        }
    });
  }

  // resetpassword 
  resetPassword:any = this._FormBuilder.group({
    password: ['',[Validators.required, Validators.minLength(6)]],
    confirm_password: ['',Validators.required],}
    ,{
      validator: MustMatch('password', 'confirm_password')
   });

  get f(){
    return this.resetPassword;
  }

  resetpassword(f:any){
    if(f.valid){
      let data = {
        "oldPassword": this.sanitizer.sanitize(SecurityContext.HTML, this.oldpassword),
        "newPassword": this.sanitizer.sanitize(SecurityContext.HTML, f.value.confirm_password)
      }
      this._UserprofileService.changePasswords(data).subscribe(res=>{
          const response:any = res;
          if(response.status === 200){
            this._SharedService.successToast(response.message);
            this.oldpassword = "";
            this.resetPassword.reset();
          }else{
            this._SharedService.errorToast(response.message);
            this.oldpassword = "";
            this.resetPassword.reset();
          }
      });
    }else if(!this.resetPassword.valid){
      this.resetPassword.markAllAsTouched();
    }
  }

  deactiveactive(){
    const data = {
      "data": this.activedeactive = false
    }
    this._UserprofileService.deactivateAccount(data).subscribe(res=>{
      const response:any = res;
      if(response.status === 200){
        this._SharedService.successToast(response.message);
        this._authentication.logout();
        this._router.navigate(['/accounts/login']);
      }else{
        this._SharedService.errorToast(response.message);
      }
    })
  }

}
