import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchChannel'
})
export class searchChannelPipe implements PipeTransform {

    transform(channelList: any[], value: string): any[] {

        if(!channelList) return [];
        if(!value) return channelList;

        return channelList.filter( (item:any) => {
            return  item.name.toLowerCase().includes(value.toLowerCase());
        });
    }
}