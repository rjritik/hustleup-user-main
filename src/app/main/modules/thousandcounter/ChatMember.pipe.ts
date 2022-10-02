import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatMember'
})
export class ChatMemberPipe implements PipeTransform {

    transform(chatMemberList: any[], value: string): any[] {

        if(!chatMemberList) return [];
        if(!value) return chatMemberList;

        return chatMemberList.filter( (item:any) => {
            return  item.user_details.username.toLowerCase().includes(value.toLowerCase());
        });
    }
}