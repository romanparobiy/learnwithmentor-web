import { Injectable } from '@angular/core';
import { Observable, of, observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { User } from '../models/user';
import { Group } from '../models/group';
import { Plan } from '../models/plan';
import { UserWithImage } from '../models/userWithImage';
import { Email } from '../models/email';
import { AlertWindowsComponent } from './../../components/alert-windows/alert-windows.component';


@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient,
    private alertWindow: AlertWindowsComponent) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

  private url = `${environment.apiUrl}group`;

  getGroup(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.url}/${id}`).pipe(
      catchError(this.handleError<Group>(`getGroup id=${id}`))
    );
  }

  getGroupUsers(id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/${id}/users`).pipe(
      catchError(this.handleError<User[]>(`getGroupUsers`))
    );
  }

  getGroupUsersWithImage(id: number): Observable<UserWithImage[]> {
    return this.http.get<UserWithImage[]>(`${this.url}/${id}/userimages`).pipe(
      catchError(this.handleError<UserWithImage[]>(`getGroupUsers`))
    );
  }

  getUserGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.url}/mygroups`).pipe();
  }

  getGroupPlans(id: number): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.url}/${id}/plans`).pipe(
      catchError(this.handleError<Plan[]>(`getGroupPlans`))
    );
  }

  searchNotUsers(param: string, groupId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/searchinNotInvolvedUsers?searchKey=${param}&groupId=${groupId}`).pipe(
      catchError(this.handleError<User[]>(`searchUsersNotInGroup`))
    );
  }

  searchNotPlans(param: string, groupId: number): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.url}/searchinNotUsedPlan?searchKey=${param}&groupId=${groupId}`).pipe(
      catchError(this.handleError<Plan[]>(`searchPlansNotInGroup`))
    );
  }

  addUserToGroup(userId: number, groupId: number): Observable<HttpResponse<any>> {
    return this.http.put(`${this.url}/${groupId}/user`, [userId], { observe: 'response', headers: this.reqHeader });
  }

  addPlanToGroup(planId: number, groupId: number): Observable<HttpResponse<any>> {
     return this.http.put(`${this.url}/${groupId}/plan`, [planId], { observe: 'response', headers: this.reqHeader });
  }

  removePlanFromGroup(groupId: number, planId: number): Observable<HttpResponse<any>> {
    return this.http.delete<Plan>(`${this.url}/removePlanFromGroup?groupId=${groupId}&planToRemoveId=${planId}`,
    { observe: 'response', headers: this.reqHeader });
  }

  removeUserFromGroup(groupId: number, userId: number): Observable<HttpResponse<any>> {
    return this.http.delete<User>(`${this.url}/removeUserFromGroup?groupId=${groupId}&userToRemoveId=${userId}`,
    { observe: 'response', headers: this.reqHeader });
  }

  createGroup(group: Group): Observable<HttpResponse<any>> {
    return this.http.post(`${this.url}`, group, { observe: 'response', headers: this.reqHeader });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.alertWindow.openSnackBar(error.message, 'OK');
      return of(result as T);
    };
  }
}
