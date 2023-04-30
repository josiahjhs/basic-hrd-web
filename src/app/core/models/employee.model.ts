import { PaginationQueryParams } from './pagination.model';

export interface Employee {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  basicSalary: number;
  status: string;
  group: string;
  description: Date;
}

export interface EmployeeQueryParams extends PaginationQueryParams {
  username: string;
  name: string;
  group: string;
  sort: string;
}
