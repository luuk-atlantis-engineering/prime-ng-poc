import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetWarehouseGroupsRequest } from '../shared/models/get-warehouse-groups.request';
import { PagedResponse } from '../shared/models/paged.response';
import { WarehouseGroup } from '../shared/models/warehouse-group.model';

@Injectable()
export class WarehouseGroupService {
  private readonly API_URL = '/api/warehousegroups';

  constructor(private http: HttpClient) { }

  get(request: GetWarehouseGroupsRequest): Observable<PagedResponse<WarehouseGroup>> {
    return this.http.get<PagedResponse<WarehouseGroup>>(
      this.API_URL, { params: request as any });
  }

  create(warehouseGroup: WarehouseGroup): Observable<WarehouseGroup> {
    return this.http.post<WarehouseGroup>(this.API_URL, warehouseGroup);
  }

  update(warehouseGroup: WarehouseGroup): Observable<WarehouseGroup> {
    return this.http.put<WarehouseGroup>(`${this.API_URL}/${warehouseGroup.id}`, warehouseGroup);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
