import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import * as moment from 'moment';
import { ImagesuploadService } from './imagesupload.service';
import { SharedService } from '../../shared/shared.service';
import { PostImageService } from '../../store/effects/home/post-image.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips/chip-input';
import { Observable } from 'rxjs/internal/Observable';
import { StyleRenderer, lyl, WithStyles } from '@alyle/ui';
import { ImgCropperConfig, ImgCropperEvent, LyImageCropper, ImgCropperErrorEvent, ImgCropperLoaderConfig } from '@alyle/ui/image-cropper';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from '../../auth/service/authentication.service';
declare let $ :any;
declare let modal:any;

const STYLES = () => ({
  cropper: lyl `{
    width: 375px
    height: 500px
  }`,
  sliderContainer: lyl `{
    text-align: center
    width: 375px
    margin: 14px
  }`
});

@Component({
  selector: 'app-imagesupload',
  templateUrl: './imagesupload.component.html',
  styleUrls: ['./imagesupload.component.css'],
  providers: [
    StyleRenderer
  ]
})
export class ImagesuploadComponent implements OnInit {
  userserachbarreference = false;
  imagesuploadsection = true;
  imagesuploadtitle = false;
  tagprod = false;
  advancecatogaryinner = true;
  addphotos:any = [];
  previewmain:any;
  activeindex:any = 0;
  timeselect:any = Array<Select2OptionData>();
  Schedulelater:boolean = false;
  minFromDate = new Date();
  maxToDate = new Date().setDate(2);
  multiplefile:any = [];
  formdataimg = new FormData();
  usersearch:any;
  usersearchdata:any = [];
  getAllSchedulePostImage:any = [];
  ngselect:any = true;
  pushimage:any=[];
  productsearch:any;
  productsearchdata:any=[];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  HashtagCtrl = new FormControl();
  filteredHashtags: Observable<string[]>;
  hashtag:string[] = [];
  cropimagereturn:any = false;
  productremoveindex:any;

  // images upload data
  classes = this.sRenderer.renderSheet(STYLES);
  croppedImage?: string;
  scale: any;
  ready: boolean;
  minScale: number;
  step: string;
  @ViewChild(LyImageCropper) cropper: LyImageCropper;
  myConfig: ImgCropperConfig = {
    // autoCrop: true,
    width: 375, // Default `250`
    height: 500, // Default `200`
    fill: '#ff2997', // Default transparent if type == png else #000
    type: 'image/png', // Or you can also use `image/jpeg`
    responsiveArea: true
  };
  originalDataURLStore:any;

  // finalImageList: any = [];

  // allHashtag:string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('hashtagInput') hashtagInput: ElementRef<HTMLInputElement>;
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');

  constructor(private _PostImageService:PostImageService ,private _ImagesuploadService:ImagesuploadService, private SharedService:SharedService,private imageCompress: NgxImageCompressService, private _AuthenticationService:AuthenticationService,  readonly sRenderer: StyleRenderer){
    // this.filteredHashtags = this.HashtagCtrl.valueChanges.pipe(
    //   startWith(null),s
    //   map((hashtag: string | null) => (hashtag ? this._filter(hashtag) : this.allHashtag.slice())),
    // );
  }
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
    this._ImagesuploadService.getAllSchedulePostImage().subscribe((res:any)=>{
      this.getAllSchedulePostImage = res.data;
      console.log(this.getAllSchedulePostImage);
    },(err=>{
      this.SharedService.errorToast(err);
    }));
  };
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
  };
  userreference(){
    this.userserachbarreference = true;
    this.tagprod = false;
  };
  tagprodreference(){
    this.tagprod = true;
    this.userserachbarreference = false;
  };
  usersearchclose(){
    this.userserachbarreference = false;
    this.tagprod = false;
  };
  productsearchclose(){
    this.userserachbarreference = false;
    this.tagprod = false;
  };
  async addphotonextbtn(){
    if(this.addphotos.length > 0){
      this.imagesuploadtitle = true;
      this.imagesuploadsection = false;
    }else{
      this.SharedService.errorToast("min 1 photos required");
    }
    if(this.cropimagereturn == true){
      this.cropper.crop();
    }else{
      this.cropimagereturn = false;
    }
    await setTimeout(() => {
      this.cropimagereturn = false;
      const config: ImgCropperLoaderConfig = {
        scale: 0.745864772531767,
        // xOrigin: 642.380608078103,
        // yOrigin: 236.26357452128866,
        // areaWidth: 100,
        // areaHeight: 100,
        rotation: 0,
        originalDataURL:this.originalDataURLStore,
      };
      this.cropper.loadImage(config);
    }, 100);
    // crop - images method
    // if(this.cropimagereturn == true){
    //   this.cropper.crop();
    // }
    // await setTimeout(() => {
    //   this.cropimagereturn = false;
    //   const config: ImgCropperLoaderConfig = {
    //     scale: 0.745864772531767,
    //     // xOrigin: 642.380608078103,
    //     // yOrigin: 236.26357452128866,
    //     // areaWidth: 100,
    //     // areaHeight: 100,
    //     rotation: 0,
    //     originalDataURL: e[indexs].file,
    //   };
    //   this.cropper.loadImage(config);
    // }, 100);
  };
  async imagestitlesectionbackbtn(){
    this.imagesuploadsection = true;
    this.imagesuploadtitle = false;

    if(this.cropimagereturn == true){
      this.cropper.crop();
    }
    await setTimeout(() => {
      this.cropimagereturn = false;
      const config: ImgCropperLoaderConfig = {
        scale: 0.745864772531767,
        // xOrigin: 642.380608078103,
        // yOrigin: 236.26357452128866,
        // areaWidth: 100,
        // areaHeight: 100,
        rotation: 0,
        originalDataURL:this.originalDataURLStore,
      };
      this.cropper.loadImage(config);
    }, 100);
  };
  onSelectFile(event:any){
    if(event.target.files && event.target.files[0]){
      var filesAmount = event.target.files.length;
      if(event.target.files.length <= 10){
        for(let i = 0; i < filesAmount; i++){
            if(this.multiplefile.length < 10){
              this.multiplefile.push(event.target.files[i]); 
            }
            const reader = new FileReader();
            reader.onload = (events:any) => {
              if (this.addphotos.length < 10){
                if (this.addphotos.length < 1){
                  const config: ImgCropperLoaderConfig = {
                    scale: 0.745864772531767,
                    rotation: 0,
                    originalDataURL: events.target.result,
                  };
                  this.cropper.loadImage(config);
                  this.previewmain = {
                    "file":events.target.result
                  };
                };
                const obj = {
                  file:events.target.result,
                  taggedUsers:[],
                  taggedProducts:[],
                }
                this.addphotos.push(obj);
              };
            };
            reader.readAsDataURL(event.target.files[i]);
        }
      }
    }
  };
  dataURLtoFile(dataurl:any,filename:any){
    var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), 
    n = bstr.length, 
    u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  };
  // onSelectFile() {
  //   this.imageCompress.uploadMultipleFiles().then((SelectedMultiFiles: UploadResponse[]) => {
  //     const length = SelectedMultiFiles.length+this.addphotos.length
  //     if(length <= 10){
  //       for (let i = 0; i < SelectedMultiFiles.length; i++) {
  //         this.imageCompress.compressFile(SelectedMultiFiles[i].image,SelectedMultiFiles[i].orientation).then((compressedImage) => {
  //           let file = this.dataURLtoFile(compressedImage,`AddProductPhotos${i}`);
  //            console.log(file, "after file - formate");
  //            if(file.size < 943718){
  //             this.pushimage.push(compressedImage)
  //             this.previewmain = {"file":this.pushimage[0]};
  //             const obj = {
  //               file:compressedImage,
  //               taggedUsers:[],
  //               taggedProducts:[],
  //             }
  //             this.addphotos.push(obj);
  //            this.multiplefile.push(file)
  //            }else{
  //              this.SharedService.errorToast("File too Big, please select a file less than 15mb")
  //            }
  //         })
  //       }
        
  //     }
  //   });
  // }
  async imagesdata(e:any,indexs:any){
    if(this.cropimagereturn == true){
      this.cropper.crop();
    }
    await setTimeout(() => {
      this.cropimagereturn = false;
      const config: ImgCropperLoaderConfig = {
        scale: 0.745864772531767,
        // xOrigin: 642.380608078103,
        // yOrigin: 236.26357452128866,
        // areaWidth: 100,
        // areaHeight: 100,
        rotation: 0,
        originalDataURL: e[indexs].file,
      };
      this.originalDataURLStore = e[indexs].file;
      this.cropper.loadImage(config);
      this.previewmain = e[indexs];     
      this.activeindex = indexs;
    }, 100);
  };
  scheduled(f:any){
    if(f.valid){
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
        const addphototagg:any = []
          this.addphotos.map((data:any,i:any)=>{
            const datas = {
                no:i,
                taggedProducts:data.taggedProducts.map((item:any)=>{return {productId:item.productId,x:item.x,y:item.y}}),
                taggedUsers:data.taggedUsers.map((item:any)=>{ return {userId: item.userId,x:item.x,y:item.y}})
              }
            addphototagg.push(datas);
          });
          this.formdataimg.append('isScheduled','true');
          this.formdataimg.append('scheduledDate',scheduledate);
          this.formdataimg.append('postTitle',this.titleprods.value.producttitle);
          this.formdataimg.append('hashtags',JSON.stringify(this.hashtag));
          this.formdataimg.append('advanceCategory',this.titleprods.value.advancecategories);
          const datas = []
          for(let item of addphototagg){
            const data = JSON.stringify(item);
            datas.push(data);
          }
          this.formdataimg.append('tags',JSON.stringify(datas));
          for(let item of this.multiplefile){
            this.formdataimg.append('images',item)
          }
          this._ImagesuploadService.imagesupload(this.formdataimg).subscribe(res=>{
            const response:any = res;
            this.formdataimg.delete('isScheduled');
            this.formdataimg.delete('scheduledDate');
            this.formdataimg.delete('postTitle');
            this.formdataimg.delete('hashtags');
            this.formdataimg.delete('advanceCategory');
            this.formdataimg.delete('tags');
            this.formdataimg.delete('images');
            this.previewmain = null;
            this.addphotos = [];
            this.SharedService.successToast(response.message);
            this.titleprods.reset();
            this.Scheduledposts.reset();
            this._ImagesuploadService.getAllSchedulePostImage().subscribe((res:any)=>{
            this.getAllSchedulePostImage = res.data;
            this.imagesuploadtitle = false;
            this.imagesuploadsection = true;
            },(err=>{
              this.SharedService.errorToast(err);
            }));
            },(err=>{
              this.SharedService.errorToast(err);
            }));
        this.Schedulelater = false;
    }else if(!this.Scheduledposts.valid){
      this.Scheduledposts.markAllAsTouched();
    }
  };
  publishlater(fs:any){
    if (fs.valid){
      this.Schedulelater = true;
      $('.modal#publishlaters').modal('show');
      $('.modal#publishlaters').modal({
        backdrop: 'static',
        keyboard: true
      });
    }else{
      this.titleprods.markAllAsTouched();
    }
  };
  displayTags(event:any){
    // event.forEach((element:any) => {
    //   this.hashtag.push('#'+element)
    //   console.log(this.hashtag,"event - displayTags");
    // });
  };
  publishnow(fs:any){
    if(fs.valid){
      const addphototagg:any = [];
      this.addphotos.map((data:any,i:any)=>{
        const datas = {
            no:i,
            taggedProducts:data.taggedProducts.map((item:any)=>{return {productId:item.productId,x:item.x,y:item.y}}),
            taggedUsers:data.taggedUsers.map((item:any)=>{ return {userId: item.userId,x:item.x,y:item.y}})
          }
          addphototagg.push(datas);
        });
        this.formdataimg.append('isScheduled','false');
        this.formdataimg.append('postTitle',this.titleprods.value.producttitle);
        this.formdataimg.append('hashtags',JSON.stringify(this.hashtag));
        this.formdataimg.append('advanceCategory',this.titleprods.value.advancecategories);
        const datas = []
        for(let item of addphototagg){
          const data = JSON.stringify(item);
          datas.push(data);
        }
        this.formdataimg.append('tags',JSON.stringify(datas));  
        for(let item of this.multiplefile){
          this.formdataimg.append('images',item);
        }
        // this._PostImageService.addPostImage(this.formdataimg);
        this._ImagesuploadService.imagesupload(this.formdataimg).subscribe((res:any)=>{
        const response:any = res;
        this.hashtag = [];
        this._PostImageService.addPostImage(res.data);
        this.formdataimg.delete('isScheduled');
        this.formdataimg.delete('scheduledDate');
        this.formdataimg.delete('postTitle');
        this.formdataimg.delete('hashtags');
        this.formdataimg.delete('advanceCategory');
        this.formdataimg.delete('tags');
        this.formdataimg.delete('images');
        this.previewmain = null;
        this.addphotos = [];
        this.hashtag = [];
        this.SharedService.successToast("post created");
        this.titleprods.reset();
        this.Scheduledposts.reset();
        this._ImagesuploadService.getAllSchedulePostImage().subscribe((res:any)=>{
          this.getAllSchedulePostImage = res.data;
          this.imagesuploadtitle = false;
          this.imagesuploadsection = true;
        },(err=>{
          this.SharedService.errorToast(err);
        }));
      },(error)=>{
        this.SharedService.errorToast(error.message);
      });
    }else{
      this.titleprods.markAllAsTouched();
    }
  };
  cancelschedule(){
    $('.modal#publishlaters').modal('hide');
    $('.modal#publishlaters').modal({
      backdrop: 'static',
      keyboard: false
    });
    this.Schedulelater = false;
  };
  getUsers(){
    if(this.usersearch.trim() != ''){
      this.usersearchdata = [];
      const data = {
        pattern:this.usersearch.trim()
      };
      this._ImagesuploadService.getUsersList(data).subscribe(res=>{
        const response:any = res;
        const a = this.addphotos[this.activeindex].taggedUsers.map((item:any)=>{
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
  getProduct(){
    if(this.productsearch.trim() != ''){
      this.productsearchdata = [];
      const data = {
        pattern:this.productsearch.trim()
      };
      this._ImagesuploadService.getProductList(data).subscribe((res:any)=>{
        if(res.status == 200){
          const a = this.addphotos[this.activeindex].taggedProducts.map((item:any)=>{
            return item.productId;
          });
          res.data.map((item:any)=>{
            if(a.includes(item._id)){
            } else {
              this.productsearchdata.push(item);
            }
          });
        }
        if(res.status == 500){
          this.SharedService.errorToast(res.message)
        }
        if(res.status == 401){
          this.SharedService.errorToast(res.message)
        }
      });
    };
  };
  taguserdata(data:any){
    const datas = {
        userId:data._id,
        username:data.username,
        fullName:data.fullName,
        x:0,
        y:0,
    };
    const index = this.activeindex
    this.addphotos[index].taggedUsers.push(datas);
    this.previewmain = this.addphotos[index];
    this.userserachbarreference = false;
    this.usersearch = "";
    this.usersearchdata = "";
  };
  tagproductdata(productdata:any){
    const datas = {
      productId:productdata._id,
      productName:productdata.productName,
      variations:productdata.variations,
      x:0,
      y:0,
    };
    const index = this.activeindex
    this.addphotos[index].taggedProducts.push(datas);
    this.previewmain = this.addphotos[index];
    this.tagprod = false;
    this.productsearch = "";
    this.productsearchdata = "";
  };
  PublishNowSchedulePost(e:any){
    const data = {
      "postId":e
    }
    this._ImagesuploadService.publishNowPostImage(data).subscribe(res=>{
      const response:any = res;
      this.SharedService.successToast(response.message);
      this._ImagesuploadService.getAllSchedulePostImage().subscribe((res:any)=>{
        this.getAllSchedulePostImage = res.data;
      },(err=>{
        this.SharedService.errorToast(err);
      }));
    },(error=>{
      this.SharedService.errorToast(error);
    }));
  };
  CancelSchedulePost(e:any){
    const data = {
      "postId":e
    }
    this._ImagesuploadService.deletePostImage(data).subscribe(res=>{
      const response:any = res;
      this.SharedService.successToast(response.message);
      this._ImagesuploadService.getAllSchedulePostImage().subscribe((res:any)=>{
        this.getAllSchedulePostImage = res.data;
      },(err=>{
        this.SharedService.errorToast(err);
      }));
    },(e=>{
      this.SharedService.errorToast(e);
    }));
  };
  SlideOptions = {nav:false, items: 1, loop:false};
  add(event: MatChipInputEvent): void {
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
            this.SharedService.errorToast("already use hashtag");
          }
        }else{
        this.hashtag.splice(-1);
        const hashtag = value.replace(/#/g, '').trim();
        const hashtaginclude = '#' + hashtag.replace(/\s/g, '');
        let result = this.hashtag.filter(o1 => [hashtaginclude].some(o2 => o1 == o2));
        if(result.length === 0){
          this.hashtag.push(hashtaginclude);
        }else{
          this.SharedService.errorToast("already use hashtag");
        }
      }
    }

    // Clear the input value
    event.chipInput!.clear();
    this.HashtagCtrl.setValue(null);
  };
  remove(fruit: string): void{
    const index = this.hashtag.indexOf(fruit);
    if (index >= 0){
      this.hashtag.splice(index, 1);
    }
  };

  removeImages(index:any){
    this.productremoveindex = index;
  };

  async removeproduct(){
    this.addphotos.splice(this.productremoveindex,1);
    this.multiplefile.splice(this.productremoveindex,1);
    await setTimeout(() => {
      if(this.productremoveindex != 0){
        if(this.productremoveindex === this.activeindex){
          $( "#"+ this.productremoveindex ).trigger("click");
        }
      }else if(this.productremoveindex == 0){
        if(this.productremoveindex === this.activeindex){
          $( "#"+ this.productremoveindex).trigger("click");
        }
      }
    }, 100);
  }
  // selected(event: MatAutocompleteSelectedEvent): void {
  //   if (this.hashtag.length < 10) {
  //     const hashtag = event.option.viewValue.replace(/#/g, '').trim();
  //     this.hashtag.push('#' + hashtag.replace(/\s/g, ''));
  //   } else {
  //     this.hashtag.splice(-1);
  //     const hashtag = event.option.viewValue.replace(/#/g, '').trim();
  //     this.hashtag.push('#' + hashtag.replace(/\s/g, ''));
  //   }
  //   this.hashtagInput.nativeElement.value = '';
  //   this.HashtagCtrl.setValue(null);
  // }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.allHashtag.filter((Hashtag:any) => Hashtag.toLowerCase().includes(filterValue));
  // }
  cropimages(){
    this.cropimagereturn = !this.cropimagereturn;
    setTimeout(() => {
      this.cropper.center();
    }, 10);
  };
  onCropped(e: ImgCropperEvent){
    this.croppedImage = e.dataURL;
    const imageName = `${new Date().getTime()}.png`;
    const imageBlob = this.dataURItoBlob(e.dataURL);
    const imageFile = new File([imageBlob], imageName);
    this.originalDataURLStore = this.croppedImage;

    // ------------ New croped file -------------------
    this.multiplefile[this.activeindex] = imageFile;
    this.addphotos[this.activeindex].file = e.dataURL;
    this.cropimagereturn = false;
  };
  onLoaded(e: ImgCropperEvent){
    console.log('img loaded', e);
  };
  onError(e: ImgCropperErrorEvent){
    console.warn(`'${e.name}' is not a valid image`, e);
  };
  dataURItoBlob(dataURI: any){
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++){
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };
  onDragDroppeduser($event: CdkDragEnd,i:any){
    this.addphotos[this.activeindex].taggedUsers[i].x = $event.source.getFreeDragPosition().x;
    this.addphotos[this.activeindex].taggedUsers[i].y = $event.source.getFreeDragPosition().y;
  }
  
  onDragDroppedproduct($event: CdkDragEnd,i:any){
    this.addphotos[this.activeindex].taggedProducts[i].x = $event.source.getFreeDragPosition().x;
    this.addphotos[this.activeindex].taggedProducts[i].y = $event.source.getFreeDragPosition().y;
  }
}