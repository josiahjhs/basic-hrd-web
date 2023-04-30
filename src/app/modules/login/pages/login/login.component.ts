import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorMessage, HttpCode } from '../../../../core/consts/error-message.const';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../../core/models/auth.model';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  isErrorShown = false;
  errorMessage = '';
  errorTimeout: number = 0;
  formGroup: FormGroup = new FormGroup({
    username: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
  });
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private authService: AuthService,
              private router: Router) {
  }

  get formErrorMessage(): string {
    return ErrorMessage.REQUIRED;
  }

  login(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.clearTimeout();
      const body = this.formGroup.value;
      this.authService.login(body)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((resp) => {
          if (resp.code === HttpCode.SUCCESS) {
            const user = resp.data as User;
            this.authService.setUser(user);
            this.router.navigate(['/employee']);
          }
          if (resp.code === HttpCode.NOT_FOUND) {
            this.errorMessage = 'Wrong combination!';
            this.isErrorShown = true;
            this.errorTimeout = setTimeout(() => {
              this.isErrorShown = false;
            }, 2000);
          }
        });
    }
  }

  clearTimeout(): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
