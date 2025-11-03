import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideojuegoRoutingModule } from './videojuego-routing-module';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VideojuegoIndex } from './videojuego-index/videojuego-index';
import { VideojuegoDetail } from './videojuego-detail/videojuego-detail';
import { VideojuegoAdmin } from './videojuego-admin/videojuego-admin';
import { VideojuegoDiag } from './videojuego-diag/videojuego-diag';
import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field'
import { VideojuegoForm } from './videojuego-form/videojuego-form';


@NgModule({
  declarations: [
    VideojuegoIndex,
    VideojuegoDetail,
    VideojuegoAdmin,
    VideojuegoDiag,
    VideojuegoForm
  ],
  imports: [
    CommonModule,
    VideojuegoRoutingModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    MatDialogModule,
    MatRadioModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ]
})
export class VideojuegoModule { }
