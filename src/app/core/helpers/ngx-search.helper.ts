import { FormControl } from '@angular/forms';
import { ReplaySubject } from 'rxjs';

export function addNgxSelectFilterListener(formControl: FormControl, list: string[], filteredList$: ReplaySubject<string[]>) {
  filteredList$.next(list);
  formControl.valueChanges.subscribe(() => {
    filter(formControl, list, filteredList$);
  });
}

function filter(formControl: FormControl, list: string[], filteredList$: ReplaySubject<string[]>): void {
  let search = formControl.value || '';
  if (!search) {
    filteredList$.next(list);
    return;
  } else {
    search = search.toLowerCase();
    filteredList$.next(
      list.filter((item) => item.toLowerCase().includes(search)),
    );
  }
}
