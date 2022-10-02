import { Injectable } from '@angular/core';
import {  Observable, Subject,BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2'
import { io } from "socket.io-client";
import { AuthenticationService } from '../auth/service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  socket:any;
  private minimizepop = new Subject<any>();
  private userdetail = new Subject<any>();
  private quotedetail = new Subject<any>();
  shoppingcart = new Subject<any>();
  isSelectedAddress = new Subject<any>();

  toastMixin = Swal.mixin({
    toast: true,
    icon: 'success',
    title: 'General Title',
    // animation: false,
    position: 'top-right',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });
  
  constructor(private _authentication:AuthenticationService) { }

  //--------------------- socket start----------------------------------------------

  setupSocketConnection() {
    const currentUserValue:any = localStorage.getItem('currentUser');
      if (currentUserValue != null) {
      this.socket = io(`${environment.apiUrl}`, { query: { token: this._authentication.currentUserValue.token } });
      

      this.socket.on('connect', () => {
        console.log('success', 'Socket Connected!');
      });

      this.socket.on('disconnect', () => {
          console.log('error', 'Socket Disconnected!');
      });


    }
  }
  // receive_message
  listen(eventName: string) {
    return new Observable((Subscriber) => {
      this.socket.on(eventName, (data: any) => {
        Subscriber.next(data);
      });
    });
  }
  emit(eventName: any, data: any) {
      this.socket.emit(eventName, data);
  }

  //--------------------- socket End----------------------------------------------

  minimizeres(message: string) {
    this.minimizepop.next({ text: message });
  }

  getminipop(): Observable<any> {
    return this.minimizepop.asObservable();
  }  
  // ----------------------createNew Message Observable start------------------
  
  setUserDetail(datail: any) {
    this.userdetail.next(datail);
  }

  getUserDetail(): Observable<any> {
    return this.userdetail.asObservable();
  } 
 // ----------------------createNew Message Observable End------------------


 // ----------------------queote Message Observable Start------------------

 setQuoteItem(data: any) {
  this.quotedetail.next(data);
}

getQuoteItem(): Observable<any> {
  return this.quotedetail.asObservable();
}

 // ----------------------queote Message Observable End------------------

  successToast(msg:any){
    this.toastMixin.fire({
      // animation: true,
      title: msg
    });
  }

  errorToast(msg:any){
    this.toastMixin.fire({
      title: msg,
      icon: 'error'
    });
  }
  InfoToast(msg:any){
    this.toastMixin.fire({
      title: msg,
      icon: 'info'
    });
  }


/* ----------  cartlist start  ----------------*/
  private cartlist = new BehaviorSubject<any>(undefined)
  GetCartListLength = this.cartlist.asObservable()

  GetCart(CartListlength:any){
    this.cartlist.next(CartListlength)
  }

  /* ----------  cartlist End  ----------------*/

    /* ----------  cartrefresh Start ----------------*/
    public cartrefresh = new BehaviorSubject<any>('');
    GetCartRefresh = this.cartrefresh.asObservable()
  
    public SetCartRefresh(data:any){
      this.cartrefresh.next(data)
    }
    /* ----------  cartrefresh End  ----------------*/

    /* ----------  cartsidepopup start  ----------------*/
    private cartClick = new BehaviorSubject<any>(undefined);

    setCartSideBarOpen(data:any){
      this.cartClick.next(data);
    }

    getCartSidebarOpen():Observable<any>{
      return this.cartClick.asObservable();
    }
    /* ----------  cartsidepopup  End  ----------------*/


  /* ----------  ActiveListing Edit start  ----------------*/
  private editlist = new BehaviorSubject<any>(undefined)
  GetEditList = this.editlist.asObservable()

  GetEditListItem(data:any){
    this.editlist.next(data)
  }

  /* ----------  ActiveListing Edit End  ----------------*/

    /* ----------  LeftSidebarMobile - Start  ----------------*/
    private LeftSidebarMobile = new BehaviorSubject<boolean>(false)
    GetLeftSidebarMobile = this.LeftSidebarMobile.asObservable()
  
    GetLeftSidebar(data:any){
      this.LeftSidebarMobile.next(data)
    }
  
    /* ----------  LeftSidebarMobile - End  ----------------*/

    /* ----------  rightSidebarMobile - Start  ----------------*/
    private rightSidebarMobile = new BehaviorSubject<boolean>(false)
    getRightSidebarMobile = this.rightSidebarMobile.asObservable()
  
    getRightSidebar(data:any){
      this.rightSidebarMobile.next(data)
    }
  
    /* ----------  rightSidebarMobile - End  ----------------*/    

  public notify = new BehaviorSubject<any>('');

  notifyObservable$ = this.notify.asObservable();

  public notifyOther(data: any) {
    if (data) {
      this.notify.next(data);
    }
  }

  /* ----------  userprofiledata Start ----------------*/
  public userprofileid = new BehaviorSubject<any>(undefined);
  GetUserProfileId = this.userprofileid.asObservable()

  public SetUserprofileId(id:any){
    this.userprofileid.next(id)
  }
  /* ----------  userprofiledata End  ----------------*/

  /* ----------  ClearChatMemberSearched Start  ----------------*/
  private clearSearchedCM = new Subject();
  GetclearSearchedCM = this.clearSearchedCM.asObservable();

  SetclearSearchedCM(data:any){
    this.clearSearchedCM.next(data)
  }


  /* ----------  ClearChatMemberSearched End  ----------------*/

}