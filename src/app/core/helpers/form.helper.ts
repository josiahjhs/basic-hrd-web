import { FormGroup } from '@angular/forms';
import { getChangedKey } from './object.helper';

export function scrollToFirstInvalidControl() {
  const firstInvalidControl: HTMLElement | null = document.querySelector('mat-form-field .ng-invalid');
  if (firstInvalidControl) {
    const bodyRect = document.body.getBoundingClientRect();
    const rect = firstInvalidControl?.getBoundingClientRect();
    window.scroll({
      top: rect?.top - bodyRect.top - rect.height,
      left: 0,
      behavior: 'smooth',
    });
  }
}

export function checkResetOffset(formGroup: FormGroup, value1: any, value2: any) {
  const changed = getChangedKey(value1, value2);
  value2 = value1;
  if (!changed.includes('offset') && !changed.includes('sort')) {
    formGroup.get('offset')?.setValue('0');
  }
}
