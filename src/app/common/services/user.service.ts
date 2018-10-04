import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Image } from '../models/image';
import { Role } from '../models/role';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Register } from '../models/register';
import { Login } from '../models/login';
import { Statistics } from '../models/statistics';
import { Pagination } from '../models/pagination';
import { PageEvent } from '@angular/material';
import { AlertWindowsComponent } from './../../components/alert-windows/alert-windows.component';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  roleName: string;
  constructor(private http: HttpClient,
    private alertWindow: AlertWindowsComponent) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private url = `${environment.apiUrl}user`;


  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url).pipe(
      catchError(this.handleError<User[]>(`getUsers`))
    );
  }

  getUser(id: number = 0): Observable<User> {
    return this.http.get<User>(`${this.url}/profile?id=${id}`).pipe(
      catchError(this.handleError<User>(`getUser`))
    );
  }
  getPage(pageSize: number, pageNumber: number): Observable<Pagination<User>> {
    return this.http.get<Pagination<User>>(`${this.url}?pageSize=${pageSize}&pageNumber=${pageNumber}`).pipe(
      catchError(this.handleError<Pagination<User>>(`getPagedUsers`)));
  }

  getUserByRole_id(id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/inrole/${id}`).pipe(
      catchError(this.handleError<User[]>(`getUserbyrole`))
    );
  }
  getPageByRole_id(id: number, pageSize: number, pageNumber: number): Observable<Pagination<User>> {
    return this.http.get<Pagination<User>>(`${this.url}/inrole/${id}?pageSize=${pageSize}&pageNumber=${pageNumber}`).pipe(
      catchError(this.handleError<Pagination<User>>(`getUserbyrole`))
    );
  }

  getUserByState(state: boolean): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/instate/${state}`).pipe(
      catchError(this.handleError<User[]>(`getUserbystate`))
    );
  }
  getPageByState(state: boolean, pageSize: number, pageNumber: number): Observable<Pagination<User>> {
    return this.http.get<Pagination<User>>(`${this.url}/instate/${state}?pageSize=${pageSize}&pageNumber=${pageNumber}`).pipe(
      catchError(this.handleError<Pagination<User>>(`getUserbystate`))
    );
  }

  updateUser(user: User): Observable<HttpResponse<any>> {
    return this.http.put(`${this.url}/${user.Id}`, user, { observe: 'response' }).pipe(
      catchError(r => of(r))
    );
  }

  updateMultipleUser(users: User[]): Observable<HttpResponse<any>> {
    return this.http.put(`${this.url}/update-multiple`, users, { observe: 'response' }).pipe(
      catchError(r => of(r))
    );
  }

  registerUser(register: Register) {
    const body: Register = {
      Password: register.Password,
      Email: register.Email,
      FirstName: register.FirstName,
      LastName: register.LastName
    };
    const reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
    return this.http.post(this.url, body, { headers: reqHeader });
  }


  blockUserById(id: number) {
    return this.http.delete(`${this.url}/${id}`).pipe(
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.url}/roles`).pipe(
      catchError(this.handleError<Role[]>('getRole'))
    );
  }

  userAuthentication(login: Login) {
    const body: Login = {
      Password: login.Password,
      Email: login.Email
    };
    const reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'True' });
    return this.http.post(`${environment.apiUrl}` + 'token', body, { headers: reqHeader });
  }

  search(param: string, roleName: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/search?key=${param}&role=${roleName}`).pipe(
      catchError(this.handleError<User[]>(`searchUsers`))
    );
  }
  searchPage(param: string, roleName: string, pageSize: number, pageNumber: number): Observable<Pagination<User>> {
    return this.http.get<Pagination<User>>(`${this.url}/search?key=${param}&role=${roleName}
    &pageSize=${pageSize}&pageNumber=${pageNumber}`).pipe(
      catchError(this.handleError<Pagination<User>>(`searchUsers`))
      );
  }

  updateImage(id: number, file: File) {
    const fd = new FormData;
    fd.append('image', file, file.name);
    return this.http.post(`${this.url}/${id}/image`, fd, { observe: 'response' }).pipe(
      catchError(val => of(val)));
  }

  getImage(id: number): Observable<HttpResponse<Image>> {
    return this.http.get(`${this.url}/${id}/image`, { observe: 'response' }).pipe(
      catchError(val => of(val)));
  }

  getStatistics(): Observable<HttpResponse<Statistics>> {
    return this.http.get(`${this.url}/statistics`, { observe: 'response' }).pipe(
      catchError(val => of(val)));
  }

  updatePassword(newPass: string) {
    const reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<string>(`${this.url}/newpassword`, newPass, { observe: 'response', headers: reqHeader }).pipe(
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
