import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Task } from '../models/task';
import { Observable } from 'rxjs/internal/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { PlanService } from './plan.service';
import { Plan } from '../models/plan';
import { UserTask } from '../models/userTask';
import { UsersTasks } from '../models/usersTasks';
import { Message } from '../models/message';
import { text } from '@angular/core/src/render3/instructions';
import { StringifyOptions } from 'querystring';
import { Pagination } from '../models/pagination';
import { Section } from '../models/sections';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const httpOptionsObserve = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response'
};
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }
  // private url = '../assets/tasks.json';
  private url = `${environment.apiUrl}`;


  getTasks(planId?: number): Observable<Task[]> {
    if (planId != null) {
      return this.http.get<Task[]>(`${this.url}plan/${planId}/tasks`).pipe(
        catchError(this.handleError<Task[]>(`get Tasks for Plan`)));
    } else {
      return this.http.get<Task[]>(this.url + 'task').pipe(
        catchError(this.handleError<Task[]>(`get Tasks`)));
    }
  }

  getTasksInSections(planId: number): Observable<Section[]> {
    if (planId != null) {
      return this.http.get<Section[]>(`${this.url}plan/${planId}/sections`).pipe(
        catchError(this.handleError<Section[]>(`get Section for Plan`)));
    }
  }
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.url}task/${id}`).pipe(
      catchError(this.handleError<Task>(`getTask`)));
  }
  getPage(pageSize: number, pageNumber: number): Observable<Pagination<Task>> {
    return this.http.get<Pagination<Task>>(`${this.url}task/pageSize/${pageSize}/pageNumber/${pageNumber}`).pipe(
      catchError(this.handleError<Pagination<Task>>(`getPagedTasks`)));
  }

  getTasksNotInPlan(id: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.url}plan/${id}/tasks/notinplan`).pipe(
      catchError(this.handleError<Task[]>(`getTasks`)));
  }

  updateTask(task: Task): Observable<any> {
    const link = `${this.url}task/${task.Id}`;
    return this.http.put<Task>(link, task, httpOptions).pipe(
      catchError(this.handleError<Task>(`updating task id=${task.Id}`)));
  }

  deleteTask(task: Task): Observable<any> {
    const link = `${this.url}task/${task.Id}`;
    return this.http.delete<Task>(link, httpOptions).pipe(
      catchError(this.handleError<Task>(`deleting task id=${task.Id}`)));
  }
  getAllTasksStateForAllGroupUsers(userIds: number[], planTaskIds: number[]): Observable<any> {
    let request = `${this.url}task/state/all?`;
    for (const user of userIds) {
      request = request + `userIds=${user}&`;
    }
    for (const planTask of planTaskIds) {
      request = request + `planTaskIds=${planTask}&`;
    }
    request = request.substring(0, request.length - 1);
    return this.http.get<any>(request).pipe(
      catchError(val => of(val)));
  }

  getUsersTasksForGroupUsers(userId: number[], planTaskIds: number[]): Observable<UsersTasks[]> {
    let request = `${this.url}task/allusertasks?`;
    for (const user of userId) {
      request = request + `userId=${user}&`;
    }
    for (const planTask of planTaskIds) {
      request = request + `planTaskId=${planTask}&`;
    }
    request = request.substring(0, request.length - 1);
    return this.http.get<UsersTasks[]>(request).pipe(
      catchError(val => of(val)));
  }

  getUserTasks(userId: number, planTaskIds: number[]): Observable<UserTask[]> {
    let request = `${this.url}task/usertasks?userId=${userId}&`;
    for (const planTask of planTaskIds) {
      request = request + `planTaskId=${planTask}&`;
    }
    request = request.substring(0, request.length - 1);
    return this.http.get<UserTask[]>(request).pipe(
      catchError(val => of(val)));
  }
  createTask(task: Task, planId?: number): Observable<any> {
    let link = '';
    if (planId == null) {
      link = `${this.url}task`;
    } else {
      link = `${this.url}plan/${planId}/newTask`;
    }
    return this.http.post<Task>(link, task, httpOptions).pipe(
      catchError(this.handleError<Task>(`creating task`)));
  }

  createTaskWithId(task: Task): Observable<any> {
    const link = `${this.url}task/return`;
    return this.http.post<Task>(link, task, httpOptions).pipe(
      catchError(this.handleError<Task>(`creating task`)));

  }

  getUserTask(planTaskId: number, userId: number): Observable<HttpResponse<UserTask>> {
    const link = `${this.url}task/usertask?planTaskId=${planTaskId}&userId=${userId}`;
    return this.http.get<UserTask>(link, { observe: 'response' }).pipe(
      catchError(val => of(val)));
  }

  getMessages(userTaskId: number): Observable<HttpResponse<Message[]>> {
    const link = `${this.url}task/userTask/${userTaskId}/messages`;
    return this.http.get<Message[]>(link, { observe: 'response' }).pipe(
      catchError(val => of(val)));
  }

  sendMessage(userTaskId: number, message: Message): Observable<any> {
    const link = `${this.url}task/userTask/${userTaskId}/messages`;
    return this.http.post<Message>(link, message, { observe: 'response' }).pipe(
      catchError(val => of(val)));
  }

  updateUserTaskResult(userTask: UserTask): Observable<any> {
    const reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
    const link = `${this.url}task/usertask/result?userTaskId=${userTask.Id}`;
    return this.http.put<string>(link, userTask.Result as string, { headers: reqHeader }).pipe(
      catchError(val => of(val)));
  }

  updateProposedEndDate(userTaskId: number, date: string): Observable<any> {
    const link = `${this.url}task/usertask/proposedEndDate?userTaskId=${userTaskId}&proposeEndDate=${date}`;
    return this.http.put<string>(link, date, httpOptions).pipe(
      catchError(val => of(val)));
  }

  deleteProposedEndDate(userTaskId: number): Observable<any> {
    const link = `${this.url}task/usertask/proposedEndDate?userTaskId=${userTaskId}`;
    return this.http.delete<string>(link, httpOptions).pipe(
      catchError(val => of(val)));
  }

  updateEndDate(userTaskId: number): Observable<any> {
    const link = `${this.url}task/usertask/endDate?userTaskId=${userTaskId}`;
    return this.http.put<string>(link, httpOptions).pipe(
      catchError(val => of(val)));
  }

  updateUserTaskState(userTaskId: number, newStatus: string): Observable<any> {
    const link = `${this.url}task/usertask/status?userTaskId=${userTaskId}&newStatus=${newStatus}`;
    return this.http.put<string>(link, newStatus).pipe(
      catchError(val => of(val)));
  }
  updateTaskResult(userTaskId: number, newResult: string): Observable<any> {
    const link = `${this.url}task/usertask/result?userTaskId=${userTaskId}&newResult=${newResult}`;
    return this.http.put(link, null, httpOptions).pipe(
      catchError(val => of(val)));
  }

  search(param: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.url}task/search?key=${param}`).pipe(
      catchError(this.handleError<Task[]>(`searchTasks`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // console.error(error);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
