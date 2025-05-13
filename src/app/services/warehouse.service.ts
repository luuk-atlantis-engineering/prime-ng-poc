import { Injectable } from '@angular/core';
import { Warehouse } from '../shared/models/warehouse.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResponse } from '../shared/models/paged.response';
import { GetWarehousesRequest } from '../shared/models/get-warehouses.request';

@Injectable()
export class WarehouseService {
  private readonly API_URL = '/api/warehouses';

  constructor(private http: HttpClient) { }

  get(request: GetWarehousesRequest): Observable<PagedResponse<Warehouse>> {
    return this.http.get<PagedResponse<Warehouse>>(
      this.API_URL, { params: request as any });
  }

  create(warehouse: Warehouse): Observable<Warehouse> {
    return this.http.post<Warehouse>(this.API_URL, warehouse);
  }

  update(warehouse: Warehouse): Observable<Warehouse> {
    return this.http.put<Warehouse>(`${this.API_URL}/${warehouse.id}`, warehouse);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
