import { Injectable } from '@angular/core';
import { Employee, EmployeeQueryParams } from '../models/employee.model';
import { DUMMY_EMPLOYEE_LIST } from '../dummies/employee.dummy';
import { Observable, of } from 'rxjs';
import { HttpNullResponse, HttpPaginationResponse } from '../models/http.model';
import { HttpCode } from '../consts/error-message.const';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {

  private employeeList: Employee[] = DUMMY_EMPLOYEE_LIST;

  constructor() {
  }

  add(body: Employee): Observable<HttpNullResponse> {
    const checkExistingEmail = this.employeeList.findIndex((e) =>
      e.email.toLowerCase() === body.email.toLowerCase());
    if (checkExistingEmail !== -1) {
      return of({
        code: HttpCode.EMAIL_USED,
        data: null,
      });
    }
    this.employeeList.unshift(body);
    return of({
      code: HttpCode.SUCCESS,
      data: null,
    });
  }

  getList(queryParams: Partial<EmployeeQueryParams>): Observable<HttpPaginationResponse<Employee>> {
    let employeeList = this.employeeList.filter((f) => true);

    if (queryParams?.name) {
      const name = queryParams.name.toLowerCase();
      employeeList = employeeList.filter((e) => {
        return (e.firstName + ' ' + e.lastName).toLowerCase().includes(name);
      });
    }

    if (queryParams?.username) {
      const username = queryParams.username.toLowerCase();
      employeeList = employeeList.filter((e) => {
        return e.username.toLowerCase().includes(username);
      });
    }

    if (queryParams?.group) {
      const group = queryParams.group;
      employeeList = employeeList.filter((e) => {
        return e.group === group;
      });
    }

    if (queryParams?.sort) {
      const splitSort = queryParams.sort.split('_');
      const sortKey = splitSort[0];
      const sortDirection = splitSort[1];
      if (sortKey == 'name') {
        if (sortDirection == 'asc') {
          employeeList.sort((a, b) => this.sortNameAsc(a, b));
        } else {
          employeeList.sort((a, b) => this.sortNameDesc(a, b));
        }
      } else {
        if (sortDirection == 'asc') {
          employeeList.sort((a, b) => this.sortAsc(a, b, sortKey));
        } else {
          employeeList.sort((a, b) => this.sortDesc(a, b, sortKey));
        }
      }

    }

    const limit = queryParams.limit || 10;
    const offset = queryParams.offset || 0;

    const totalData = employeeList.length;
    const start = limit * offset;
    const deleteSize = limit;


    return of({
      code: HttpCode.SUCCESS,
      data: employeeList.splice(start, deleteSize),
      message: 'Successfully get data',
      totalData: totalData,
    });
  }

  getDetail(username: string) {
    const employee = this.employeeList.find((e) => e.username === username);

    if (!employee) {
      return of({
        code: HttpCode.NOT_FOUND,
        data: null,
      });
    }
    return of({
      code: HttpCode.SUCCESS,
      data: JSON.parse(JSON.stringify(employee)),
    });
  }

  edit(username: string, body: Employee): Observable<HttpNullResponse> {
    const checkExistingEmail = this.employeeList.findIndex((e) =>
      e.username !== username && e.email.toLowerCase() === body.email.toLowerCase());
    if (checkExistingEmail !== -1) {
      return of({
        code: HttpCode.EMAIL_USED,
        data: null,
      });
    }

    const index = this.employeeList.findIndex((e) => e.username === username);
    this.employeeList[index] = body;
    return of({
      code: HttpCode.SUCCESS,
      data: null,
    });
  }

  delete(username: string): Observable<HttpNullResponse> {
    const index = this.employeeList.findIndex((e) => e.username === username);
    this.employeeList.splice(index, 1);
    return of({
      code: HttpCode.SUCCESS,
      data: null,
    });
  }

  sortAsc(a: any, b: any, key: string) {
    if (a[key].toLowerCase() < b[key].toLowerCase()) {
      return -1;
    }
    if (a[key].toLowerCase() > b[key].toLowerCase()) {
      return 1;
    }
    return 0;
  }

  sortDesc(a: any, b: any, key: string) {
    if (b[key].toLowerCase() < a[key].toLowerCase()) {
      return -1;
    }
    if (b[key].toLowerCase() > a[key].toLowerCase()) {
      return 1;
    }
    return 0;
  }

  sortNameAsc(a: any, b: any) {
    const aName = (a.firstName + a.lastName).toLowerCase();
    const bName = (b.firstName + b.lastName).toLowerCase();
    if (aName < bName) {
      return -1;
    }
    if (aName > bName) {
      return 1;
    }
    return 0;
  }

  sortNameDesc(a: any, b: any) {
    const aName = (a.firstName + a.lastName).toLowerCase();
    const bName = (b.firstName + b.lastName).toLowerCase();
    if (bName < aName) {
      return -1;
    }
    if (bName > aName) {
      return 1;
    }
    return 0;
  }

}
