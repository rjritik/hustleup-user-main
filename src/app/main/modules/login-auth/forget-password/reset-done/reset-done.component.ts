import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';

@Component({
  selector: 'app-reset-done',
  templateUrl: './reset-done.component.html',
  styleUrls: ['./reset-done.component.css']
})
export class ResetDoneComponent implements OnInit {

  constructor(private _AuthenticationService:AuthenticationService, private _router:Router) {
    // redirect to home if already logged in
    if (this._AuthenticationService.currentUserValue) {
      this._router.navigate(['/home']);
    }
   }

  ngOnInit(): void {
  }

}
