import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VideojuegoService } from '../../share/services/api/videojuego.service';
import { GeneroService } from '../../share/services/api/genero.service';
import { PlataformaService } from '../../share/services/api/plataforma.service';
import { FileUploadService } from '../../share/services/api/file-upload.service';
import { NotificationService } from '../../share/services/app/notification.service';
import { minWordsValidator } from '../../share/validators/min-words-validator';
import { VideojuegoModel } from '../../share/models/VideojuegoModel';
import { GeneroModel } from '../../share/models/GeneroModel';
import { PlataformaModel } from '../../share/models/PlataformaModel';

@Component({
  selector: 'app-videojuego-form',
  standalone: false,
  templateUrl: './videojuego-form.html',
  styleUrls: ['./videojuego-form.css'],
})
export class VideojuegoForm implements OnInit, OnDestroy {
  // Subject para controlar la destrucción de suscripciones y evitar memory leaks
  private destroy$ = new Subject<void>();

  // Título del formulario, id del videojuego y bandera de creación/actualización
  titleForm = 'Crear';
  idVideojuego: number | null = null;
  isCreate = true;

  // Listas de géneros y plataformas manejadas con Angular 20 signals
  generosList = signal<GeneroModel[]>([]);
  plataformaList = signal<PlataformaModel[]>([]);

  // Formulario reactivo
  videojuegoForm!: FormGroup;

  // Variables para gestión de imagen
  currentFile?: File;
  preview = '';
  nameImage = 'image-not-found.jpg';
  previousImage: string | null = null;

  // Expresiones regulares para validaciones
  number4digits = /^\d{4}$/;
  number2decimals = /^[0-9]+[.,]{1,1}[0-9]{2,2}$/;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private vjService: VideojuegoService,
    private generoService: GeneroService,
    private plataformaService: PlataformaService,
    private uploadService: FileUploadService,
    private noti: NotificationService
  ) { }

  /**
   * Ciclo de vida OnInit: inicializa el formulario, carga listas y verifica si es actualización
   */
  ngOnInit(): void {
    this.initForm();          // Inicializa formulario reactivo
    this.loadGeneros();       // Carga lista de géneros
    this.loadPlataformas();   // Carga lista de plataformas

    // Suscripción a parámetros de ruta para determinar si es crear o actualizar
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.idVideojuego = params['id'] ?? null;
      this.isCreate = this.idVideojuego === null;
      this.titleForm = this.isCreate ? 'Crear' : 'Actualizar';

      // Si hay id, cargar los datos del videojuego para actualizar
      if (this.idVideojuego) {
        this.vjService
          .getById(this.idVideojuego)
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => this.patchFormValues(data));
      }
    });
  }

  /**
   * Inicializa el formulario reactivo con validaciones
   */
  private initForm(): void {
    this.videojuegoForm = this.fb.group({
      id: [null],
      nombre: [null, [Validators.required, Validators.minLength(2)]],
      descripcion: [null, [Validators.required, minWordsValidator(3)]],
      precio: [null, [Validators.required, Validators.pattern(this.number2decimals)]],
      publicar: [true, Validators.required],
      imagen: [this.nameImage],
      generos: [null, Validators.required],
      plataformas: this.fb.array([]),
    });
  }

  /**
   * Getter para acceder al FormArray de plataformas
   */
  get plataformas(): FormArray {
    return this.videojuegoForm.get('plataformas') as FormArray;
  }

  /**
   * Carga los géneros desde el API y actualiza la signal
   */
  private loadGeneros() {
    this.generoService.get().pipe(takeUntil(this.destroy$))
      .subscribe(data => this.generosList.set(data));
  }

  /**
   * Carga las plataformas desde el API y actualiza la signal
   */
  private loadPlataformas() {
    this.plataformaService.get().pipe(takeUntil(this.destroy$))
      .subscribe(data => this.plataformaList.set(data));
  }

  /**
   * Carga los valores del formulario con los datos del videojuego a actualizar
   * @param data Datos del videojuego obtenidos del API
   */
  private patchFormValues(data: VideojuegoModel) {
    this.videojuegoForm.patchValue({
      id: data.id,
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: parseFloat(data.precio.toString()).toFixed(2),
      publicar: data.publicar,
      generos: data.generos.map(g => g.id),
      imagen: data.imagen,
    });

    // Actualiza la imagen previa
    this.nameImage = data.imagen || 'image-not-found.jpg';
    this.previousImage = data.imagen;

    // Limpia y agrega plataformas al FormArray
    this.plataformas.clear();
    data.plataformas.forEach(plat => {
      this.plataformas.push(
        this.fb.group({
          anno_lanzamiento: [plat.anno_lanzamiento, [Validators.required, Validators.pattern(this.number4digits)]],
          plataformaId: [plat.plataforma.id, Validators.required],
        })
      );
    });
  }

  /**
   * Agrega un nuevo grupo de plataforma al FormArray
   */
  addPlataforma() {
    this.plataformas.push(
      this.fb.group({
        anno_lanzamiento: [new Date().getFullYear(), [Validators.required, Validators.pattern(this.number4digits)]],
        plataformaId: [null, Validators.required],
      })
    );
  }

  /**
   * Elimina una plataforma del FormArray según el índice
   * @param index Índice de la plataforma a eliminar
   */
  removePlataforma(index: number) {
    this.plataformas.removeAt(index);
  }

  /**
   * Gestiona la selección de archivo para la imagen del videojuego
   * @param event Evento de cambio de input file
   */
  selectFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.currentFile = input.files[0];
      this.nameImage = this.currentFile.name;
      const reader = new FileReader();
      reader.onload = e => (this.preview = e.target?.result as string);
      reader.readAsDataURL(this.currentFile);
    } else {
      // Si no se selecciona archivo, restaurar imagen previa
      this.currentFile = undefined;
      this.preview = '';
      this.nameImage = this.previousImage || 'image-not-found.jpg';
    }
  }

  /**
   * Envía el formulario: valida, carga la imagen y guarda/actualiza el videojuego
   */
  submitVideojuego() {
    this.videojuegoForm.markAllAsTouched();
    // Marcar cada control dentro del FormArray 'plataformas'
    this.plataformas.controls.forEach(group => group.markAllAsTouched());

    if (this.videojuegoForm.invalid) {
      this.noti.error('Formulario Inválido', 'Revise los campos marcados.', 5000);
      return;
    }

    // Prepara payloads para el API
    const formValue = this.videojuegoForm.value;
    const payloadGeneros = formValue.generos?.map((id: number) => ({ id })) ?? [];
    const payloadPlataformas = formValue.plataformas?.map((p: any) => ({
      anno_lanzamiento: Number(p.anno_lanzamiento),
      plataformaId: Number(p.plataformaId),
    })) ?? [];
    const payloadPrecio = typeof formValue.precio === 'string' ? parseFloat(formValue.precio) : formValue.precio;

    // Función interna para guardar o actualizar videojuego
    const saveVideojuego = () => {
      const payload = {
        ...formValue,
        generos: payloadGeneros,
        plataformas: payloadPlataformas,
        precio: payloadPrecio,
        imagen: this.nameImage,
      };

      const request$ = this.isCreate
        ? this.vjService.create(payload)
        : this.vjService.update(payload);

      request$.pipe(takeUntil(this.destroy$)).subscribe(data => {
        this.noti.success(
          this.isCreate ? 'Crear Videojuego' : 'Actualizar Videojuego',
          `Videojuego ${data.nombre} ${this.isCreate ? 'creado' : 'actualizado'}`,
          5000,
          '/videojuego-admin'
        );
      });
    };

    // Primero subir imagen si se seleccionó archivo
    if (this.currentFile) {
      this.uploadService.upload(this.currentFile, this.previousImage)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          this.nameImage = data.fileName;
          saveVideojuego();
        });
    } else {
      saveVideojuego();
    }
  }

  /**
   * Resetea el formulario a valores iniciales
   */
  onReset() {
    this.videojuegoForm.reset();
    this.preview = '';
    this.currentFile = undefined;
    this.nameImage = 'image-not-found.jpg';
    this.plataformas.clear();
    this.addPlataforma();
  }

  /**
   * Navega de regreso a la lista de videojuegos
   */
  onBack() {
    this.router.navigate(['/videojuego-admin']);
  }

  /**
   * Ciclo de vida OnDestroy: limpia suscripciones
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
