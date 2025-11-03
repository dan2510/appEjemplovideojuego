import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAPI } from './base-api';
import { OrdenModel } from '../../models/OrdenModel';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrdenService extends BaseAPI<OrdenModel> {

    constructor(httpClient: HttpClient) { 
        super(
          httpClient,
          environment.endPointOrden);
      }
}