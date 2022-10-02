import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'timeDiff'
})
export class TimeDiffPipe implements PipeTransform {
  datePipe: DatePipe = new DatePipe('en-US');
  transform(msgDate: any) {
    let diff = new Date().getTime() - new Date(msgDate).getTime();
    let minutes = Math.floor(diff / (60 * 1000));
    return minutes;
  }
}