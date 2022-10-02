import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../auth/service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit,OnDestroy {
  constructor(private _authentication:AuthenticationService){
  }
  ngOnInit(): void {
     this._authentication.navbarsub.next(false);
     this._authentication.shopCartIcon.next(false);
  }

  ngOnDestroy(){
    this._authentication.navbarsub.next(true);
    this._authentication.shopCartIcon.next(true);
  }
}