import { Pipe, PipeTransform } from '@angular/core';
import { numberToRupiah } from '../../core/helpers/rupiah.helper';

@Pipe({
  name: 'rupiah',
  standalone: true,
})
export class RupiahPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    return 'Rp. ' + numberToRupiah(value);
  }

}
