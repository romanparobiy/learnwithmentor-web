import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { User } from '../models/user';
import { Group } from '../models/group';
import { Plan } from '../models/plan';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private url = `${environment.apiUrl}group`;

  getGroup(id: number) {
    return this.http.get(`${this.url}/${id}`).pipe(
      catchError(this.handleError<Group>(`getGroup id=${id}`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      //todo put into sharable service
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}