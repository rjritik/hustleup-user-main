import { Directive, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appProductLisingPaginationdirective]'
})
export class ProductLisingPaginationdirectiveDirective {

  @Input() TotalPages:number;
  PageNo:number=1;
  @Output() onChangeEventEmitter = new EventEmitter()
  @Input() TsPageNo: number;

  constructor(public render:Renderer2,public el:ElementRef,private elementRef: ElementRef) { }
  onNext(){
  this.setpage(Math.min(this.TotalPages,this.PageNo+1))
  }

  onPrevious(){
    if(this.PageNo > this.TotalPages){
      this.PageNo = this.TotalPages
    }
    this.setpage(Math.max(1,this.PageNo-1))
  }

  onFirst(){
    this.setpage(1)
  }

  onLast(){
    this.setpage(this.TotalPages)
  }

  setpage(pageno:any){
    this.PageNo=pageno
    this.render.setProperty(this.el.nativeElement,"value",this.PageNo)
    this.onChangeEventEmitter.emit(this.PageNo)
  }
}
