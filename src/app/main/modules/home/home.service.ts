import { I } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SharedService } from '../../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private _HttpClient:HttpClient,private _SharedService:SharedService) {}

  getPostImageWiseTaggedProducts(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postImages/getPostsImageWiseTaggedDetail`,data);
  }

  getAllPostImages(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postImages/getAllPostImage`,data);
  }

  likeUnlikePostImages(likeuplikecount:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postImages/likeUnlikePostImage`,likeuplikecount);
  }

  addPostImageReport(reportinmg:any){
    return this._HttpClient.post(`${environment.apiUrl}/postImageReports/addPostImageReport`,reportinmg);
  }

  bookmarkPostImage(bookmarkpost:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postImages/bookmarkPostImage`,bookmarkpost);
  }

  muteAccount(mutedaccount:any){
    return this._HttpClient.patch(`${environment.apiUrl}/users/muteAccount`, mutedaccount);
  }

  getSinglePostImages(singlepost:any){
    return this._HttpClient.post(`${environment.apiUrl}/postImages/getSinglePostImage`, singlepost);
  }

  followAccount(followdata:any){
    return this._HttpClient.patch(`${environment.apiUrl}/users/followAccount`, followdata).pipe(map((res:any)=>{
      if(res.status == 200){
        if(followdata.isFollowing) this._SharedService.emit("user-follow",followdata);
        return res;
      }
    }))
  }

  postImageComments(postcomment:any){
    return this._HttpClient.post(`${environment.apiUrl}/postImageComments/addPostImageComment`, postcomment);
  }
  
  getPostImageAllComments(allcomments:any){
    return this._HttpClient.post(`${environment.apiUrl}/postImageComments/getPostImageAllComments`, allcomments);
  }

  commentLikeUnlike(commentLikeun:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postImageComments/commentLikeUnlike`,commentLikeun);
  }

  deleteComment(deletecomment:any){
    return this._HttpClient.post(`${environment.apiUrl}/postImageComments/deletePostImageComment`,deletecomment);
  }

  deleteSubComment(deleteSubcomment:any){
    return this._HttpClient.post(`${environment.apiUrl}/postImageSubComments/deletePostImageSubComment`,deleteSubcomment);
  }

  editComment(editcomment:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postImageComments/editPostImageComment`, editcomment);
  }

  addPostImageSubComment(subcomment:any){
    return this._HttpClient.post(`${environment.apiUrl}/postImageSubComments/addPostImageSubComment`, subcomment);
  }

  postImageSubCommentsgetall(SubCommentsget:any){
    return this._HttpClient.post(`${environment.apiUrl}/postImageSubComments/getCommentAllSubComments`, SubCommentsget);
  }

  commentLikeUnlikeinner(likeunlikeinner:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postImageSubComments/subCommentLikeUnlike`, likeunlikeinner);
  }
  
  editPostImageSubComment(editsubcomment:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postImageSubComments/editPostImageSubComment`, editsubcomment);
  }

  shopproduct(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/products/getProductSellerWise`,data);
  }

  wishlistproduct(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/wishlist/addRemoveWishlist`,data);
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

  getCoffeePriviledgeByInfluencerId(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/coffeePrivilege/getCoffeePriviledgeByInfluencerId`,data);
  }
}