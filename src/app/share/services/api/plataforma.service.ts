import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAPI } from './base-api';
import { PlataformaModel } from '../../models/PlataformaModel';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PlataformaService extends BaseAPI<PlataformaModel> {

    constructor(httpClient: HttpClient) { 
        super(
          httpClient,
          environment.endPointPlataforma);
      }
}