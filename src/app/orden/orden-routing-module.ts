import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdenIndex } from './orden-index/orden-index';
import { OrdenAdmin } from './orden-admin/orden-admin';

const routes: Routes = [
  {
    path: 'orden',
    component: OrdenIndex
  },
  {
    path: 'orden-admin',
    component: OrdenAdmin
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenRoutingModule { }
