import { Component, OnInit, Input, Inject } from '@angular/core';
import { Task } from '../../common/models/task';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../../common/services/task.service';
import { UserTask } from '../../common/models/userTask';
import { Message } from '../../common/models/message';
import { Observable, of } from 'rxjs';
import { AlertWindowsComponent } from '../../components/alert-windows/alert-windows.component';
import { HttpStatusCodeService } from '../../common/services/http-status-code.service';
import { AuthService } from '../../common/services/auth.service';
import { CommentService } from '../../common/services/comment.service';
import { Comment } from '../../common/models/comment';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  @Input()
  task: Task;
  public userTask: UserTask;
  public messages: Message[];
  public comments: Comment[];
  public notExistingMessage: string;
  public userMessage: string;
  public recentMessages: Message[] = [];
  public userId: number;
  public minValueLength = 2;
  public userTaskId: number;

  constructor(public dialogRef: MatDialogRef<ConversationComponent>,
    private alertwindow: AlertWindowsComponent,
    private taskService: TaskService,
    private authService: AuthService,
    private commentService: CommentService,
    private httpStatusCodeService: HttpStatusCodeService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.task = data.task || {};
    this.userTask = data.userTask || {};
    this.userTaskId = data.task.Id || {};
  }

  notExistingUserTask() {
    this.dialogRef.close();
    this.alertwindow.openSnackBar('You are not asigned to this plan!', 'Ok');
  }

  async getUTMessages(userTaskId: number) {
    if (this.authService.isMentor()) {
      const _comment: any = {
        Id: 0,
        Text: 'string',
        CreatorId: this.authService.getUserId(),
        CreatorFullName: this.authService.getUserFullName(),
        CreateDate: new Date().toISOString(),
        ModDate: new Date().toISOString(),
      };

    } else {
      this.taskService.getMessages(userTaskId).subscribe(
        mes => {
          if (mes.body && mes.body.length === 0) {
            this.notExistingMessage = 'Your conversation with mentor is empty. \n' +
              'Ask some questions, if you have any.';
          } else {
            this.messages = mes.body;
          }
        });
    }
  }

  onSendClick() {
    if (this.userMessage !== '' && this.userMessage) {
      const mes = { Text: this.userMessage, SenderId: this.userId };
      this.taskService.sendMessage(this.userTaskId, mes as Message).subscribe(
        resp => {
          if (resp.ok) {
            this.recentMessages.push(mes as Message);
            this.notExistingMessage = '';
          } else {
            this.alertwindow.openSnackBar('Your message is too long!', 'Ok');
          }
        }
      );
    }
    this.userMessage = '';
  }

  onKeyPress(event) {
    if (event.key === 'Enter' && this.userMessage.length >= this.minValueLength) {
      this.onSendClick();
      this.userMessage = '';
    }
  }

  setClasses() {
    return {
      fab: true,
      disable: (this.userMessage || '').length < this.minValueLength,
    };
  }

  ngOnInit() {
    this.getUTMessages(this.userTask.Id || this.task.Id);
  }
}
