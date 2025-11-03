import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideojuegoIndex } from './videojuego-index/videojuego-index';
import { VideojuegoAdmin } from './videojuego-admin/videojuego-admin';
import { VideojuegoDetail } from './videojuego-detail/videojuego-detail';
import { VideojuegoForm } from './videojuego-form/videojuego-form';
import { authGuard } from '../share/guards/auth.guard';

const routes: Routes = [
  { path: 'videojuego', component: VideojuegoIndex },
  //------ Restriccion de acceso por ruta -----
  {
    path: 'videojuego-admin',
    component: VideojuegoAdmin,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
  }, 
  { path: 'videojuego/create', component: VideojuegoForm },
  { path: 'videojuego/:id',    component: VideojuegoDetail },
  { path: 'videojuego/update/:id', component: VideojuegoForm },
];;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideojuegoRoutingModule { }
