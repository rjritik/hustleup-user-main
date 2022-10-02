import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const headers:any = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
});

// 'Authorization': 'Basic ' + btoa(`${environment.iThinkAccessToken}: ${environment.iThinksecretKey}`),

@Injectable({
  providedIn: 'root'
})
export class UserprofileService{

  constructor(private _HttpClient:HttpClient) { }
  
  getWishlistProduct(){
    return this._HttpClient.get(`${environment.apiUrl}/wishlist/getwishlist`);
  }

  wishlistproduct(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/wishlist/addRemoveWishlist`,data);
  }

  getBookmarkedPostImage(){
    return this._HttpClient.get(`${environment.apiUrl}/postImages/getBookmarkedPostImage`);
  }

  bookmarkPostImage(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postImages/bookmarkPostImage`,data);
  }
  
  getBookmarkedPostVideo(){
    return this._HttpClient.get(`${environment.apiUrl}/postVideo/getBookmarkedPostVideo`);
  }

  bookmarkPostVideo(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postVideo/bookmarkPostVideo`,data);
  }

  getBookmarkedPostBlog(){
    return this._HttpClient.get(`${environment.apiUrl}/postBlog/getBookmarkedPostBlog`);
  }

  bookmarkPostBlog(bookmarkpost:any){
    return this._HttpClient.patch(`${environment.apiUrl}/postBlog/bookmarkPostBlog`,bookmarkpost);
  }

  viewUserDetail(){
    return this._HttpClient.get(`${environment.apiUrl}/users/viewUserDetail`);
  }

  getAllPostImageOfUser(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postImages/getAllPostImageOfUser`,data);
  }

  getAllPostVideoOfUser(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postVideo/getAllPostVideoOfUser`,data);
  }

  getAllPostBlogOfUser(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/postBlog/getAllPostBlogOfUser`,data);
  }

  uploadprofilepic(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/users/editUserProfilePic`,data);
  }

  editprofile(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/users/editUserDetails`,data);
  }

  changePasswords(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/users/changePassword`,data);
  }
  
  deactivateAccount(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/users/deactivateAccount`,data);
  }

  // Store Details

  verifyIfscCode(ifscCode:any){
    return this._HttpClient.get(`https://ifsc.razorpay.com/${ifscCode}`);
  }
  
  checkPincode(pincode:any){
    return this._HttpClient.get(`${environment.apiUrl}/courierPartner/checkpincode/${pincode}`);
  }

  checkPostalPincode(data:any){
    return this._HttpClient.get(`${environment.postalPinUrl}pincode?postalcode=${data.pincode}&countrycode=${data.countrycode}`);
  }


  // iThinkStateList(data:any){
  //   return this._HttpClient.post(`${environment.iThunkApiUrl}/state/get.json`,data, headers);
  // }

  // iThinkCityList(data:any){
  //   return this._HttpClient.post(`${environment.iThunkApiUrl}/city/get.json`,data, headers);
  // }
  
  addBankDetail(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/bankDetails/addBankDetail`,data);
  }

  storescreate(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/stores/createStore`,data);
  }

  getStoreDetailsBySeller(){
    return this._HttpClient.get(`${environment.apiUrl}/stores/getStoreDetailsBySeller`);
  }

  getBankDetail(){
    return this._HttpClient.get(`${environment.apiUrl}/bankDetails/getBankDetail`);
  }

  updateStoreBusinessAddres(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/stores/updateStoreBusinessAddres`,data);
  }

  updateStorePickupAddres(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/stores/updateStorePickupAddres`,data);
  }

  // Brand-Details
  addBrand(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/brands/addBrand`,data);
  }

  getBrandDetailsBySeller(){
    return this._HttpClient.get(`${environment.apiUrl}/brands/getBrandDetailsBySeller`);
  }

  getStoreStatus(){
    return this._HttpClient.get(`${environment.apiUrl}/stores/getStoreStatus`);
  }

  findMenuCategory(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/menuCategory/findMenuCategory`,data);
  }

  findMenuSubCategory(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/menuSubCategory/findMenuSubCategory`,data);
  }

  findproductType(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/productType/findproductType`,data);
  }

  createNewMapLocation(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/map/createNewMapLocation`,data);
  }

  updateMapLocation(data:any){
    return this._HttpClient.put(`${environment.apiUrl}/map/updateMapLocation`,data);
  }

  verifySellerMap(){
    return this._HttpClient.get(`${environment.apiUrl}/map/verifySellerMap`);
  }

}
