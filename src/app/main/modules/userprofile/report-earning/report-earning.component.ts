import { Component, OnInit, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReportEarningService } from './report-earning.service';
import  jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { SharedService } from 'src/app/main/shared/shared.service';
import { PaginationDirective } from 'src/app/main/directives/pagination.directive';

@Component({
  selector: 'app-report-earning',
  templateUrl: './report-earning.component.html',
  styleUrls: ['./report-earning.component.css']
})
export class ReportEarningComponent implements OnInit {
  nodatafound:boolean = false
  today = new Date()
  Reportsdata:any=[];
  StartDate:any;
  EndDate:any;
  NotAvailReportsData:boolean = true;
  picsum:any;
  limit:number =10;
  totalpage:number;
  PageNo:number;
  @ViewChildren(PaginationDirective) dirs:any;

  constructor(private _SharedService: SharedService,private _ReportEarning:ReportEarningService,private http: HttpClient) { }

  ngOnInit(): void {
    this.PageNo = 1
    this.GetReportsData(1)
  }

  async GetReportsData(pageno:number){
    const resdata:any = [
    {
      Date:"Wed Dec 01 2021 00:00:00 GMT+0530 (India Standard Time)",
      Particulars:"OSale of Handloom Therathume Dhaka -Reshami Saari",
      Increase:9999,
      Decrease:null
    },
    {
      Date:"Wed Dec 15 2021 00:00:00 GMT+0530 (India Standard Time)",
      Particulars:"Opening Balance",
      Increase:4599,
      Decrease:null
    },
    {
      Date:"Wed Dec 11 2021 00:00:00 GMT+0530 (India Standard Time)",
      Particulars:"OCourier Charges for Therathume Dhaka -Reshami Saari",
      Increase:null,
      Decrease:125
    },
    {
      Date:"Wed Nov 17 2021 00:00:00 GMT+0530 (India Standard Time)",
      Particulars:"Payment Collection Fee (Gateways Charges)",
      Increase:null,
      Decrease:90
    },
    {
      Date:"Fri Dec 17 2021 00:00:00 GMT+0530 (India Standard Time)",
      Particulars:"Payment Collection Fee (Gateways Charges)",
      Increase:null,
      Decrease:90
    },
    {
      Date:"Mon Dec 20 2021 00:00:00 GMT+0530 (India Standard Time)",
      Particulars:"Platform fee for sale of Therathume Dhaka -Reshami Saari",
      Increase:null,
      Decrease:135
    },
    {
      Date:"Fri Dec 03 2021 00:00:00 GMT+0530 (India Standard Time)",
      Particulars:"Payment received for a medium size coffee by @nakulbaksi",
      Increase:350,
      Decrease:null
    },
    {
      Date:"Tue Nov 23 2021 00:00:00 GMT+0530 (India Standard Time)",
      Particulars:"Payment collection fee for coffee (Gateways Charges)",
      Increase:null,
      Decrease:7
    },
    {
      Date:"july 05, 2021",
      Particulars:"Opening Balance",
      Increase:9999,
      Decrease:null
    },
    {
      Date:"july 05, 2021",
      Particulars:"Payment transferred",
      Increase:null,
      Decrease:3699
    },
    {
      Date:"july 05, 2021",
      Particulars:"Commission received on sale of Real Me Phone",
      Increase:750,
      Decrease:null
    },
    {
      Date:null,
      Particulars:null,
      Increase:10598,
      Decrease:8599
    },
    {
      Date:"july 05, 2021",
      Particulars:"Balance Receivable",
      Increase:null,
      Decrease:1997
    },
    {
      Date:null,
      Particulars:null,
      Increase:10598,
      Decrease:10598
    }
    ]
    resdata.forEach((element:any) => {
    if(element.Particulars == null){
      return element.Particulars = "-"
    }
    if(element.Increase == null){
      return element.Increase = "-"
    }
    if(element.Decrease == null){
      return element.Decrease = "-"
    }
    });
    this.Reportsdata = resdata
    if(this.Reportsdata.length >=1){
      this.NotAvailReportsData = false;
    }

    await this._ReportEarning.GetPicsum(pageno,this.limit).subscribe((res:any)=>{
      this.picsum = res
      this.totalpage = Math.ceil(1000 /this.limit) //this.picsum.length
    })
  }

  async SelectItemsPerPage(event:any){
    this.limit = event.target.value
    this.totalpage = Math.ceil(1000 /this.limit)
    if(this.PageNo >= this.totalpage){
      this.PageNo = this.totalpage
    }
    await this._ReportEarning.GetPicsum(this.PageNo,this.limit).subscribe((res:any)=>{
      this.picsum = res
      this.totalpage = Math.ceil(1000 /this.limit) //this.picsum.length
    })
  }

  async onPageChange(pageno:any){
    this.PageNo=pageno
    this.GetReportsData(this.PageNo)
  }
  onFirst(){
    this.dirs.first.onFirst()
  }
  onPrevious(){
    this.dirs.first.onPrevious()
  }
  onNext(){
    this.dirs.first.onNext()
  }
  onLast(){
    this.dirs.first.onLast()
  }

  exportAsXLSX():void {
    this._ReportEarning.exportAsExcelFile(this.Reportsdata, 'sample');
  }

  captureScreen(){
    var data = document.getElementById('contentToConvert') as HTMLElement;
    html2canvas(data).then(canvas => {
     // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('MYPdf.pdf'); // Generated PDF
    });
  }

  print(){
    const printContent = document.getElementById("contentToConvert") as HTMLElement
    const WindowPrt:any = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  onStartDate(event:any){
    this.StartDate = event.value
  }
  onEndDate(event:any){
    this.EndDate = event.value
  }

}
