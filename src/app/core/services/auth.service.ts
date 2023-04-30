import { Injectable } from '@angular/core';
import { LoginRequest, User } from '../models/auth.model';
import { HttpClient } from '@angular/common/http';
import { HttpSingleResponse } from '../models/http.model';
import { DUMMY_USER } from '../dummies/auth.dummy';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpCode } from '../consts/error-message.const';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private USER_STORAGE_KEY = 'user';

  constructor(private httpClient: HttpClient,
              private router: Router) {
    this.checkExistingData();
  }

  get user() {
    return this.userSubject$.value;
  }

  login(body: LoginRequest): Observable<HttpSingleResponse<User>> {
    const findUser = DUMMY_USER.find((user) =>
      user.username === body.username && user.password === body.password);

    return of({
      code: findUser ? HttpCode.SUCCESS : HttpCode.NOT_FOUND,
      data: findUser ? findUser : null,
    });
  }

  logout() {
    localStorage.removeItem(this.USER_STORAGE_KEY);
    this.userSubject$.next(null);
    this.router.navigate(['/']);
  }

  setUser(user: User) {
    localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
    this.userSubject$.next(user);
  }

  checkExistingData() {
    try {
      const user = localStorage.getItem(this.USER_STORAGE_KEY);
      if (user) {
        this.setUser(JSON.parse(user));
      }
    } catch {
      this.logout();
    }
  }
}
