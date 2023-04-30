export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
}
