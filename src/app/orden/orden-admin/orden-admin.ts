import { Component, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { OrdenModel } from '../../share/models/OrdenModel';
import { OrdenService } from '../../share/services/api/orden.service';

@Component({
  selector: 'app-orden-admin',
  standalone: false,
  templateUrl: './orden-admin.html',
  styleUrl: './orden-admin.css',
})
export class OrdenAdmin {
  /** Estado reactivo */
  ordenes = signal<OrdenModel[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private ordenService: OrdenService) {
    this.cargarOrdenes();
  }

  /** Llamada al API con control de estado */
  cargarOrdenes() {
    this.cargando.set(true);

    this.ordenService.get().subscribe({
      next: (data: OrdenModel[]) => {
        this.ordenes.set(data);
        this.error.set(null);
      },
      error: () => {
        this.error.set('No se pudieron cargar las órdenes');
      },
      complete: () => {
        this.cargando.set(false);
      },
    });
  }
}