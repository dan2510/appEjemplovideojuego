import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { VideojuegoModel } from '../../share/models/VideojuegoModel';
import { GeneroModel } from '../../share/models/GeneroModel';
import { VideojuegoService } from '../../share/services/api/videojuego.service';
import { GeneroService } from '../../share/services/api/genero.service';
import { NotificationService } from '../../share/services/app/notification.service';
import { CartService } from '../../share/services/app/cart.service';

@Component({
  selector: 'app-videojuego-index',
  standalone: false,
  templateUrl: './videojuego-index.html',
  styleUrl: './videojuego-index.css',
})
export class VideojuegoIndex {
  // Signals
  readonly videojuegos = signal<VideojuegoModel[]>([]);
  readonly generos = signal<GeneroModel[]>([]);
  readonly filtroNombre = signal('');
  readonly generosSeleccionados = signal<number[]>([]);

 
  private readonly vjService = inject(VideojuegoService);
  private readonly generoService = inject(GeneroService);
  private readonly router = inject(Router);
  private readonly noti = inject(NotificationService);
  private readonly cartService = inject(CartService);

  constructor() {
    this.cargarVideojuegos();
    this.cargarGeneros();
  }

  /** Cargar todos los videojuegos */
  private cargarVideojuegos(): void {
    this.vjService.get().subscribe({
      next: (data) => this.videojuegos.set(data),
      error: () =>
        this.noti.error('Error', 'No se pudieron cargar los videojuegos'),
    });
  }

  /** Cargar lista de géneros */
  private cargarGeneros(): void {
    this.generoService.get().subscribe({
      next: (data) => this.generos.set(data),
      error: () => this.noti.error('Error', 'No se pudieron cargar los géneros'),
    });
  }

  /** Filtros combinados: nombre + género */
  readonly videojuegosFiltrados = computed(() => {
    const filtro = this.filtroNombre().toLowerCase().trim();
    const seleccionados = this.generosSeleccionados();
    return this.videojuegos().filter((v) => {
      const coincideNombre = filtro
        ? v.nombre.toLowerCase().includes(filtro)
        : true;
      const coincideGenero =
        seleccionados.length > 0
          ? v.generos.some((g) => seleccionados.includes(g.id))
          : true;
      return coincideNombre && coincideGenero;
    });
  });

  /** Actualizar filtro de nombre */
  onFiltroNombreChange(nuevo: string): void {
    this.filtroNombre.set(nuevo);
  }

  /** Actualizar selección de géneros */
  onGenerosSelectChange(ids: number[]): void {
    this.generosSeleccionados.set(ids);
  }

  /** Ver detalle */
  detalle(id: number): void {
    this.router.navigate(['/videojuego', id]);
  }

  /** Comprar videojuego */
  comprar(videojuego: VideojuegoModel): void {
    this.cartService.addToCart(videojuego);
  }
}
