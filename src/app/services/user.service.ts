import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {
  private readonly API_URL = '/api/users';

  constructor(private http: HttpClient) { }

  getUsername(): Observable<string> {
    return this.http.get<string>(`${this.API_URL}/me`);
  }
}
