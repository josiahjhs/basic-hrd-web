import { User } from '../models/auth.model';

export const DUMMY_USER: User[] = [
  {
    username: 'admin',
    firstName: 'Josiah',
    lastName: 'Hans',
    password: 'admin',
    role: 'SUPER_ADMIN',
  },
  {
    username: 'Bryan111',
    firstName: 'Bryan',
    lastName: 'Alexander',
    password: 'ba123',
    role: 'ADMIN',
  },
  {
    username: 'livliv',
    firstName: 'Livy',
    lastName: 'Renata',
    password: 'livyY123',
    role: 'ADMIN',
  },
];
