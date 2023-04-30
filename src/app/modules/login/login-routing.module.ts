import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { APP_NAME } from '../../core/consts/app.const';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    title: `${APP_NAME} | Login`,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {
}
