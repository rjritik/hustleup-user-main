import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private _HttpClient:HttpClient) { }

  getAllPostsList(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/users/getAllPostsListOfUsers`,data);
  }
}
// http://localhost:5000/postImageComments/getPostImageAllComments --postImageId: "62395ac872f90619ac5aa7b3"
// http://localhost:5000/postVideoComments/getPostVideoAllComments --postVideoId: "62469618a0d0d90c48346e30"}
// http://localhost:5000/postBlogComment/getPostBlogAllComment ---postBlogId: "624e6684defa7e0cf0c93225"}
// http://localhost:5000/productComment/getProductAllComment --{productId: "620249dc570af90f74970aa9"}



// for reply
// http://localhost:5000/postImageSubComments/getCommentAllSubComments ---postImageCommentId: "62d796741e14543168c9b9cb"
// http://localhost:5000/postVideoSubComments/getCommentAllSubComments --postVideoCommentId: "6247e1df4b86c2167441f0dd"
// http://localhost:5000/postBlogSubComment/getCommentsAllSubComment --postBlogCommentId: "625408959148721c7024ac02"
//                                                                     ----productCommentId