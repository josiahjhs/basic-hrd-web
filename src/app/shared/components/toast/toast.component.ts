import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastData } from '../../../core/models/toast.model';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit, AfterViewInit {
  type = '';
  message = '';

  constructor(@Inject(MAT_DIALOG_DATA) private data: ToastData,
              private matDialogRef: MatDialogRef<ToastComponent>) {
  }

  ngOnInit(): void {
    this.type = this.data.type;
    this.message = this.data.message;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.matDialogRef.close();
    }, 3000);
  }
}
