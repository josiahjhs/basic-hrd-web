import { Injectable } from '@angular/core';
import { DUMMY_GROUP } from '../dummies/group.dummy';
import { Observable, of } from 'rxjs';
import { HttpCode } from '../consts/error-message.const';
import { HttpSingleResponse } from '../models/http.model';

@Injectable({
  providedIn: 'root',
})
export class GroupService {

  constructor() {
  }

  getList(): Observable<HttpSingleResponse<string[]>> {
    return of({
      code: HttpCode.SUCCESS,
      data: DUMMY_GROUP,
    });
  }
}
