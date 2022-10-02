import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    loadChildren:() => import('./main/modules/modules.module').then(m => m.ModulesModule)
  },
  {
    path:'message',
    loadChildren:() => import('./main/modules/message/message.module').then(m => m.MessageModule),
  },
  {
    path:'accounts',
    loadChildren:() => import('./main/modules/login-auth/login-auth.module').then(m => m.LoginAuthModule),
  },
  {
    path:'search',
    loadChildren:() => import('./main/modules/search-result/search-result.module').then(m => m.SearchResultModule),
  },
  {
    path:'user-profile',
    loadChildren:() => import('./main/modules/userprofile/userprofile.module').then(m=>m.UserprofileModule),
  },
  {
    path:'product-detail/:id',
    loadChildren:() => import('./main/modules/product-details/product-details.module').then(m=>m.ProductDetailsModule),
  },
  {
    path:'shopping-cart',
    loadChildren:() => import('./main/modules/shopping-cart/shopping-cart.module').then(m=>m.ShoppingCartModule),
  },
  {
    path:'ProductTypeSearch/:producttypeid/:producttypename',
    loadChildren:()=> import('./main/modules/product-type-search/product-type-search.module').then(m=>m.ProductTypeSearchModule),
  },
  {
    path:'**',
    loadChildren:() => import('./main/modules/notfound/notfound.module').then(m=>m.NotfoundModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[]
  // { provide: LocationStrategy, useClass: HashLocationStrategy}
})
export class AppRoutingModule{ }
