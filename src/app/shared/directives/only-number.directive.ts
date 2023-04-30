import { DecimalPipe } from '@angular/common';
import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { numberToRupiah, rupiahToStringNumber } from '../../core/helpers/rupiah.helper';

@Directive({
  selector: '[inputNumber]',
  standalone: true,
})
export class OnlyNumberDirective implements OnInit, OnDestroy {
  @Input()
  public allowComma = true;
  @Input()
  public allowOperator = false;
  @Input()
  public isFormatThousandRupiah = false;
  @Input()
  public minNumber!: number;
  @Input()
  public maxNumber!: number;
  private debounceTimer: any;
  private decimalPipe: DecimalPipe = new DecimalPipe('id-ID');
  private subscription: Subscription[] = [];
  private value!: number;

  constructor(@Self() private ngControl: NgControl,
              private elementRef: ElementRef) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.key;
    const numberRegex = /[0-9]+/g;
    const operatorKeys = ['+', '-', '*', '/', '(', ')', '.'];
    const specialKeys = [
      'ArrowLeft',
      'ArrowRight',
      'Backspace',
      'Del',
      'Delete',
      'Enter',
      'Escape',
      'End',
      'Home',
      'Tab',
    ];
    const value = this.elementRef.nativeElement.value;

    if (value.slice(0, 1) === '0' && event.key === '0' && (this.isFormatThousandRupiah)) {
      event.preventDefault();
    }
    /* allow Select All, Copy, Paste, Cut */

    if (
      (event.keyCode === 65 && event.ctrlKey === true) /* Ctrl + A */ ||
      (event.keyCode === 67 && event.ctrlKey === true) /* Ctrl + C */ ||
      (event.keyCode === 86 && event.ctrlKey === true) /* Ctrl + V */ ||
      (event.keyCode === 88 && event.ctrlKey === true) /* Ctrl + X */ ||
      (event.keyCode === 65 && event.metaKey === true) /* Cmd + A */ ||
      (event.keyCode === 67 && event.metaKey === true) /* Cmd + C */ ||
      (event.keyCode === 86 && event.metaKey === true) /* Cmd + V */ ||
      (event.keyCode === 88 && event.metaKey === true) /* Cmd + X */
    ) {
      return;
    }

    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    /* allow comma */

    if (this.allowComma) {
      if (value.slice(0, 1) === '0' && value.slice(1, 2) !== ',' && event.key === '0') {
        event.preventDefault();
      }

      if (event.key === ',' && !/\,/g.test(value)) {
        return;
      }
    }

    /* allow operator */
    if (this.allowOperator) {
      if (operatorKeys.indexOf(event.key) !== -1) {
        return;
      }
    }

    /* allow number */
    if (numberRegex.test(input)) {
      return;
    }

    event.preventDefault();
  }

  @HostListener('keyup', ['$event'])
  onkeyup(event: KeyboardEvent) {
    const value = this.elementRef.nativeElement.value;

    /* allow arrow keys */
    const arrowKeys = ['ArrowLeft', 'ArrowRight'];

    if (arrowKeys.indexOf(event.key) !== -1) {
      return;
    }

    if (value.length < 1) {
      return;
    }

    if (this.isFormatThousandRupiah) {
      const number = rupiahToStringNumber(value);
      const rupiah = numberToRupiah(number);
      this.ngControl.control?.setValue(rupiah);

      if (parseInt(number) > 0) {
        this.ngControl.valueAccessor?.writeValue(rupiah);
      }
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    if (event.clipboardData) {
      const pastedInput: string = event.clipboardData
        .getData('text/plain')
        .replace(/\D/g, '');

      document.execCommand('insertText', false, pastedInput);
    }

  }

  ngOnInit() {
    this.subscription = [];
    this.setValueChanges();
  }

  ngOnDestroy() {
    this.subscription.forEach((each) => each.unsubscribe());
  }

  public transform(value: number): string {
    value = value && value > 0 ? value : 0;
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  public parse(value: string): string {
    return value
      .toString()
      .split('.')
      .join('')
      .split(' ')
      .join('')
      .replace('R', '')
      .replace('p', '');
  }

  private setValueChanges() {
    /* subs value changes to check limit */
    const subs = this.ngControl.valueChanges?.subscribe((value) => {
      this.value = Number(value);
      clearTimeout(this.debounceTimer);

      this.debounceTimer = setTimeout(() => {
        this.checkLimit();
      }, 100);
    });

    if (subs) {
      this.subscription.push(subs);
    }
  }

  private checkLimit() {
    /* check limit if defined */
    if (this.value.toString().length > 1) {
      if (this.minNumber !== undefined && this.value < Number(this.minNumber)) {
        this.ngControl.control?.setValue(Number(this.minNumber));
      }

      if (this.maxNumber !== undefined && this.value > Number(this.maxNumber)) {
        this.ngControl.control?.setValue(Number(this.maxNumber));
      }
    }
  }
}
