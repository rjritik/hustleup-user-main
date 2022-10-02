import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingCartComponent } from './shopping-cart.component';
import { CartitemComponent } from './cartitem/cartitem.component';
import { SelectAddressComponent } from './select-address/select-address.component';
import { HeaderModule } from '../../shared/header/header.module';
import { OwlModule } from 'ngx-owl-carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { AuthGuard } from '../../auth/helpers/auth.guard';
import { Role } from '../../auth/models/role';

const routes:Routes=[
  {
    path:'',
    component:ShoppingCartComponent,
    canActivate: [AuthGuard],
    // data: { roles: [Role.User] },
    children:[
      {
        path:'',
        component:CartitemComponent,
      },
      {
        path:'select-address',
        component:SelectAddressComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
]


@NgModule({
  declarations: [
    ShoppingCartComponent,
    CartitemComponent,
    SelectAddressComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    OwlModule,
    NgSelect2Module
  ],
  exports:[
    RouterModule
  ]
})
export class ShoppingCartModule { }
