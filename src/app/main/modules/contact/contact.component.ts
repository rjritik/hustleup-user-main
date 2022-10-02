import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private _minipop:SharedService) { }

  ngOnInit(): void {
  }

  composemsg(){
    this._minipop.minimizeres('true');
  }
  
}
