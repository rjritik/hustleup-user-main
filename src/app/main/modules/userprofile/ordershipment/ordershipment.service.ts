import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject,BehaviorSubject } from 'rxjs';
import { threadId } from 'worker_threads';

@Injectable({
  providedIn: 'root'
})
export class OrdershipmentService {
  
  private selectedfield = new BehaviorSubject<any>(undefined)
  GetSelectedField = this.selectedfield.asObservable()

  private SDateNewOrders = new BehaviorSubject<any>(undefined)
  GetSDateNewOrders = this.SDateNewOrders.asObservable()

  private EDateNewOrders = new BehaviorSubject<any>(undefined)
  GetEDateNewOrders = this.EDateNewOrders.asObservable()

  private NewOrderstext = new BehaviorSubject<any>(undefined)
  GetNewOrderstext = this.NewOrderstext.asObservable()

  private SDatePendingOrders = new BehaviorSubject<any>(undefined)
  GetSDatePendingOrders = this.SDatePendingOrders.asObservable()

  private EDatePendingOrders = new BehaviorSubject<any>(undefined)
  GetEDatePendingOrders = this.EDatePendingOrders.asObservable()

  private PendingOrderstext = new BehaviorSubject<any>(undefined)
  GetPendingOrderstext = this.PendingOrderstext.asObservable()

  private SDateProcessedOrders = new BehaviorSubject<any>(undefined)
  GetSDateProcessedOrders = this.SDateProcessedOrders.asObservable()

  private EDateProcessedOrders = new BehaviorSubject<any>(undefined)
  GetEDateProcessedOrders = this.EDateProcessedOrders.asObservable()

  private ProcessedOrderstext = new BehaviorSubject<any>(undefined)
  GetProcessedOrderstext = this.ProcessedOrderstext.asObservable()

  private SDateDispatchedOrders = new BehaviorSubject<any>(undefined)
  GetSDateDispatchedOrders = this.SDateDispatchedOrders.asObservable()

  private EDateDispatchedOrders = new BehaviorSubject<any>(undefined)
  GetEDateDispatchedOrders = this.EDateDispatchedOrders.asObservable()

  private DispatchedOrderstext = new BehaviorSubject<any>(undefined)
  GetDispatchedOrderstext = this.DispatchedOrderstext.asObservable()

  private SDateCancelledReturned = new BehaviorSubject<any>(undefined)
  GetSDateCancelledReturned = this.SDateCancelledReturned.asObservable()

  private EDateCancelledReturned = new BehaviorSubject<any>(undefined)
  GetEDateCancelledReturned = this.EDateCancelledReturned.asObservable()

  private CancelledReturnedtext = new BehaviorSubject<any>(undefined)
  GetCancelledReturnedtext = this.CancelledReturnedtext.asObservable()

  private NewOrders = new BehaviorSubject<any>({})
  GetNewOrders = this.NewOrders.asObservable()

  private PendingOrders = new BehaviorSubject<any>({})
  GetPendingOrders = this.PendingOrders.asObservable()

  private ProcessedOrders = new BehaviorSubject<any>({})
  GetProcessedOrders = this.ProcessedOrders.asObservable()

  private DispatchedOrders = new BehaviorSubject<any>({})
  GetDispatchedOrders = this.DispatchedOrders.asObservable()

  private CancelledReturned = new BehaviorSubject<any>({})
  GetCancelledReturned = this.CancelledReturned.asObservable()

  private statuscodesearch = new BehaviorSubject<any>(undefined)
  Getstatuscodesearch = this.statuscodesearch.asObservable()

  constructor(private _HttpClient: HttpClient) { }

  SetSelectedField(dropselectedfield:any){
    this.selectedfield.next(dropselectedfield);
  }

  SetNewOrderstext(data:any){
    this.NewOrderstext.next(data);
  }
  SetPendingOrderstext(data:any){
    this.PendingOrderstext.next(data);
  }
  SetProcessedOrderstext(data:any){
    this.ProcessedOrderstext.next(data);
  }
  SetDispatchedOrderstext(data:any){
    this.DispatchedOrderstext.next(data);
  }
  SetCancelledReturnedtext(data:any){
    this.CancelledReturnedtext.next(data);
  }

  SetSDateNewOrders(data:any){
    this.SDateNewOrders.next(data);
  }
  SetSDatePendingOrders(data:any){
    this.SDatePendingOrders.next(data);
  }
  SetSDateProcessedOrders(data:any){
    this.SDateProcessedOrders.next(data);
  }
  SetSDateDispatchedOrders(data:any){
    this.SDateDispatchedOrders.next(data);
  }
  SetSDateCancelledReturned(data:any){
    this.SDateCancelledReturned.next(data);
  }

  SetEDateNewOrders(data:any){
    this.EDateNewOrders.next(data);
  }
  SetEDatePendingOrders(data:any){
    this.EDatePendingOrders.next(data);
  }
  SetEDateProcessedOrders(data:any){
    this.EDateProcessedOrders.next(data);
  }
  SetEDateDispatchedOrders(data:any){
    this.EDateDispatchedOrders.next(data);
  }
  SetEDateCancelledReturned(data:any){
    this.EDateCancelledReturned.next(data);
  }

  SetGetNewOrders(data:any){
    this.NewOrders.next(data);
  }
  SetGetPendingOrders(data:any){
    this.PendingOrders.next(data);
  }
  SetGetProcessedOrders(data:any){
    this.ProcessedOrders.next(data);
  }
  SetGetDispatchedOrders(data:any){
    this.DispatchedOrders.next(data);
  }
  SetGetCancelledReturned(data:any){
    this.CancelledReturned.next(data);
  }
  Setstatuscodesearch(data:any){
    this.statuscodesearch.next(data);
  }
  GetOrderDetail(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/order/getOrderDetailsByStatus`, data);
  }
  getOrderDetailsOfCancelAndReturn(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/order/getOrderDetailsOfCancelAndReturn`, data);
  }
  getReason(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/order/getReason`, data);
  }
}
