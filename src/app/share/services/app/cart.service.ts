import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { ItemCartModel } from '../../models/ItemCartModel';
import { VideojuegoModel } from '../../models/VideojuegoModel';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  //Noticar acciones
  private notiService = inject(NotificationService);
  /** 
   * Signal principal con el estado del carrito
   * Se inicializa leyendo localStorage
   */
  private cart = signal<ItemCartModel[]>(this.loadCartFromStorage());

  /**
   * Observable reactivo: lista completa del carrito
   */
  readonly itemsCart = computed(() => this.cart());

  /** Cantidad total de artículos */
  readonly qtyItems = computed(() =>
    this.cart().reduce((sum, item) => sum + item.cantidad, 0)
  );

  /** Total del carrito */
  readonly total = computed(() =>
    this.cart().reduce((total, item) => total + item.subtotal, 0)
  );

  constructor() {
    /**
     * Guardar automáticamente cambios en localStorage
     * Reemplaza cualquier `saveCart()` manual
     */
    effect(() => {
      localStorage.setItem('orden', JSON.stringify(this.cart()));
    });
  }

  /** Leer carrito inicial desde localStorage */
  private loadCartFromStorage(): ItemCartModel[] {
    try {
      const data = localStorage.getItem('orden');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /** Calcular subtotal de un producto */
  private calculateSubtotal(producto: VideojuegoModel, cantidad: number): number {
    return producto.precio * cantidad;
  }

  // ---- MÉTODOS DEL CARRITO ---- //

  /** 
   * Agrega o actualiza un producto en el carrito 
   * Si `quantity` existe, establece valor; si no, incrementa en 1
   */
 addToCart(producto: VideojuegoModel, quantity?: number): void {
  this.cart.update((current) => {
    const list = [...current];
    const index = list.findIndex(item => item.producto.id === producto.id);

    if (index >= 0) {
      const item = list[index];

      let newQty = item.cantidad;
      if (quantity !== undefined) {
        newQty = item.cantidad + Number(quantity); //puede restar o sumar
      } else {
        newQty = item.cantidad + 1; //suma
      }

      if (newQty <= 0) {
        //Elimina solo si ya llegó a 0
        list.splice(index, 1);
        this.notiService.warning('Carrito', `Se eliminó "${producto.nombre}"`, 2000)
      } else {
        list[index] = {
          ...item,
          cantidad: newQty,
          subtotal: this.calculateSubtotal(item.producto, newQty),
        };
      }
    } else {
      //Nuevo producto
      list.push({
        producto,
        cantidad: quantity ? Number(quantity) : 1,
        subtotal: this.calculateSubtotal(producto, quantity ? Number(quantity) : 1),
      });
      this.notiService.info('Carrito', `Se agregp "${producto.nombre}"`, 2000)
    }

    return list;
  });
}


  /** Eliminar un producto por ID */
  removeFromCart(productId: number): void {
    this.cart.update((current) =>
      current.filter(item => item.producto.id !== productId)
    );
  }

  /** Vaciar todo el carrito */
  deleteCart(): void {
    this.cart.set([]);
  }
}
