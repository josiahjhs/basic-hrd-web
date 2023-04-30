import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeUpsertComponent } from './pages/employee-upsert/employee-upsert.component';
import { EmployeeDetailComponent } from './pages/employee-detail/employee-detail.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSortModule } from '@angular/material/sort';
import { OnlyNumberDirective } from '../../shared/directives/only-number.directive';
import { RupiahPipe } from '../../shared/pipes/rupiah.pipe';


@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeUpsertComponent,
    EmployeeDetailComponent,
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSnackBarModule,
    NgxMatSelectSearchModule,
    MatSortModule,
    OnlyNumberDirective,
    RupiahPipe,
  ],
})
export class EmployeeModule {
}
