import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HashtagsDetailsService {

  constructor(private _HttpClient: HttpClient) { }

  getHashtagCounterAndFollowing(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/hashtag/getHashtagCounterAndFollowing`,data);
  }

  getAllHashtagDetail(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/hashtag/getAllHashtagDetail`,data);
  }

  getsinglehashtagdetail(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/hashtag/getSingleHashtagsDetail`,data)
  }

  followhashtags(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/hashtag/followHashtag`,data)
  }

  wishlistproduct(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/wishlist/addRemoveWishlist`,data);
  }

  bookmarkPostImage(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postImages/bookmarkPostImage`,data);
  }

  bookmarkPostVideo(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postVideo/bookmarkPostVideo`,data);
  }
  
  bookmarkPostBlog(bookmarkpost:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postBlog/bookmarkPostBlog`,bookmarkpost);
  }


}