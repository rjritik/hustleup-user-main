import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

    transform(bytes: any): any {
        const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const factor = 1024;
        let index = 0;
  
        while (bytes >= factor) {
          bytes /= factor;
          index++;
        }
        return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
    }
}