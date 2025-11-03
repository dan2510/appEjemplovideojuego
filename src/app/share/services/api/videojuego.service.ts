import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAPI } from './base-api';
import { VideojuegoModel } from '../../models/VideojuegoModel';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class VideojuegoService extends BaseAPI<VideojuegoModel> {

    constructor(httpClient: HttpClient) { 
        super(
          httpClient,
          environment.endPointVideojuego);
      }
}