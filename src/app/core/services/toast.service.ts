import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { ToastData, ToastType } from '../models/toast.model';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  matDialogRef!: MatDialogRef<ToastComponent>;

  constructor(private matDialog: MatDialog) {
  }

  open(message: string, type: ToastType) {
    if (this.matDialogRef) {
      this.matDialogRef.close();
    }
    const toastData: ToastData = {message, type};
    this.matDialogRef = this.matDialog.open(ToastComponent, {
      data: toastData,
      hasBackdrop: false,
      position: {top: '1rem', right: '1rem'},
      panelClass: 'toast-container',
      width: '400px',
      maxWidth: '100%',
      scrollStrategy: new NoopScrollStrategy(),
    });
  }
}
