import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthenticationService } from '../../auth/service';

@Component({
  selector: 'app-messagerightmenu',
  templateUrl: './messagerightmenu.component.html',
  styleUrls: ['./messagerightmenu.component.css']
})
export class MessagerightmenuComponent implements OnInit {
  @Output() showclass = new EventEmitter();
  IsSeller:boolean = false;
  IsInfluencer:boolean = false;

  constructor(private _AuthenticationService:AuthenticationService) { }

  ngOnInit(): void {
    if(this._AuthenticationService.isSeller == true){
      this.IsSeller = true
    }
    if(this._AuthenticationService.isInfluencer == true){
      this.IsInfluencer = true
    }
  }
  
}
