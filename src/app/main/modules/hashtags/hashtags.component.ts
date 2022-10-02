import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { HashtagsDetailsService } from '../hastags-details/hashtags-details.service';

@Component({
  selector: 'app-hashtags',
  templateUrl: './hashtags.component.html',
  styleUrls: ['./hashtags.component.css']
})
export class HashtagsComponent implements OnInit {
  hashtagsList:any=[];
  pageNo:number = 1;
  limit:number = 10;
  windowOnScroll:boolean = true;
  totalDocs = 0;
  SlideOptionsproduct:any = {nav:false, items: 1, loop:false,margin:5, responsive: {
    0: {
      items: 1,
      nav: true
    },
    600: {
      items: 3,
      nav: true
    },
    1000: {
      items: 6,
      nav: true,
      loop: false
    },
    1500: {
      items: 7,
      nav: true,
      loop: false
    }
  }};

  constructor(private _HashtagsDetailsService:HashtagsDetailsService,private _SharedService:SharedService,private router:Router) { }

  ngOnInit(): void {
    this.GetAllHashtags(this.pageNo,this.limit);
  }

  GetAllHashtags(page:any, limit:any){
    const data = {
      trendingHashtag:'',
      page:page, 
      limit:limit
    }
    this._HashtagsDetailsService.getAllHashtagDetail(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.totalDocs = res.totalDocs
        if(this.pageNo === 1){
          this.hashtagsList = res.data;
        }else{
          this.hashtagsList = [...this.hashtagsList, ...res.data];
        }
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  hashtagname(item:any){
    const itm =window.btoa(JSON.stringify(item));
    localStorage.setItem("hasgtagsdetail",itm);
    this.router.navigate(['/hashtags-details']);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(){
    if(!this.windowOnScroll){
        var docElement = $(document)[0].documentElement;
        var winElement = $(window)[0];
        if ((docElement.scrollHeight - winElement.innerHeight) == winElement.pageYOffset) {
          if(this.hashtagsList.length !== this.totalDocs){
            this.GetAllHashtags(this.pageNo += 1, this.limit);
          }
        }
    }else{
      this.windowOnScroll = false;
    }
  }
}
