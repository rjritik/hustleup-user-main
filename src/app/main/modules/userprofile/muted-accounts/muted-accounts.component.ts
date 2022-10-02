import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/main/shared/shared.service';
import { MutedAccountsService } from './muted-accounts.service';

@Component({
  selector: 'app-muted-accounts',
  templateUrl: './muted-accounts.component.html',
  styleUrls: ['./muted-accounts.component.css']
})
export class MutedAccountsComponent implements OnInit {
  MutedAccountList: any = [];
  NotavailList: boolean = true;


  constructor(private _SharedService: SharedService,private _MutedAccountService:MutedAccountsService) { }

  ngOnInit(): void {
    this.GetMutedAccountList()
  }

  async GetMutedAccountList(){
    // const resdata =[
    //   {
    //     id:1,
    //     Profilesrc:"assets/images/user-profile.png",
    //     ProfileUserName:"levisindia",
    //     VerifiedTicksrc:"assets/images/icons/verified-account.svg",
    //     ProfileDisplayName:"levis India",
    //     ProfileDiscription:"Fashion and quality at the best price in a sustainable way. For customer service please message me at the following numbers at the earliest or follow me at my",
    //     Following:399,
    //     Followers:"12K"
    //   },
    // ]
    // this.MutedAccountList = resdata
    // if (this.MutedAccountList.length > 0) {
    //         this.NotavailList = false;
    //       }

    await this._MutedAccountService.GetMutedAccountList().subscribe((res: any) => {
      if (res.status === 200) {
        this.MutedAccountList = res.data[0].mutedUserData;
        if (this.MutedAccountList.length > 0) {
          this.NotavailList = false;
        }
      }
    });
  }

  async UnmuteClick(item:any,index:any){
    const data ={
      "userId": item._id,
      "isMuted": false
  };
    // this.MutedAccountList.splice(index, 1);
    // this._SharedService.successToast("Unmute Successfully");
    // if (this.MutedAccountList.length <= 0) {
    //   this.NotavailList = true;
    // }
    await this._MutedAccountService.UnmuteAccount(data).subscribe((res: any) => {
      if (res.status == 200) {
        this.MutedAccountList.splice(index, 1);
        this._SharedService.successToast("Unmute Successfully");
        if (this.MutedAccountList.length <= 0) {
          this.NotavailList = true;
        }
      }
    });

  }

}
