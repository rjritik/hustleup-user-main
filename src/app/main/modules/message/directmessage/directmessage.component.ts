import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'app-directmessage',
  templateUrl: './directmessage.component.html',
  styleUrls: ['./directmessage.component.css']
})
export class DirectmessageComponent implements OnInit {

  constructor(private _SharedService:SharedService) { }

  ngOnInit(): void {
  }
  composemsgdown(){
    this._SharedService.minimizeres('minimizesub');
  }
  NewMsgBox() {
    this._SharedService.minimizeres('truenew');
  }
  createNewMsgBox(){
    const data = {
      text:'createNewMsgBox',
      userdetail:{username:"username"}
    }
    this._SharedService.setUserDetail(data);
  }

}
