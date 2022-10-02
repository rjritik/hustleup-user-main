import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortMemberList'
})
export class sortChatMemberListPipe implements PipeTransform {

  transform(value: any):any {

    if(!value) return [];
    const tempArray:any[] = [];
    const nullarray: any[] = [];
    value.forEach((element:any) => {
      if(element?.messages?.created_date == undefined){
        nullarray.push(element)
      }else{
        tempArray.push(element)
      }
    });
    const sortedArray = tempArray.sort((a:any, b:any) => {
      return new Date(b?.messages?.created_date).getTime() - new Date(a?.messages?.created_date).getTime();
    })
    return [...sortedArray,...nullarray]
    
  }
}