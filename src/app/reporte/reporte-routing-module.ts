import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteGeneros } from './reporte-generos/reporte-generos';

const routes: Routes = [
  {
    path: 'reportes',
    component: ReporteGeneros,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReporteRoutingModule {}
