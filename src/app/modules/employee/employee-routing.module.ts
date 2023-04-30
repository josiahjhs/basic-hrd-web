import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { EmployeeUpsertComponent } from './pages/employee-upsert/employee-upsert.component';
import { EmployeeDetailComponent } from './pages/employee-detail/employee-detail.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeListComponent,
  },
  {
    path: 'add',
    component: EmployeeUpsertComponent,
  },
  {
    path: ':username',
    component: EmployeeDetailComponent,
  },
  {
    path: ':username/edit',
    component: EmployeeUpsertComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {
}
