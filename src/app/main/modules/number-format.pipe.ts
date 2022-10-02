import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  constructor() { }

  transform(number : any){
    let hasMinus = String(number).charAt(0) === '-' ? true:false;
    number =  String(number).charAt(0) === '-' ?
            + String(number).substring(1, number.length)  : number;
        // hundreds
        if(number <= 999){
          number = number ;
        }
        // thousands
        else if(number >= 1000 && number <= 999999){
          number = (number / 1000).toFixed(1) + 'K';
        }
        // millions
        else if(number >= 1000000 && number <= 999999999){
          number = (number / 1000000).toFixed(1) + 'M';
        }
        // billions
        else if(number >= 1000000000 && number <= 999999999999){
          number = (number / 1000000000).toFixed(1) + 'B';
        }
        if(hasMinus){
          return '-'+number;
        }else
        {
          return number;
        }
  }
}
