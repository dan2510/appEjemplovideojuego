import { Component, Inject, inject, signal, effect } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VideojuegoService } from '../../share/services/api/videojuego.service';
import { VideojuegoModel } from '../../share/models/VideojuegoModel';
import { from } from 'rxjs';

@Component({
  selector: 'app-videojuego-diag',
  standalone: false,
  templateUrl: './videojuego-diag.html',
  styleUrl: './videojuego-diag.css'
})
export class VideojuegoDiag {
  // Signal para almacenar el videojuego obtenido del API
  datos = signal<VideojuegoModel | null>(null);

  // Datos recibidos al abrir el diálogo
  datosDialog: { id: number };

  // Inyectar servicios
  private vjService = inject(VideojuegoService);
  private dialogRef = inject(MatDialogRef<VideojuegoDiag>);

  constructor(@Inject(MAT_DIALOG_DATA) data: { id: number }) {
    this.datosDialog = data;

    // Si hay ID, cargar los datos del videojuego
    if (this.datosDialog?.id) {
      this.obtenerVideojuego(this.datosDialog.id);
    }
  }

  // Cargar videojuego usando Signals y effect
  private obtenerVideojuego(id: number) {
    const videojuego$ = from(this.vjService.getById(id));

    effect(() => {
      videojuego$.subscribe({
        next: (data: VideojuegoModel) => this.datos.set(data),
        error: (err) => console.error('Error cargando videojuego:', err)
      });
    });
  }

  // Cerrar diálogo
  close() {
    this.dialogRef.close();
  }
}