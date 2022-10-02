import { Component, ElementRef, OnInit, TemplateRef, ViewChild,Renderer2} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips/chip-input';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { SharedService } from '../../shared/shared.service';
import { BloguploadserviceService } from '../blogs/bloguploadservice.service';
import { getParamByISO } from 'iso-country-currency';
import { AuthenticationService } from '../../auth/service/authentication.service';
declare const $: any;


@Component({
  selector: 'app-blogupload',
  templateUrl: './blogupload.component.html',
  styleUrls: ['./blogupload.component.css']
})
export class BloguploadComponent implements OnInit {
  public FroalaEditor = require('froala-editor');
  public myTitle: string;
  nextbackbtn:boolean = false;
  advancecatogaryinner = false;
  hashtag:any = [];
  addphotos:any = [];
  onSelectimages:any;
  content:any;
  BlogFormData:any = new FormData();
  productsearch:any;
  productsearchdata:any= [];
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');

  @ViewChild('hashtagInput') hashtagInput: ElementRef<HTMLInputElement>;

  constructor(private _BloguploadserviceService:BloguploadserviceService, 
              private _SharedService:SharedService,
              private imageCompress: NgxImageCompressService,
              private _Router:Router,
              private dialog: MatDialog,
              private sanitizer:DomSanitizer,
              private renderer: Renderer2,
              private _AuthenticationService:AuthenticationService){ }
  @ViewChild('secondDialog', { static: true}) secondDialog: TemplateRef<any>;

  titleprods:any = new FormGroup({
    producttitle: new FormControl(undefined,[Validators.required]),
    advancecategories: new FormControl(undefined,[Validators.required])
  });

  ngOnInit(): void {

    // Define an icon.
    this.FroalaEditor.DefineIcon('imageIcon', {SRC: 'assets/images/icons/products.svg', ALT: 'Image button', template: 'image', innerHeight:'28px', outerHeight:'28px'});

    // Define a button.
    this.FroalaEditor.RegisterQuickInsertButton('insertProduct', {
      // Icon name.
      icon: 'imageIcon',

      // Tooltip.
      title: 'Insert Product',

      // Callback for the button.
      callback: () => {
        this.dialogOpen();
      },

      // Save changes to undo stack.
      undo: true
    })
  }

  public titleOptions:any = {
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: false,
    toolbarInline: true,
    quickInsertButtons:['insertProduct', 'image', 'embedly', 'ul', 'ol', 'paragraphFormat'],
    toolbarButtons:['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', '|', 'paragraphStyle', 'paragraphFormat', 'align', 'undo', 'redo', 'html']
  }

  nextblogupload(){
    if(this.content !== undefined){
      this.nextbackbtn = true;
    }else{
      this._SharedService.errorToast("Please SaveBlog First.")
    }
  }

  dialogOpen(){
    this.dialog.open(this.secondDialog,{
      width: '600px'
    });
  }

  Backblogupload(){
    this.nextbackbtn = false;
  }

  saveblog(){
    this.content = this.myTitle
  }

  PublishBlog(){
    if(this.addphotos.length !== 0 && this.onSelectimages !== undefined){
      if(this.titleprods.valid){
        this.BlogFormData.append('content', this.content);
        this.BlogFormData.append('coverImg',this.onSelectimages);
        this.BlogFormData.append('description',this.titleprods.value.producttitle);
        this.BlogFormData.append('hashtags',JSON.stringify(this.hashtag));
        this.BlogFormData.append('advanceCategory',this.titleprods.value.advancecategories);
        this._BloguploadserviceService.blogupload(this.BlogFormData).subscribe((res:any)=>{
          if(res.status == 200){
            this._SharedService.successToast(res.message)
            this.Bloguploadformdatadelete()
            this._Router.navigate(['/blog'])
          }
          if(res.status == 500){
            this._SharedService.errorToast(res.message)
            this.Bloguploadformdatadelete()
          }
        });
      }else{
        this.titleprods.markAllAsTouched();
      }
    }else{
      this._SharedService.errorToast("CoverImage Required.");
    }
  }

  Bloguploadformdatadelete(){
    this.BlogFormData.delete('content');
    this.BlogFormData.delete('coverImg');
    this.BlogFormData.delete('description');
    this.BlogFormData.delete('hashtags');
    this.BlogFormData.delete('advanceCategory');
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if ((value || '').trim()) {
      if (this.hashtag.length < 10) {
        const hashtag = value.replace(/#/g, '').trim();
        const hashtaginclude = '#' + hashtag.replace(/\s/g, '');
        let result = this.hashtag.filter((o1:any) => [hashtaginclude].some(o2 => o1 == o2));
        if(result.length === 0){
          this.hashtag.push(hashtaginclude);
        }else{
          this._SharedService.errorToast("already use hashtag");
        }
      } else {
        this.hashtag.splice(-1);
        const hashtag = value.replace(/#/g, '').trim();
        const hashtaginclude = '#' + hashtag.replace(/\s/g, '');
        let result = this.hashtag.filter((o1:any) => [hashtaginclude].some(o2 => o1 == o2));
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

  remove(fruit: string): void {
    const index = this.hashtag.indexOf(fruit);
    if (index >= 0) {
      this.hashtag.splice(index, 1);
    }
  }

  // blog single images
  onSelectFileimages(){
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

  removecoverimg(){
    this.addphotos = "";
  }

  productIframe(){}

  getProduct(value:any){
    if(value.trim() != ''){
      const data = {
        pattern:value.trim()
      };
      this._BloguploadserviceService.getProductList(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.productsearchdata = res.data;
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
    const productId:any = `${this._Router['location']._platformLocation.location.origin}/embed/${btoa(productdata._id)}`
    var d1 = document.getElementsByClassName('fr-element');
      if(this.myTitle != undefined){
        const p: HTMLParagraphElement = this.renderer.createElement('p');
        p.innerHTML = `<iframe src="${productId}" width="320" height="425" frameborder="0"></iframe><p><br></p>`;
        this.renderer.appendChild(d1[0], p);
      }else{
        var child = d1[0].lastElementChild; 
        while (child){
          d1[0].removeChild(child);
                child = d1[0].lastElementChild;
        }
        const p: HTMLParagraphElement = this.renderer.createElement('div');
        p.innerHTML = `<iframe src="${productId}" width="320" height="425" frameborder="0"></iframe><p><br></p>`;
        this.renderer.appendChild(d1[0], p);
      }
      this.dialog.closeAll();
  };
}