import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/main/shared/shared.service';
import { UserprofileService } from '../userprofile.service';
import { AuthenticationService } from 'src/app/main/auth/service/authentication.service';

@Component({
  selector: 'app-saveditems',
  templateUrl: './saveditems.component.html',
  styleUrls: ['./saveditems.component.css']
})
export class SaveditemsComponent implements OnInit {
  userroles:boolean;

  constructor(private _authentication:AuthenticationService) { }

  ngOnInit(): void {
    if(this._authentication.isUser == true){
      this.userroles = true;
    }
  }

}