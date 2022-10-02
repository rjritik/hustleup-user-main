import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThousandSuffixesPipe } from './thousandSuff.pipe';
import { BrandSearchPipe } from './brandsearch.pipe';
import { DateAgoPipe} from './DateAgo.pipe';
import { ChatMemberPipe} from './ChatMember.pipe';
import { FileSizePipe} from './FileSize.pipe';
import { SortdatePipe } from './Sortdate.pipe';
import { searchChannelPipe } from './searchChannel.pipe';
import { SafePipe } from './safe-pipe.pipe';
import {TimeDiffPipe} from './timeDiff.pipe'

@NgModule({
  declarations: [ThousandSuffixesPipe,BrandSearchPipe,DateAgoPipe,ChatMemberPipe,FileSizePipe,SortdatePipe,searchChannelPipe, SafePipe,TimeDiffPipe],
  imports: [
    CommonModule,
  ],
  exports:[
    ThousandSuffixesPipe,
    BrandSearchPipe,
    DateAgoPipe,
    ChatMemberPipe,
    FileSizePipe,
    SortdatePipe,
    searchChannelPipe,
    SafePipe,
    TimeDiffPipe
  ]
})
export class ThousandcounterModule { }
