import { Component, inject, signal, ViewChild } from '@angular/core';
import {  MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { VideojuegoModel } from '../../share/models/VideojuegoModel';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { VideojuegoDiag } from '../videojuego-diag/videojuego-diag';
import { VideojuegoService } from '../../share/services/api/videojuego.service';

@Component({
  selector: 'app-videojuego-admin',
  standalone: false,
  templateUrl: './videojuego-admin.html',
  styleUrl: './videojuego-admin.css',
})
export class VideojuegoAdmin {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //Cambio VideojuegoModel
  dataSource = new MatTableDataSource<VideojuegoModel>();
   // Signals
  videojuegos = signal<VideojuegoModel[]>([]);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['nombre', 'precio', 'acciones'];
  
  readonly dialog = inject(MatDialog);

  constructor(
    private vjService: VideojuegoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.listVideojuegos()
  }
 

  ngOnInit() {
    //Label paginator
    this.paginator._intl.itemsPerPageLabel = 'Items';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.firstPageLabel = 'Inicio';
    this.paginator._intl.lastPageLabel = 'Fin';
  }

  //Listar todos los videojuegos del API
  listVideojuegos() {
    //localhost:3000/videojuego
    this.vjService.get().subscribe((respuesta: VideojuegoModel[]) => {
      console.log(respuesta);
      //Cambio
      this.videojuegos.set(respuesta);
      this.dataSource.data=this.videojuegos()
       // Actualiza la signal
      this.videojuegos.set(respuesta);

      // Actualiza dataSource.data
      this.dataSource.data = this.videojuegos();

      // Re-asignar paginator y sort después de cambiar los datos
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  detalleVideojuego(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      id: id,
    };
    const dialogRef = this.dialog.open(VideojuegoDiag, dialogConfig);
  }
  actualizarVideojuego(id: number) {
    this.router.navigate(['/videojuego/update', id], {
      relativeTo: this.route,
    });
  }

  crearVideojuego() {
    this.router.navigate(['/videojuego/create'], {
      relativeTo: this.route,
    });
  }
}
