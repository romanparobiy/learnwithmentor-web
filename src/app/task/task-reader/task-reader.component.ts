import { Component, OnInit, Input, Inject } from '@angular/core';
import { Task } from '../../common/models/task';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserTask } from '../../common/models/userTask';
import { AlertWindowsComponent } from '../../components/alert-windows/alert-windows.component';
import { DialogsService } from '../../components/dialogs/dialogs.service';
import { HttpStatusCodeService } from '../../common/services/http-status-code.service';
import { AuthService } from '../../common/services/auth.service';

@Component({
  selector: 'app-task-reader',
  templateUrl: './task-reader.component.html',
  styleUrls: ['./task-reader.component.css']
})
export class TaskReaderComponent implements OnInit {

  approved = 'A';

  @Input()
  public task: Task;
  public userTask: UserTask;
  public previousResult: string;

  constructor(public dialogRef: MatDialogRef<TaskReaderComponent>,
    private  alertwindow: AlertWindowsComponent,
    private dialogsService: DialogsService,
    private authService: AuthService,
    private httpStatusCodeService: HttpStatusCodeService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.userTask = data.userTask || {};
    this.task = data.task || {};
    this.previousResult = data.userTask.Result || {};
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  isTaskApproved() {
    return this.userTask.State === this.approved;
  }

  notExisting() {
    this.dialogRef.close();
    this.alertwindow.openSnackBar('You are not asigned to this plan!' , 'Ok');
  }

  ngOnInit() {
  }
}
