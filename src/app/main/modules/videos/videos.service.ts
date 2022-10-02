import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  constructor(private _HttpClient:HttpClient) { }
  getPostsIVideoWiseTaggedProducts(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postVideo/getPostsIVideoWiseTaggedDetail`,data);
  }

  getAllPostVideo(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postVideo/getAllPostVideo`, data);
  }

  likeUnlikePostImages(likeuplikecount:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postVideo/likeUnlikePostVideo`,likeuplikecount);
  }

  addPostVideoReport(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postVideoReports/addPostVideoReport`,data);
  }

  bookmarkPostVideo(bookmarkpost:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postVideo/bookmarkPostVideo`,bookmarkpost);
  }

  muteAccount(mutedaccount:any){
    return this._HttpClient.patch(`${environment.apiUrl}/users/muteAccount`, mutedaccount);
  }

  getSinglePostVideo(singlepost:any){
    return this._HttpClient.post(`${environment.apiUrl}/postVideo/getSinglePostVideo`, singlepost);
  }

  postVideoComments(postcomment:any){
    return this._HttpClient.post(`${environment.apiUrl}/postVideoComments/addPostVideoComment`, postcomment);
  }
  
  getPostVideoAllComments(allcomments:any){
    return this._HttpClient.post(`${environment.apiUrl}/postVideoComments/getPostVideoAllComments`, allcomments);
  }

  commentLikeUnlike(commentLikeun:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postVideoComments/commentLikeUnlike`,commentLikeun);
  }

  deleteComment(deletecomment:any){
    return this._HttpClient.post(`${environment.apiUrl}/postVideoComments/deletePostVideoComment`,deletecomment);
  }

  deleteSubComment(deleteSubcomment:any){
    return this._HttpClient.post(`${environment.apiUrl}/postVideoSubComments/deletePostVideoSubComment`,deleteSubcomment);
  }

  editComment(editcomment:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postVideoComments/editPostVideoComment`,editcomment);
  }

  addPostVideoSubComment(subcomment:any){
    return this._HttpClient.post(`${environment.apiUrl}/postVideoSubComments/addPostVideoSubComment`,subcomment);
  }

  postVideoSubCommentsgetall(SubCommentsget:any){
    return this._HttpClient.post(`${environment.apiUrl}/postVideoSubComments/getCommentAllSubComments`,SubCommentsget);
  }

  commentLikeUnlikeinner(likeunlikeinner:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postVideoSubComments/subCommentLikeUnlike`, likeunlikeinner);
  }
  
  editPostVideoSubComment(editsubcomment:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postVideoSubComments/editPostVideoSubComment`, editsubcomment);
  }

  shopproduct(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/products/getProductSellerWise`,data);
  }

  wishlistproduct(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/wishlist/addRemoveWishlist`,data);
  }

  getCoffeePriviledgeByInfluencerId(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/coffeePrivilege/getCoffeePriviledgeByInfluencerId`,data);
  }

  addViewerIdToPostVideo(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postVideo/addViewerIdToPostVideo`,data)
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
}
