import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BloguploadserviceService {

  constructor(private _HttpClient:HttpClient){ }
  
  blogupload(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postBlog/addPostBlog`,data);
  }

  getAllBlog(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postBlog/getAllPostBlog`,data)
  }

  getSinglePostBlog(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postBlog/getSinglePostBlog`,data);
  }

  muteAccount(mutedaccount:any){
    return this._HttpClient.patch(`${environment.apiUrl}/users/muteAccount`, mutedaccount);
  }

  addPostBlogReport(reportblogdata:any){
    return this._HttpClient.post(`${environment.apiUrl}/postBlogReports/addPostBlogReport`,reportblogdata);
  }

  likeUnlikePostBlog(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postBlog/likeUnlikePostBlog`, data);
  }

  bookmarkPostBlog(bookmarkpost:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postBlog/bookmarkPostBlog`,bookmarkpost);
  }

  getInflucerStatus(){
    return this._HttpClient.get(`${environment.apiUrl}/influencerData/getInflucerStatus`);
  }

  addinfluencerdata(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/influencerData/addInfluencerData`,data);
  }

  productPromoteByInfluncer(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/promoteProduct/addPromoteProduct`,data);
  }

  shopproduct(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/products/getProductSellerWise`,data);
  }

  getCoffeePriviledgeByInfluencerId(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/coffeePrivilege/getCoffeePriviledgeByInfluencerId`,data);
  }
  // comment start

// getPostBlogAllComments
  getPostBlogAllComment(allcomments:any){ 
    return this._HttpClient.post(`${environment.apiUrl}/postBlogComment/getPostBlogAllComment`, allcomments);
  }

  // postBlogComments
  addPostBlogComment(postcomment:any){
    return this._HttpClient.post(`${environment.apiUrl}/postBlogComment/addPostBlogComment`, postcomment);
  }

  editComment(editcomment:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postBlogComment/editPostBlogComment`, editcomment);
  }

  commentLikeUnlike(commentLikeun:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postBlogComment/commentLikeUnlike`,commentLikeun);
  }

  postBlogSubCommentsgetall(SubCommentsget:any){
    return this._HttpClient.post(`${environment.apiUrl}/postBlogSubComment/getCommentsAllSubComment`,SubCommentsget);
  }
  
  addPostBlogSubComment(subcomment:any){
    return this._HttpClient.post(`${environment.apiUrl}/postBlogSubComment/addPostBlogSubComment`, subcomment);
  }

  deleteComment(deletecomment:any){
    return this._HttpClient.post(`${environment.apiUrl}/postBlogComment/deletePostBlogComment`,deletecomment);
  }

  deleteSubComment(deleteSubcomment:any){
    return this._HttpClient.post(`${environment.apiUrl}/postBlogSubComment/deletePostBlogSubComment`,deleteSubcomment);
  }

  commentLikeUnlikeinner(likeunlikeinner:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postBlogSubComment/subCommentLikeUnlike`, likeunlikeinner);
  }
  
  // editPostImageSubComment
  editPostBlogSubComment(editsubcomment:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postBlogSubComment/editPostBlogSubComment`, editsubcomment);
  }

  getProductList(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/products/getProductListByPattern`,data);
  }
}