import { Pipe, PipeTransform } from '@angular/core';
import { SharedService } from 'src/app/main/shared/shared.service';

@Pipe({
  name: 'reportEarningdatepipe'
})
export class ReportEarningdatepipePipe implements PipeTransform {
  constructor(private _SharedService: SharedService) { }

  transform(value: any[], SDate?: any, EDate?: any) {
    if(!SDate || !EDate){
      if(SDate == undefined && EDate != undefined){
        this._SharedService.errorToast("startdate Not Selected");
        return value
      }
      return value;
    }
    else{
      let startDate = new Date(SDate);
      let endDate = new Date(EDate);
      if(Date.parse(SDate) <= Date.parse(EDate)){
        return value.filter((m:any) =>{
         let val = (new Date(m.Date) >= startDate && new Date(m.Date) <= endDate)
         return val
        })
      }
      else{
        this._SharedService.errorToast("Date not in range");
        return value
      }
    }
  }

}
