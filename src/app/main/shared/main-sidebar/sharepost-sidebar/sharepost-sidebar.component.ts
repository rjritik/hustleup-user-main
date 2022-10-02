import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sharepost-sidebar',
  templateUrl: './sharepost-sidebar.component.html',
  styleUrls: ['./sharepost-sidebar.component.css']
})
export class SharepostSidebarComponent implements OnInit {
  public withoutNavBar:boolean;
  public sharepost:boolean;

  @Output() closebar = new EventEmitter<string>();

  @Input() set shareDetail(params: any) {
    if(params){
      if(params.sharepost){
        // this.influencerDetail = params.influencerDetail;
        this.sharepost = true;
        if(params.withoutNavBar) this.withoutNavBar = true; else this.withoutNavBar = false;
        // this.getCoffeeList(this.influencerDetail._id);
      }else{
        if(this.sharepost == true) this.sharepost = false;
      }
    }
  }
  
  constructor() { }

  ngOnInit(): void {
  }

  closesidebar(){
    this.closebar.emit('');
    this.sharepost = false;
    $('body').css({
      'overflow-y': 'auto',
    });
  };

}



