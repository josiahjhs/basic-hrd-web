import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from '../../../../core/services/employee.service';
import { Location } from '@angular/common';
import { Employee } from '../../../../core/models/employee.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpCode } from '../../../../core/consts/error-message.const';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
  employee!: Employee;
  username = '';
  isLoaded = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private employeeService: EmployeeService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private location: Location) {
    this.username = this.activatedRoute.snapshot.paramMap.get('username') || '';
  }

  ngOnInit(): void {
    this.getEmployeeDetail();
  }

  getEmployeeDetail() {
    this.employeeService.getDetail(this.username)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        if (resp.code === HttpCode.SUCCESS) {
          this.employee = resp.data;
          this.isLoaded = true;
        } else {
          this.router.navigate(['/']);
        }
      });
  }

  back(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
