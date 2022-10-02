import { Component, OnInit } from '@angular/core';
import { getParamByISO } from 'iso-country-currency';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';
import { SharedService } from '../../../shared/shared.service';
import { CommentService } from './comment.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  private lastPostId:any='';
  private totalPostsCount:any;
  public postList:any=[];
  public activePostsBoolean:boolean = false;
  public activePostsDetail:any;

  // ---------searchPosts section start------------
  private postsSubject: Subject<string> = new Subject();
  searchPostsName:any="";
  searchedPostList:any=[];
  searchLastPostId:any='';
  searchTotalPostsCount:any;
  // ---------searchPosts section end------------

  postsSubjectUnsub$: Subscription; 
  subscriptions: Subscription[] = []
  currencyUnit:any = getParamByISO(this._AuthenticationService.currentUserValue.countryCode, 'currency');

  constructor(private _SharedService:SharedService, private _AuthenticationService:AuthenticationService,private _CommentService:CommentService) {
   }

  ngOnInit(): void {
    this.getPostsList(this.lastPostId);
    this.DebounceMethods();
    this.UnsubscribeMethod();
  }

  getPostsList(lastPostId:any){
    this.searchedPostList=[];
    this.searchLastPostId='';
    const data = {
      lastPostId
    }
    this._CommentService.getAllPostsList(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.totalPostsCount = res.data.totalPostsCount;
        if(this.lastPostId ==''){
          this.lastPostId = res.data.uploadedData.length > 0 ? res.data.uploadedData[res.data.uploadedData.length-1]._id : '';
          this.postList = res.data.uploadedData;
        }else{
          this.lastPostId = res.data.uploadedData.length > 0 ? res.data.uploadedData[res.data.uploadedData.length-1]._id : '';
          this.postList = [...this.postList,...res.data.uploadedData]; 
        }
      }else{
        this._SharedService.errorToast(res.message)
      }
    });
  }

  searchPosts(){ 
    this.lastPostId='';
    this.searchLastPostId='';
    if(this.searchPostsName ==''){
      this.getPostsList(this.lastPostId);
    }else{
      this.postsSubject.next(this.searchPostsName);
    }
  };

  DebounceMethods(){
    this.postsSubjectUnsub$ = this.postsSubject.pipe(debounceTime(500)).subscribe((postSearchTextValue:any) => {
      this.searchGetPostsList(this.searchLastPostId,postSearchTextValue);
   });
  };

  UnsubscribeMethod(){
    this.subscriptions.push(this.postsSubjectUnsub$);
  }

  searchGetPostsList(searchLastPostId:any,postSearchTextValue:any){
    this.postList=[]
    const data ={
      lastPostId:searchLastPostId,
      searchPattern:postSearchTextValue
    }
    this._CommentService.getAllPostsList(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.searchTotalPostsCount = res.data.totalPostsCount;
        if(this.searchLastPostId ==''){
          this.searchLastPostId = res.data.uploadedData.length > 0 ? res.data.uploadedData[res.data.uploadedData.length-1]._id : '';
          this.searchedPostList = res.data.uploadedData;
        }else{
          this.searchLastPostId = res.data.uploadedData.length > 0 ? res.data.uploadedData[res.data.uploadedData.length-1]._id : '';
          this.searchedPostList = [...this.searchedPostList,...res.data.uploadedData]; 
        }
      }else{
        this._SharedService.errorToast(res.message)
      }
    });
  }
  
  composemsg(){
    this._SharedService.minimizeres('truenew');
  }


  onScrollDown(){
    if(this.searchPostsName == ""){
      if (this.postList.length >= this.totalPostsCount) return
      this.getPostsList(this.lastPostId);
    }else{
      if (this.searchedPostList.length >= this.searchTotalPostsCount) return
      this.searchGetPostsList(this.searchLastPostId,this.searchPostsName);
    }
  };

  singlePostsDetail(item:any){
    if(this.activePostsDetail?._id !== item._id){
      this.activePostsBoolean = true;
      this.activePostsDetail = {...item,commentBox:true};
    }
  }

  totalCommentCount(params:any){
    if(this.activePostsDetail?._id == params.postId){
      if(params.type =='addComment') this.activePostsDetail.totalComments += 1;
      if(params.type =='deleteComment') this.activePostsDetail.totalComments -= 1;
    }
  }
}