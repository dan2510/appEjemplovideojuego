import { Component, computed, inject } from '@angular/core';
import { CartService } from '../../share/services/app/cart.service';
import { AuthenticationService } from '../../share/services/app/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  private router = inject(Router);
  private authService = inject(AuthenticationService);
  private cartService = inject(CartService);

  /** Signals */
  readonly isAuthenticated = this.authService.authenticated;
  readonly currentUser = this.authService.usuario;
  readonly qtyItems = this.cartService.qtyItems;

  /** Control de roles */
readonly role = computed(() => {
  const user = this.currentUser();
  return typeof user?.role === 'string'
    ? user.role                 // ej. "ADMIN"
    : user?.role?.nombre ?? null;
});
  readonly isAdmin = computed(() => this.role() === 'ADMIN');
  readonly isUser = computed(() => this.role() === 'USER');

  /** Navegación */
  login = () => this.router.navigate(['/usuario/login']);
  logout = () => this.authService.logout();
}