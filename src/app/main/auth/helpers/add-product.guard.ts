import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserprofileService } from '../../modules/userprofile/userprofile.service';
import { SharedService } from '../../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class AddProductGuard implements CanActivate {
  storeStatus:any;
  constructor(private _router: Router, private _UserprofileService:UserprofileService, private _SharedService:SharedService) {}
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      this._UserprofileService.getStoreStatus().subscribe((res: any) => {
          if(res.status === 200){
            if(res.storeStatus == 1){
              resolve(true);
            }else if(res.storeStatus == 0){
              this._SharedService.InfoToast("Your strore request is submitted.");
              this._router.navigate(['/home']);
              resolve(false);
            }else if(res.storeStatus == 2){
              this._SharedService.InfoToast("Your strore request is rejected. Please add your store detail again.");
              this._router.navigate(['/user-profile/StoreDetails']);
              resolve(false);
            }
          }else if(res.status == 404){
            this._SharedService.InfoToast("Please add Your Store");
            this._router.navigate(['/user-profile/StoreDetails']);
            resolve(false);
          }else{
            this._SharedService.errorToast(res.message);
            resolve(false);
          }        
         },err=>{
          console.log(err,"log err")
          this._router.navigate(['/home']);
          reject(false);
         })
       })
  }
}