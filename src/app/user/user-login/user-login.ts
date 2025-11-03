import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../share/services/app/notification.service';
import { AuthenticationService } from '../../share/services/app/authentication.service';

@Component({
  selector: 'app-user-login',
  standalone: false,
  templateUrl: './user-login.html',
  styleUrl: './user-login.css',
})
export class UserLogin {
  hide = true;
  formulario!: FormGroup;
  makeSubmit: boolean = false;
  infoUsuario: any;
   constructor(
    public fb: FormBuilder,
    private notificacion: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) {
    this.reactiveForm();
  }
  // Definir el formulario con su reglas de validación
  reactiveForm() {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {}

  onReset() {
    this.formulario.reset();
  }
  submitForm() {
    this.makeSubmit = true;
    // Validación
    if (this.formulario.invalid) {
      this.notificacion.warning('Formulario incompleto', 'Por favor, complete todos los campos requeridos.');
      return;
    }

    // Obtener las credenciales del formulario
    const credentials = this.formulario.value;

    // Llama al método loginUser del AuthenticationService
    this.authService.loginUser(credentials).subscribe({
      next: (response) => {
        console.log("Login",response)
        // La autenticación fue exitosa.
        // El AuthenticationService ya guarda el token y obtiene el perfil.
        this.notificacion.success('Inicio de sesión exitoso', 'Bienvenido de nuevo.',3000,'/inicio');
      },
      error: (error) => {
        // Manejo de errores de autenticación
        console.error('Error de inicio de sesión:', error);
        let errorMessage = 'Error al iniciar sesión. Por favor, intente de nuevo.';
        if (error.status === 401) {
          errorMessage = 'Credenciales incorrectas. Verifique su email y contraseña.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.notificacion.error('Error de autenticación', errorMessage);
      }
    });
  }

}
