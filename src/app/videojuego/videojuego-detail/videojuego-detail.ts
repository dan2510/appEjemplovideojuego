import { Component, inject, signal } from '@angular/core';
import { VideojuegoModel } from '../../share/models/VideojuegoModel';
import { VideojuegoService } from '../../share/services/api/videojuego.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-videojuego-detail',
  standalone: false,
  templateUrl: './videojuego-detail.html',
  styleUrl: './videojuego-detail.css'
})
export class VideojuegoDetail {
  // Signal para almacenar los datos del videojuego
  datos = signal<VideojuegoModel | null>(null);
  // Inyectar servicios
  private vjService = inject(VideojuegoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.obtenerVideojuego(id);
    }
  }

  // Obtener videojuego y actualizar la Signal
  obtenerVideojuego(id: number) {
    this.vjService.getById(id).subscribe((data: any) => {
      console.log(data);
      this.datos.set(data); // Actualiza la Signal
    });
  }

  goBack(): void {
    this.router.navigate(['/videojuego/']);
  }
}
