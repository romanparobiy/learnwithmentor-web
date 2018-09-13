import { Injectable } from '@angular/core';
import { Comment } from '../models/comment';
import { Role } from '../models/role';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { AlertWindowsComponent } from './../../components/alert-windows/alert-windows.component';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient,
    private alertWindow: AlertWindowsComponent) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private url = `${environment.apiUrl}`;

  getComments(taskId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.url}task/${taskId}/comment`).pipe(
      catchError(this.handleError<Comment[]>(`getComments`))
    );
  }

  getComment(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.url}comment/${id}`).pipe(
      catchError(this.handleError<Comment>(`getComment id=${id}`))
    );
  }

  updateComment(comment: Comment): Observable<any> {
    return this.http.put<Comment>(`${this.url}comment/${comment.Id}`, comment, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateComment'))
    );
  }

  addComment(comment: Comment, taskId: number): Observable<Comment> {
    return this.http.post<Comment>(`${this.url}task/${taskId}/comment`, comment, this.httpOptions).pipe(
      catchError(this.handleError<Comment>('addComment'))
    );
  }

  deleteCommentById(id: number): Observable<Comment> {
    return this.http.delete<Comment>(`${this.url}comment/${id}`, this.httpOptions).pipe(
      catchError(this.handleError<Comment>('deleteComment'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.alertWindow.openSnackBar(error.message, 'OK');
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
