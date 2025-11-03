import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CoreModule } from './core/core-module';
import { ShareModule } from './share/share-module';
import { HomeModule } from './home/home-module';
import { UserModule } from './user/user-module';
import { VideojuegoModule } from './videojuego/videojuego-module';
import { OrdenModule } from './orden/orden-module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgxSonnerToaster } from 'ngx-sonner';
import { HttpErrorInterceptorService } from './share/interceptor/http-error-interceptor.service';
import { HttpAuthInterceptorService } from './share/interceptor/http-auth-interceptor.service';
import { ReporteModule } from './reporte/reporte-module';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    NgxSonnerToaster,
    CoreModule,
    ShareModule,
    HomeModule,
    UserModule,
    VideojuegoModule,
    OrdenModule,
    ReporteModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuthInterceptorService,
      multi: true
    }

  ],
  bootstrap: [App]
})
export class AppModule { }
