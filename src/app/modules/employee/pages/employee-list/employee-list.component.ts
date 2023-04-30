import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Employee, EmployeeQueryParams } from '../../../../core/models/employee.model';
import { EmployeeService } from '../../../../core/services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, ReplaySubject, takeUntil } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { decodeObjectValues, getChangedKey, removeEmptyObject } from '../../../../core/helpers/object.helper';
import { GroupService } from '../../../../core/services/group.service';
import { addNgxSelectFilterListener } from '../../../../core/helpers/ngx-search.helper';
import { ToastService } from '../../../../core/services/toast.service';
import { Sort, SortDirection } from '@angular/material/sort';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  formGroup: FormGroup = new FormGroup({
    name: new FormControl(''),
    username: new FormControl(''),
    group: new FormControl(''),
    sort: new FormControl(''),
    limit: new FormControl('10'),
    offset: new FormControl('0'),
  });
  employeeList: Employee[] = [];
  pageSizeOptions = [5, 10, 25, 100];
  totalData = 0;
  groupList: string[] = [];
  groupSearchControl = new FormControl<string>('');
  filteredGroupList$: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  prevFormGroupValue: any = {};
  matSortActive = '';
  matSortDirection: SortDirection = 'asc';
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private employeeService: EmployeeService,
              private activatedRoute: ActivatedRoute,
              private groupService: GroupService,
              private toastService: ToastService,
              private router: Router) {
  }

  get offset() {
    return +this.formGroup.get('offset')?.value;
  }

  set offset(offset: number) {
    this.formGroup.get('offset')?.setValue(offset);
  }

  get limit() {
    return +this.formGroup.get('limit')?.value;
  }

  set limit(limit: number) {
    this.formGroup.get('limit')?.setValue(limit);
  }

  get queryParams(): Partial<EmployeeQueryParams> {
    return removeEmptyObject(this.formGroup.value);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.checkExistingQueryParams();
    this.addRouterListener();
    this.addFormGroupListener();
    this.getGroupList();
  }

  checkExistingQueryParams() {
    const queryParams = decodeObjectValues(this.activatedRoute.snapshot.queryParams);
    this.formGroup.patchValue(queryParams, {emitEvent: false});
    this.prevFormGroupValue = this.formGroup.value;
    const sort = queryParams['sort'] || '';
    if (queryParams['sort']) {
      const splitSort = sort.split('_');
      this.matSortActive = splitSort[0];
      this.matSortDirection = splitSort[1];
    }
  }

  addRouterListener() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.getEmployeeList();
      });
  }

  addFormGroupListener() {
    this.formGroup.valueChanges
      .pipe(debounceTime(300))
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.checkResetOffset();
        this.router.navigate([], {queryParams: this.queryParams});
      });
  }

  checkResetOffset() {
    const changed = getChangedKey(this.formGroup.value, this.prevFormGroupValue);
    this.prevFormGroupValue = this.formGroup.value;
    if (!changed.includes('offset') && !changed.includes('sort')) {
      this.formGroup.get('offset')?.setValue('0');
    }
  }

  getGroupList(): void {
    this.groupService.getList()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        this.groupList = resp.data || [];
        addNgxSelectFilterListener(this.groupSearchControl, this.groupList, this.filteredGroupList$);
      });
  }

  clearFilter() {
    this.formGroup.reset();
  }

  getEmployeeList() {
    this.employeeService.getList(this.queryParams)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        this.employeeList = resp.data || [];
        this.totalData = resp.totalData;
      });
  }

  onSelectPage(page: PageEvent) {
    if (this.limit !== page.pageSize) {
      this.limit = page.pageSize;
      this.offset = 0;
      return;
    }
    if (this.offset !== page.pageIndex) {
      this.offset = page.pageIndex;
      return;
    }
  }

  sortData(sort: Sort) {
    if (sort.direction === '') {
      this.formGroup.get('sort')?.setValue('');
    } else {
      this.formGroup.get('sort')?.setValue(`${sort.active}_${sort.direction}`);
    }
  }

  addEmployee() {
    this.router.navigate([`/employee/add`]);
  }

  editEmployee(username: string): void {
    this.router.navigate([`/employee/${username}/edit`]);
  }

  deleteEmployee(username: string): void {
    this.employeeService.delete(username)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        this.toastService.open('Successfully deleting data', 'delete');
        if (!this.isOffsetOverflow()) {
          this.getEmployeeList();
        }
      });
  }

  isOffsetOverflow(minus = 1): boolean {
    if ((this.offset) * this.limit >= this.totalData - minus) {
      const offset = Math.floor((this.totalData - minus - 1) / this.limit);
      if (offset >= 0) {
        this.offset = offset;
        return true;
      }
    }
    return false;
  }

  isFilterHasData() {
    return this.formGroup.get('name')?.value || this.formGroup.get('username')?.value || this.formGroup.get('group')?.value;
  }

  goToDetail(username: string) {
    this.router.navigate([`/employee/${username}`]);
  }

}
