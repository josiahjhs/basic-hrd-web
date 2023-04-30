import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorMessage, HttpCode } from '../../../../core/consts/error-message.const';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { scrollToFirstInvalidControl } from '../../../../core/helpers/form.helper';
import { EmployeeService } from '../../../../core/services/employee.service';
import { Employee } from '../../../../core/models/employee.model';
import { ReplaySubject, takeUntil } from 'rxjs';
import { GroupService } from '../../../../core/services/group.service';
import { addNgxSelectFilterListener } from '../../../../core/helpers/ngx-search.helper';
import { ToastService } from '../../../../core/services/toast.service';
import { numberToRupiah, rupiahToNumber } from '../../../../core/helpers/rupiah.helper';

@Component({
  selector: 'app-employee-upsert',
  templateUrl: './employee-upsert.component.html',
  styleUrls: ['./employee-upsert.component.scss'],
})
export class EmployeeUpsertComponent implements OnInit, OnDestroy {
  isEditMode = false;
  title = '';
  buttonText = '';
  username = '';
  maxDate = new Date();
  isLoaded = false;
  formGroup = new FormGroup({
    username: new FormControl<string>('', [Validators.required]),
    firstName: new FormControl<string>('', [Validators.required]),
    lastName: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    birthDate: new FormControl<Date>(new Date(), [Validators.required]),
    basicSalary: new FormControl<string>('', [Validators.required]),
    status: new FormControl<string>('', [Validators.required]),
    group: new FormControl<string>('', [Validators.required]),
    description: new FormControl<Date>(new Date(), [Validators.required]),
  });
  groupList: string[] = [];
  groupSearchControl = new FormControl<string>('');
  filteredGroupList$: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private employeeService: EmployeeService,
              private groupService: GroupService,
              private toastService: ToastService) {
    this.username = this.activatedRoute.snapshot.paramMap.get('username') || '';
    this.setComponentState();
  }

  get formErrorMessage() {
    return ErrorMessage.REQUIRED;
  }

  get emailErrorMessage() {
    if (this.formGroup.get('email')?.hasError('email')) {
      return ErrorMessage.EMAIL;
    }
    return ErrorMessage.REQUIRED;
  }

  ngOnInit() {
    this.getGroupList();
  }

  setComponentState(): void {
    this.isEditMode = !!this.username;
    if (this.isEditMode) {
      this.title = 'Edit Employee';
      this.buttonText = 'Edit';
      this.populateData();
      this.formGroup.get('username')?.disable();
    } else {
      this.title = 'Add New Employee';
      this.buttonText = 'Add';
      this.isLoaded = true;
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

  populateData() {
    this.employeeService.getDetail(this.username)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        if (resp.code === HttpCode.SUCCESS) {
          const employee: any = resp.data;
          employee.basicSalary = numberToRupiah(employee.basicSalary);
          this.formGroup.patchValue(employee);
          this.isLoaded = true;
        } else {
          this.router.navigate(['/']);
        }
      });
  }

  submit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const body: Employee = this.getBody();
      if (this.isEditMode) {
        this.editEmployee(body);
      } else {
        this.addEmployee(body);
      }
    } else {
      scrollToFirstInvalidControl();
    }
  }

  getBody(): Employee {
    const employee: Employee = {
      username: this.formGroup.get('username')?.value || '',
      firstName: this.formGroup.get('firstName')?.value || '',
      lastName: this.formGroup.get('lastName')?.value || '',
      email: this.formGroup.get('email')?.value || '',
      birthDate: this.formGroup.get('birthDate')?.value || new Date(),
      basicSalary: rupiahToNumber(this.formGroup.get('basicSalary')?.value || ''),
      status: this.formGroup.get('status')?.value || '',
      group: this.formGroup.get('group')?.value || '',
      description: this.formGroup.get('description')?.value || new Date(),
    };
    return employee;
  }

  addEmployee(body: Employee) {
    this.employeeService.add(body)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (resp) => this.handleResponse(resp));
  }

  editEmployee(body: Employee) {
    this.employeeService.edit(this.username, body)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (resp) => this.handleResponse(resp));
  }

  handleResponse(resp: any) {
    if (resp.code === HttpCode.SUCCESS) {
      const type = this.isEditMode ? 'edit' : 'add';
      const message = this.isEditMode ? 'Successfully editing data' : 'Successfully adding new data';
      this.toastService.open(message, type);
      this.navigateToListPage();
    } else if (resp.code === HttpCode.EMAIL_USED) {
      this.toastService.open('Email is used!', 'delete');
    }
  }

  navigateToListPage() {
    this.router.navigate(['/employee']);
  }

  back() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
