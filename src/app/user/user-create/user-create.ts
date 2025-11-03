import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { passwordsMatchValidator } from '../../share/validators/password-match-validator';
import { RoleModel } from '../../share/models/RoleModel';
import { RolService } from '../../share/services/api/rol.service';
import { NotificationService } from '../../share/services/app/notification.service';

@Component({
  selector: 'app-user-create',
  standalone: false,
  templateUrl: './user-create.html',
  styleUrl: './user-create.css',
})
export class UserCreate {
  hide = true;
  usuario: any;
  roles: any;
  formCreate!: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private rolService: RolService,
    private notificacion: NotificationService
  ) {
    this.reactiveForm();
  }

  reactiveForm() {
    this.formCreate = this.fb.group(
      {
        nombre: ['', [Validators.required]],
        email: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirmpassword: ['', [Validators.required]],
        role: ['', [Validators.required]],
      },
      { validators: passwordsMatchValidator }
    );
    this.getRoles();
  }
  ngOnInit(): void {}
  submitForm() {
    this.formCreate.markAllAsTouched();
    //Validación
    if (this.formCreate.invalid) {
      return;
    }
    //Crear usuario

    this.router.navigate(['/usuario/login']);
  }
  onReset() {
    this.formCreate.reset();
  }
  getRoles() {
      this.rolService
          .get()
          .subscribe((respuesta: RoleModel[]) => {
            this.roles = respuesta;
          });
  }
}
