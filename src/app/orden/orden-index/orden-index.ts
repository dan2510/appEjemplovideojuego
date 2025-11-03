import { Component, computed, effect, inject, Signal } from '@angular/core';
import { ItemCartModel } from '../../share/models/ItemCartModel';
import { VideojuegoModel } from '../../share/models/VideojuegoModel';
import { MatTableDataSource } from '@angular/material/table';
import { OrdenVideojuegoModel } from '../../share/models/OrdenVideojuegoModel';
import { OrdenModel } from '../../share/models/OrdenModel';
import { CartService } from '../../share/services/app/cart.service';
import { OrdenService } from '../../share/services/api/orden.service';
import { NotificationService } from '../../share/services/app/notification.service';
import { AuthenticationService } from '../../share/services/app/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orden-index',
  standalone: false,
  templateUrl: './orden-index.html',
  styleUrl: './orden-index.css',
})
export class OrdenIndex {
  private cartService = inject(CartService);

  // Signals reactivos desde el service ✅
  readonly ordenItems = this.cartService.itemsCart;
  readonly totalCompra = this.cartService.total;

  private authService = inject(AuthenticationService);

  fecha = new Date();
  //Tabla
  displayedColumns: string[] = [
    'producto',
    'precio',
    'cantidad',
    'subtotal',
    'acciones',
  ];
  // DataSource para la tabla de Angular Material
  dataSource = new MatTableDataSource<ItemCartModel>([]);

  constructor(
    private ordenService: OrdenService,
    private noti: NotificationService,
    private router: Router
  ) {
    // Signal para actualizar Tabla
    effect(() => {
      const items = this.ordenItems();
      console.log('Carrito actualizado:', items);
      this.dataSource.data = items;
    });
  }
  aumentarCantidad(producto: any) {
    this.cartService.addToCart(producto);
  }

  disminuirCantidad(producto: any) {
    this.cartService.addToCart(producto, -1);
  }

  eliminarItem(id: number) {
    this.cartService.removeFromCart(id);
  }
  registrarOrden() {
    //Obtener los items de la compra
    let itemCompra = this.cartService.itemsCart();
    //Verificar Detalle
    if (itemCompra.length === 0) {
      this.noti.warning('Crear Orden', 'Agregue videojuegos a la orden', 5000);
      return;
    }

    const user = this.authService.usuario();
    if (!user) {
      this.noti.error('Crear Orden', 'Usuario no autenticado', 5000);
      return;
    }

    //Estructura para el API
    let detalle: OrdenVideojuegoModel[] = itemCompra.map(
      (x: ItemCartModel) =>
      ({
        videojuegoId: x.producto.id,
        cantidad: x.cantidad,
      } as OrdenVideojuegoModel)
    );
    //Datos para el API
    let orden: OrdenModel = {
      fechaOrden: new Date(this.fecha),
      usuarioId: user.id, //usuarioId: 1
      videojuegos: detalle,
    } as OrdenModel;
    //Guardar orden
    this.ordenService.create(orden).subscribe((respuesta) => {
      this.cartService.deleteCart();
      this.noti.success(
        'Crear Orden',
        'Orden creada #' + respuesta.id,
        5000,
        '/orden-admin'
      );
    });

  }
  listado() {
    this.router.navigate(['/videojuego']);
  }
}
