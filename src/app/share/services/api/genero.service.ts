import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAPI } from './base-api';
import { GeneroModel } from '../../models/GeneroModel';
import { environment } from '../../../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class GeneroService extends BaseAPI<GeneroModel> {

    constructor(httpClient: HttpClient) { 
        super(
          httpClient,
          environment.endPointGenero);
      }
}