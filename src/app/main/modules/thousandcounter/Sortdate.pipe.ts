import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'Srtdate'
})
export class SortdatePipe implements PipeTransform {
  datePipe: DatePipe = new DatePipe('en-US');
  transform(msgDate: any): any {
    let todayDate = new Date();
    let sentOnDate = new Date(msgDate);
    // sentOnDate.setDate(sentOnDate.getDate());
    let differenceInDays = todayDate.getDate() - sentOnDate.getDate();
    if(differenceInDays  === 0){
      return this.datePipe.transform(msgDate,'h:mm a')
    }else if(differenceInDays === 1){
      return "yesterday"
    }else{
      return this.datePipe.transform(msgDate,'M/d/yy')
    }


  }
}