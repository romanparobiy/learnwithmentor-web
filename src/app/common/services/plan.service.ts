import { Injectable } from '@angular/core';
import { Plan } from '../models/plan';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Image } from '../models/image';
import { Task } from '../models/task';
import { AlertWindowsComponent } from './../../components/alert-windows/alert-windows.component';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http: HttpClient,
    private alertWindow: AlertWindowsComponent) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

  private httpOptionsNoAuth = {
    headers: new HttpHeaders({ 'No-Auth': 'True' })
  };

  private url = `${environment.apiUrl}plan`;

  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.url, {headers: new HttpHeaders({ 'No-Auth': 'True' }) }).pipe(
      catchError(this.handleError<Plan[]>(`getPlans`))
    );
  }

  getSomePlans(previousAmount: number, amount: number): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.url}/some?prevAmount=${previousAmount}&amount=${amount}`,
      { headers: new HttpHeaders({ 'No-Auth': 'True' }) }).pipe(
        catchError(this.handleError<Plan[]>(`getPlans`))
      );
  }
  addTaskToPlan(planId: number, taskId: number, sectionId: number, priority: number): Observable<HttpResponse<any>> {
    const section = sectionId > 0 ? sectionId : '';
    const priorityUrl = priority !== null ? priority : '';
    const link = `${this.url}/${planId}/task/${taskId}?sectionId=${section}&priority=${priority}`;
    return this.http.put(link, null, this.httpOptions).pipe(
      catchError(r => of(r))
    );
  }
  getPlanTaskids(planid: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.url}/${planid}/plantaskids`).pipe(
      catchError(this.handleError<number[]>(`getPlanTaskIds`))
    );
  }
  getPlan(id: number): Observable<Plan> {
    return this.http.get<Plan>(`${this.url}/${id}`, {headers: new HttpHeaders({ 'No-Auth': 'True' }) }).pipe(
      catchError(this.handleError<Plan>(`getPlan id=${id}`))
    );
  }
  getPlanAndGroupInfo (groupid: number, planid: number): Observable<string> {
    return this.http.get<string>(`${this.url}/${planid}/group/${groupid}`).pipe(
      catchError(this.handleError<string>(`getPlanAndGroupInfo groupid=${groupid} planid${planid} `))
    );
  }
  updatePlan(plan: Plan): Observable<HttpResponse<any>> {
    return this.http.put(`${this.url}/${plan.Id}`, plan, { observe: 'response' }).pipe(
      catchError(r => of(r))
    );
  }

  createPlan(plan: Plan): Observable<any> {
    const link = `${this.url}/return`;
    return this.http.post<Plan>(link, plan, this.httpOptions).pipe(
      catchError(this.handleError<Plan>(`creating plan`)));
  }

  addPlan(plan: Plan): Observable<Plan> {
    return this.http.post<Plan>(this.url, plan, this.httpOptions).pipe(
      catchError(this.handleError<Plan>('addPlan'))
    );
  }

  deletePlanById(id: number): Observable<any> {
    const link = `${this.url}/${id}`;
    return this.http.delete<Plan>(link, { observe: 'response', headers: this.reqHeader}).pipe(
      catchError(this.handleError<Plan>('deletePlan'))
    );
  }

  updateImage(id: number, file: File) {
    const fd = new FormData;
    if (file) {
      fd.append('image', file, file.name);
      return this.http.post(`${this.url}/${id}/image`, fd, { observe: 'response' }).pipe(
        catchError(val => of(val))
      );
    }
  }

  getImage(id: number): Observable<HttpResponse<Image>> {
    return this.http.get(`${this.url}/${id}/image`, {
      observe: 'response',
      headers: new HttpHeaders({ 'No-Auth': 'True' })
    }).pipe(
      catchError(val => of(val)));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.alertWindow.openSnackBar(error.message, 'OK');
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
