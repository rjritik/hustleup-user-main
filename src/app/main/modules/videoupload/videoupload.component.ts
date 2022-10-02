import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../shared/shared.service';
import { Select2OptionData } from 'ng-select2';
import { VideouploadService } from './videoupload.service'
import { NgxSpinnerService } from 'ngx-spinner';
import * as Plyr from 'plyr';
import * as moment from 'moment';
import { NgxImageCompressService } from 'ngx-image-compress';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips/chip-input';
import { Observable } from 'rxjs/internal/Observable';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { AuthenticationService } from '../../auth/service/authentication.service';
import { getParamByISO } from 'iso-country-currency';
declare let $ :any;
declare let modal:any;

@Component({
  selector: 'app-videoupload',
  templateUrl: './videoupload.component.html',
  styleUrls: ['./videoupload.component.css']
})
export class VideouploadComponent implements OnInit{
  userserachbarreference = false;
  tagprod = false;
  advancecatogaryinner = false;
  previewmain:any;
  url:any;
  format:any;
  minFromDate = new Date();
  maxToDate = new Date().setDate(2);
  addphotos:any = [];
  multiplefile:any = [];
  Schedulelater:boolean = false;
  formdataimg = new FormData();
  getAllSchedulePostVideo:any = [];
  imagesuploadtitle = false;
  imagesuploadsection = true;
  timeselect:any = Array<Select2OptionData>();
  ngselect:any = true;
  usersearch:any;
  usersearchdata:any = [];
  activeindex:any = 0;
  public player:any;
  onSelectimages:any;
  videouploadformate:any = [];
  productsearch:any;
  productsearchdata:any=[];
  hashtag:string[] = []
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');

  @ViewChild('hashtagInput') hashtagInput: ElementRef<HTMLInputElement>;
  
  constructor(private _SharedService:SharedService,private _AuthenticationService:AuthenticationService,private _VideouploadService:VideouploadService,private spinner: NgxSpinnerService,private imageCompress: NgxImageCompressService) { }

  get f(){
    return this.Scheduledposts;
  }
  get fs(){
    return this.titleprods;
  }
  Scheduledposts:any = new FormGroup({
	  scheduledate: new FormControl(undefined, [Validators.required]),
    timeselect: new FormControl(undefined,[Validators.required]),
  });

  titleprods:any = new FormGroup({
    producttitle: new FormControl(undefined,[Validators.required]),
    advancecategories: new FormControl(undefined,[Validators.required]),
  });

  ngOnInit(): void {
    const controls = [
      'play-large', // The large play button in the center
      'mute', // Toggle mute
      'fullscreen',
    ];
    console.log(this.videouploadformate, "videouploadformate");
    this.player = new Plyr('#uploadvideo', { captions: { active: true},controls });
    this._VideouploadService.getAllSchedulePostVideo().subscribe((res:any)=>{
      this.getAllSchedulePostVideo = res.data;
    },(err=>{
      this._SharedService.errorToast(err);
    }));
  }

  onchangedate(e:any){
    this.timeselect = [
      {id: '12:00 am',text: '12:00 AM'},
      {id: '12:15 am',text: '12:15 AM'},
      {id: '12:30 am',text: '12:30 AM'},
      {id: '12:45 am',text: '12:45 AM'},
      {id: '01:00 am',text: '01:00 AM'},
      {id: '01:15 am',text: '01:15 AM'},
      {id: '01:30 am',text: '01:30 AM'},
      {id: '01:45 am',text: '01:45 AM'},
      {id: '02:00 am',text: '02:00 AM'},
      {id: '02:15 am',text: '02:15 AM'},
      {id: '02:30 am',text: '02:30 AM'},
      {id: '02:45 am',text: '02:45 AM'},
      {id: '03:00 am',text: '03:00 AM'},
      {id: '03:15 am',text: '03:15 AM'},
      {id: '03:30 am',text: '03:30 AM'},
      {id: '03:45 am',text: '03:45 AM'},
      {id: '04:00 am',text: '04:00 AM'},
      {id: '04:15 am',text: '04:15 AM'},
      {id: '04:30 am',text: '04:30 AM'},
      {id: '04:45 am',text: '04:45 AM'},
      {id: '05:00 am',text: '05:00 AM'},
      {id: '05:15 am',text: '05:15 AM'},
      {id: '05:30 am',text: '05:30 AM'},
      {id: '05:45 am',text: '05:45 AM'},
      {id: '06:00 am',text: '06:00 AM'},
      {id: '06:15 am',text: '06:15 AM'},
      {id: '06:30 am',text: '06:30 AM'},
      {id: '06:45 am',text: '06:45 AM'},
      {id: '07:00 am',text: '07:00 AM'},
      {id: '07:15 am',text: '07:15 AM'},
      {id: '07:30 am',text: '07:30 AM'},
      {id: '07:45 am',text: '07:45 AM'},
      {id: '08:00 am',text: '08:00 AM'},
      {id: '08:15 am',text: '08:15 AM'},
      {id: '08:30 am',text: '08:30 AM'},
      {id: '08:45 am',text: '08:45 AM'},
      {id: '09:00 am',text: '09:00 AM'},
      {id: '09:15 am',text: '09:15 AM'},
      {id: '09:30 am',text: '09:30 AM'},
      {id: '09:45 am',text: '09:45 AM'},
      {id: '10:00 am',text: '10:00 AM'},
      {id: '10:15 am',text: '10:15 AM'},
      {id: '10:30 am',text: '10:30 AM'},
      {id: '10:45 am',text: '10:45 AM'},
      {id: '11:00 am',text: '11:00 AM'},
      {id: '11:15 am',text: '11:15 AM'},
      {id: '11:30 am',text: '11:30 AM'},
      {id: '11:45 am',text: '11:45 AM'},
      {id: '12:00 pm',text: '12:00 PM'},
      {id: '12:15 pm',text: '12:15 PM'},
      {id: '12:30 pm',text: '12:30 PM'},
      {id: '12:45 pm',text: '12:45 PM'},
      {id: '01:00 pm',text: '01:00 PM'},
      {id: '01:15 pm',text: '01:15 PM'},
      {id: '01:30 pm',text: '01:30 PM'},
      {id: '01:45 pm',text: '01:45 PM'},
      {id: '02:00 pm',text: '02:00 PM'},
      {id: '02:15 pm',text: '02:15 PM'},
      {id: '02:30 pm',text: '02:30 PM'},
      {id: '02:45 pm',text: '02:45 PM'},
      {id: '03:00 pm',text: '03:00 PM'},
      {id: '03:15 pm',text: '03:15 PM'},
      {id: '03:30 pm',text: '03:30 PM'},
      {id: '03:45 pm',text: '03:45 PM'},
      {id: '04:00 pm',text: '04:00 PM'},
      {id: '04:15 pm',text: '04:15 PM'},
      {id: '04:30 pm',text: '04:30 PM'},
      {id: '04:45 pm',text: '04:45 PM'},
      {id: '05:00 pm',text: '05:00 PM'},
      {id: '05:15 pm',text: '05:15 PM'},
      {id: '05:30 pm',text: '05:30 PM'},
      {id: '05:45 pm',text: '05:45 PM'},
      {id: '06:00 pm',text: '06:00 PM'},
      {id: '06:15 pm',text: '06:15 PM'},
      {id: '06:30 pm',text: '06:30 PM'},
      {id: '06:45 pm',text: '06:45 PM'},
      {id: '07:00 pm',text: '07:00 PM'},
      {id: '07:15 pm',text: '07:15 PM'},
      {id: '07:30 pm',text: '07:30 PM'},
      {id: '07:45 pm',text: '07:45 PM'},
      {id: '08:00 pm',text: '08:00 PM'},
      {id: '08:15 pm',text: '08:15 PM'},
      {id: '08:30 pm',text: '08:30 PM'},
      {id: '08:45 pm',text: '08:45 PM'},
      {id: '09:00 pm',text: '09:00 PM'},
      {id: '09:15 pm',text: '09:15 PM'},
      {id: '09:30 pm',text: '09:30 PM'},
      {id: '09:45 pm',text: '09:45 PM'},
      {id: '10:00 pm',text: '10:00 PM'},
      {id: '10:15 pm',text: '10:15 PM'},
      {id: '10:30 pm',text: '10:30 PM'},
      {id: '10:45 pm',text: '10:45 PM'},
      {id: '11:00 pm',text: '11:00 PM'},
      {id: '11:15 pm',text: '11:15 PM'},
      {id: '11:30 pm',text: '11:30 PM'},
      {id: '11:45 pm',text: '11:45 PM'},
    ];
    this.ngselect = false;
    let todaycompare = new Date();
    todaycompare.setHours(0, 0, 0, 0);
    if(moment(e).isSame(todaycompare)){
      this.timeselect = this.timeselect.filter((item:any)=>{
        var tDate=moment(moment(item.id, "HH:mm a"));
        let today = new Date();
        let time = today.getHours() + ":" + today.getMinutes();
        const datetime = moment(time, "hh:mm a");
        if(tDate.isSameOrAfter(datetime)){
          return item;
        };
      });
    }else{
      this.timeselect = this.timeselect.filter((item:any)=>{
        return item;
      });
    };
  }

  userreference(){
    this.userserachbarreference = true;
    this.tagprod = false;
  }

  tagprodreference(){
    this.tagprod = true;
    this.userserachbarreference = false;
  }

  usersearchclose(){
    this.userserachbarreference = false;
    this.tagprod = false;
  }
  productsearchclose(){
    this.userserachbarreference = false;
    this.tagprod = false;
  }

  getUsers(){
    if(this.usersearch.trim() != ''){
      this.usersearchdata = [];
      const data = {
        pattern:this.usersearch.trim()
      };
      this._VideouploadService.getUsersList(data).subscribe(res=>{
        const response:any = res;
        const a = this.videouploadformate[0].taggedUsers.map((item:any)=>{
            return item.userId;
        });
        response.data.map((item:any)=>{
          if(a.includes(item._id)){
            } else {
              this.usersearchdata.push(item);
            }
        });
      });
    };
  };


  taguserdata(data:any){
    const datas = {
        "userId":data._id,
        "username":data.username,
        "fullName":data.fullName,
        "x":0,
        "y":0,
    };
    this.videouploadformate[0].taggedUsers.push(datas);
    this.previewmain = this.videouploadformate[0];
    this.userserachbarreference = false;
    this.usersearch = "";
    this.usersearchdata = "";
  };

  getProduct(){
    if(this.productsearch.trim() != ''){
      this.productsearchdata = [];
      const data = {
        pattern:this.productsearch.trim()
      };
      this._VideouploadService.getProductList(data).subscribe((res:any)=>{
        if(res.status == 200){
          const a = this.videouploadformate[0].taggedProducts.map((item:any)=>{
            return item.productId;
          });
          res.data.map((item:any)=>{
            if(a.includes(item._id)){
            }else{
              this.productsearchdata.push(item);
            }
          });
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

  tagproductdata(productdata:any){
    const datas = {
      productId:productdata._id,
      productName:productdata.productName,
      variations:productdata.variations,
      x:0,
      y:0,
    };
    this.videouploadformate[0].taggedProducts.push(datas);
    this.previewmain = this.videouploadformate[0];
    this.tagprod = false;
    this.productsearch = "";
    this.productsearchdata = "";
  }

  removecoverimg(){
    this.addphotos = "";
  }

  scheduled(f:any){
    if (f.valid) {
        $('.modal#publishlaters').modal('hide');
        $('.modal#publishlaters').modal({
          backdrop:'static',
          keyboard: false
        });
        const convertedTime = moment(`${f.value.timeselect}`, 'hh:mm A').format('HH:mm');
        const hour1 = (convertedTime.split(`/`)[0][0]);
        const hour2 = (convertedTime.split(`/`)[0][1]);
        const mint4 = (convertedTime.split(`/`)[0][3]);
        const mint5 = (convertedTime.split(`/`)[0][4]);
        const scheduledate = f.value.scheduledate;
        scheduledate.setHours(scheduledate.getHours() + `${hour1}${hour2}`);
        scheduledate.setMinutes(scheduledate.getMinutes() + `${mint4}${mint5}`);
        const addvideotagg:any = []
        this.videouploadformate.map((data:any,i:any)=>{
          const datas = {
              no:i,
              taggedProducts:data.taggedProducts.map((item:any)=>{return {productId:item.productId,x:item.x,y:item.y}}),
              taggedUsers:data.taggedUsers.map((item:any)=>{ return {userId: item.userId,x:item.x,y:item.y}})
            }
            addvideotagg.push(datas);
        });
          this.formdataimg.append('isScheduled','true');
          this.formdataimg.append('scheduledDate',scheduledate);
          this.formdataimg.append('postTitle',this.titleprods.value.producttitle);
          this.formdataimg.append('hashtags',JSON.stringify(this.hashtag));
          this.formdataimg.append('advanceCategory',this.titleprods.value.advancecategories);
          const datas = []
          for(let item of addvideotagg){
            const data = JSON.stringify(item);
            datas.push(data);
          }
          this.formdataimg.append('tags',JSON.stringify(datas));
          this.formdataimg.append('video',this.videouploadformate[0].file);
          this.formdataimg.append('coverImg',this.onSelectimages);
          this.spinner.show();
          this._VideouploadService.videoupload(this.formdataimg).subscribe(res=>{
            const response:any = res;
            this.hashtag = [];
            this.format = '';
            this.url = '';
            this.addphotos = "";
            this.previewmain = '';
            this.videouploadformate[0].taggedUsers = [];
            this.formdataimg.delete('isScheduled');
            this.formdataimg.delete('scheduledDate');
            this.formdataimg.delete('postTitle');
            this.formdataimg.delete('hashtags');
            this.formdataimg.delete('advanceCategory');
            this.formdataimg.delete('tags');
            this.formdataimg.delete('video');
            this.formdataimg.delete('coverImg');
            this.previewmain = null;
            this.videouploadformate = [];
            this._SharedService.successToast(response.message);
            this.titleprods.reset();
            this.Scheduledposts.reset();
            this.spinner.hide();
            this._VideouploadService.getAllSchedulePostVideo().subscribe((res:any)=>{
            this.getAllSchedulePostVideo = res.data;
            this.imagesuploadtitle = false;
            this.imagesuploadsection = true;
            },(err=>{
              this._SharedService.errorToast(err);
            }));
          },(err=>{
            this._SharedService.errorToast(err);
          }));
        this.Schedulelater = false;
    }else if(!this.Scheduledposts.valid){
      this.Scheduledposts.markAllAsTouched();
    }
  }

  publishlater(fs:any){
    if(this.format==='video' && this.url){
      if(this.addphotos.length >= 1){
        if (fs.valid) {
          this.Schedulelater = true;
          $('.modal#publishlaters').modal('show');
          $('.modal#publishlaters').modal({
            backdrop: 'static',
            keyboard: true
          });
        }else{
          this.titleprods.markAllAsTouched();
        }
      }else{
        this._SharedService.errorToast("cover image required");
      }
    }else{
      this._SharedService.errorToast("video required");
    }
  }
  // displayTags(event:any){
  //   this.hashtag =event
  // }

  publishnow(fs:any){
  if(this.format==='video' && this.url){
      if(this.addphotos.length >= 1){
        if (fs.valid) {
          const addvideotagg:any = []
          this.videouploadformate.map((data:any,i:any)=>{
            const datas = {
                no:i,
                taggedProducts:data.taggedProducts.map((item:any)=>{return {productId:item.productId,x:item.x,y:item.y}}),
                taggedUsers:data.taggedUsers.map((item:any)=>{ return {userId: item.userId,x:item.x,y:item.y}})
              }
              addvideotagg.push(datas);
          });
            this.formdataimg.append('isScheduled','false');
            this.formdataimg.append('scheduledDate','');
            this.formdataimg.append('postTitle',this.titleprods.value.producttitle);
            this.formdataimg.append('hashtags',JSON.stringify(this.hashtag));
            this.formdataimg.append('advanceCategory',this.titleprods.value.advancecategories);
            const datas = []
            for(let item of addvideotagg){
              const data = JSON.stringify(item);
              datas.push(data);
            }
            this.formdataimg.append('tags',JSON.stringify(datas));
            this.formdataimg.append('video',this.videouploadformate[0].file);
            this.formdataimg.append('coverImg',this.onSelectimages);
            this.spinner.show();
            this._VideouploadService.videoupload(this.formdataimg).subscribe(res=>{
            const response:any = res;
            this.hashtag = [];
            this.format = '';
            this.url = '';
            this.previewmain = '';
            this.videouploadformate[0].taggedUsers = [];
            this.formdataimg.delete('isScheduled');
            this.formdataimg.delete('scheduledDate');
            this.formdataimg.delete('postTitle');
            this.formdataimg.delete('hashtags');
            this.formdataimg.delete('advanceCategory');
            this.formdataimg.delete('tags');
            this.formdataimg.delete('video');
            this.formdataimg.delete('coverImg');
            this.addphotos = "";
            this.previewmain = null;
            this.videouploadformate = [];
            this._SharedService.successToast("post created");
            this.titleprods.reset();
            this.Scheduledposts.reset();
            this.spinner.hide();
            this._VideouploadService.getAllSchedulePostVideo().subscribe((res:any)=>{
              this.getAllSchedulePostVideo = res.data;
              this.imagesuploadtitle = false;
              this.imagesuploadsection = true;
            },(err=>{
              this._SharedService.errorToast(err);
            }));
          },(error)=>{
            this._SharedService.errorToast(error.message);
          });
        }else{
          this.titleprods.markAllAsTouched();
        }
      }else{
        this._SharedService.errorToast("cover image required");
      }
    }else{
      this._SharedService.errorToast("video required");
    }
  }

  cancelschedule(){
    $('.modal#publishlaters').modal('hide');
    $('.modal#publishlaters').modal({
      backdrop: 'static',
      keyboard: false
    });
    this.Schedulelater = false;
  }

  PublishNowSchedulePost(e:any){
    const data = {
      "postId":e
    }
    this._VideouploadService.publishNowPostVideo(data).subscribe(res=>{
      const response:any = res;
      this._SharedService.successToast(response.message);
      this._VideouploadService.getAllSchedulePostVideo().subscribe((res:any)=>{
        this.getAllSchedulePostVideo = res.data;
      },(err=>{
        this._SharedService.errorToast(err);
      }));
    },(error=>{
      this._SharedService.errorToast(error);
    }));
  };
  
  CancelSchedulePost(e:any){
    const data = {
      "postId":e
    }
    this._VideouploadService.deletePostVideo(data).subscribe(res=>{
      const response:any = res;
      this._SharedService.successToast(response.message);
      this._VideouploadService.getAllSchedulePostVideo().subscribe((res:any)=>{
        this.getAllSchedulePostVideo = res.data;
      },(err=>{
        this._SharedService.errorToast(err);
      }));
    },(e=>{
      this._SharedService.errorToast(e);
    }));
  };

  onSelectFile(event:any){
    const file = event.target.files && event.target.files[0];
    if (file && file.size <= 5048576) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      if(file.type.indexOf('image')> -1){
        this.format = 'image';
      } else if(file.type.indexOf('video')> -1){
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      }
      const obj = {
        file:file,
        taggedUsers:[],
        taggedProducts:[],
      }
      this.videouploadformate.push(obj);
    }else{
      this._SharedService.errorToast("File too Big, please select a file less than 5mb")
    }
  }

  // onSelectFileimages(event:any) {
  //   if(event.target.files && event.target.files[0]) {
  //       var filesAmount = event.target.files.length;
  //       for(let i = 0; i < filesAmount; i++){
  //               const reader = new FileReader();
  //               reader.onload = (event:any) => {
  //                 this.addphotos = event.target.result
  //               };
  //               reader.readAsDataURL(event.target.files[i]);
  //           }
  //     this.onSelectimages = event.target.files[0];
  //     }
  // }

  dataURLtoFile(dataurl:any,filename:any) {
    var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), 
    n = bstr.length, 
    u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  onSelectFileimages() {
    this.imageCompress.uploadFile().then(({image, orientation}) => {
        this.imageCompress.compressFile(image, orientation, 50, 50).then((compressedImage) => {
          let file = this.dataURLtoFile(compressedImage,"Image");
          if(file.size < 153600){
            this.addphotos = compressedImage
            this.onSelectimages = file
          }else{
            this._SharedService.errorToast("File too Big, please select a file less than 1mb")
          }
        });
      }
    )
  }

  getDuration(e:any) {
    const duration = e.target.duration;
    const videoSizeError = duration > 30;
    if(videoSizeError == true){
      this._SharedService.errorToast('Video must be 30 seconds or below');
      this.format = '';
      this.url = '';
    };
  };

  removevideo(){
    this.format = '';
    this.url = '';
    this.previewmain = '';
    this.videouploadformate[0].taggedUsers = [];
  }

  add(event: MatChipInputEvent): void{
    const value = (event.value || '').trim();
    // Add our fruit
    if ((value || '').trim()) {
      if (this.hashtag.length < 10) {
        const hashtag = value.replace(/#/g, '').trim();
        const hashtaginclude = '#' + hashtag.replace(/\s/g, '');
        let result = this.hashtag.filter(o1 => [hashtaginclude].some(o2 => o1 == o2));
        if(result.length === 0){
          this.hashtag.push(hashtaginclude);
        }else{
          this._SharedService.errorToast("already use hashtag");
        }
      } else {
        this.hashtag.splice(-1);
        const hashtag = value.replace(/#/g, '').trim();
        const hashtaginclude = '#' + hashtag.replace(/\s/g, '');
        let result = this.hashtag.filter(o1 => [hashtaginclude].some(o2 => o1 == o2));
        if(result.length === 0){
          this.hashtag.push(hashtaginclude);
        }else{
          this._SharedService.errorToast("already use hashtag");
        }
      }
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  remove(fruit: string): void{
    const index = this.hashtag.indexOf(fruit);
    if (index >= 0){
      this.hashtag.splice(index, 1);
    }
  }

  onDragDroppeduser($event: CdkDragEnd,i:any){
    this.videouploadformate[0].taggedUsers[i].x = $event.source.getFreeDragPosition().x;
    this.videouploadformate[0].taggedUsers[i].y = $event.source.getFreeDragPosition().y;
    // console.log(this.videouploadformate,"this.addphotos - data");
  }
  
  onDragDroppedproduct($event: CdkDragEnd,i:any){
    this.videouploadformate[0].taggedProducts[i].x = $event.source.getFreeDragPosition().x;
    this.videouploadformate[0].taggedProducts[i].y = $event.source.getFreeDragPosition().y;
    // console.log(this.videouploadformate,"this.addphotos - data");
  }
}