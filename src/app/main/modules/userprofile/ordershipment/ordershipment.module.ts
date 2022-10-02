import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrdershipmentComponent } from './ordershipment.component';
import { NewOrderComponent } from './new-order/new-order.component';
import { PendingOrderComponent } from './pending-order/pending-order.component';
import { ProcessedOrderComponent } from './processed-order/processed-order.component';
import { DispatchedOrderComponent } from './dispatched-order/dispatched-order.component';
import { CancelReturnOrderComponent } from './cancel-return-order/cancel-return-order.component';
import { AuthGuard } from 'src/app/main/auth/helpers';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { RequestPickupComponent } from '../ordershipment/request-pickup/request-pickup.component';
import { SelfShipComponent } from './self-ship/self-ship.component';
import { SelfDropComponent } from './self-drop/self-drop.component';
import { CarrierDetailComponent } from './carrier-detail/carrier-detail.component';
import { OrdershipmentPaginationDirective } from './OrdershipmentPaginationDirective/ordershipment-pagination.directive';
import { InvoiceModule } from '../../userprofile/invoicedata/invoice.module';
import { ReschedulePickupComponent } from './reschedule-pickup/reschedule-pickup.component';

const routes:Routes = [
  {
  path:'', component:OrdershipmentComponent,children:[
    { path: '', redirectTo: 'NewOrder', pathMatch: 'full' },
    {path:'NewOrder',component:NewOrderComponent,canActivate:[AuthGuard]},
    {path:'PendingOrder',component:PendingOrderComponent,canActivate:[AuthGuard]},
    {path:'ProcessedOrder',component:ProcessedOrderComponent,canActivate:[AuthGuard]},
    {path:'DispatchedOrder',component:DispatchedOrderComponent,canActivate:[AuthGuard]},
    {path:'Cancel-Return',component:CancelReturnOrderComponent,canActivate:[AuthGuard]}
  ]
  },
  {path:'RequestPickup',component:RequestPickupComponent},
  {path:'SelfShip',component:SelfShipComponent},
  {path:'SelfDrop',component:SelfDropComponent},
  {path:'CarrierDetail',component:CarrierDetailComponent},
  {path:'Reschedule-Pickup',component:ReschedulePickupComponent}
]

@NgModule({
  declarations: [
    NewOrderComponent,
    PendingOrderComponent,
    ProcessedOrderComponent,
    DispatchedOrderComponent,
    CancelReturnOrderComponent,
    RequestPickupComponent,
    SelfShipComponent,
    SelfDropComponent,
    CarrierDetailComponent,
    OrdershipmentPaginationDirective,
    ReschedulePickupComponent,
  ],
  imports: [
    InvoiceModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatMenuModule,
  ],
  providers:[OrdershipmentPaginationDirective]
})
export class OrdershipmentModule { }
