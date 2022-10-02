import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../../auth/service/authentication.service';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent implements OnInit,OnDestroy{

  constructor(private _authenticationService:AuthenticationService) {
   }

  ngOnInit(): void {
    if (this._authenticationService.currentUserValue) {
      this._authenticationService.navbarsub.next(true);
    }else{
      this._authenticationService.navbarsub.next(false);
    }
  }

  ngOnDestroy(){
    this._authenticationService.navbarsub.next(false);
  }
}