import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReporteRoutingModule } from './reporte-routing-module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReporteGeneros } from './reporte-generos/reporte-generos';
import { AgCharts } from 'ag-charts-angular';
//https://www.ag-grid.com/charts/angular/quick-start/

@NgModule({
  declarations: [ReporteGeneros],
  imports: [
    CommonModule,
    ReporteRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    AgCharts,
  ],
})
export class ReporteModule {}
