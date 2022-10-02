import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailService {

  constructor(private _HttpClient: HttpClient) { }

  GetSingleProduct(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/products/getSingleProduct`, data);
  }

  addtocart(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/cart/addToCart`, data);
  }

  getcartlist(){
    return this._HttpClient.get(`${environment.apiUrl}/cart/getAllCart`);
  }

  likeUnlikeProduct(likeunlike:any){
    return this._HttpClient.patch(`${environment.apiUrl}/products/likeUnlikeProduct`,likeunlike);
  }

  wishlistproduct(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/wishlist/addRemoveWishlist`,data);
  }

  commentLikeUnlikeinner(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/productSubComment/subCommentLikeUnlike`, data);
  }

  addProductComment(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/productComment/addProductComment`, data);
  }

  getProductAllComment(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/productComment/getProductAllComment`, data);
  }

  editProductComment(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/productComment/editProductComment`, data);
  }

  commentLikeUnlike(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/productComment/commentLikeUnlike`, data);
  }

  deleteProductComment(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/productComment/deleteProductComment`, data);
  }

  addProductSubComment(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/productSubComment/addProductSubComment`, data);
  }  

  getProductAllSubComment(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/productSubComment/getCommentsAllSubComment`, data);
  }

  getSingleSubComment(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/productSubComment/getSingleSubComment`, data);
  }
  
  editProductSubComment(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/productSubComment/editProductSubComment`, data);
  }

  subCommentLikeUnlike(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/productSubComment/subCommentLikeUnlike`, data);
  }

  deleteProductSubComment(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/productSubComment/deleteProductSubComment`, data);
  }

  getProductSingleComment(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/productComment/getProductSingleComment`, data);
  }

  addproductreport(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/productReport/addProductReport`,data)
  }

  getsimilarproduct(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/products/getListOfSimilarProduct`,data)
  }

  checkDeliveryAvailability(data:any){
    return this._HttpClient.get(`${environment.apiUrl}/courierPartner/getRate?sellerPincodeList=${data.sellerPincodeList}&to_pincode=${data.to_pincode}&payment_method=${data.payment_method}`)
  }

}