import { Component, OnInit, Input, Inject } from '@angular/core';
import { Task } from '../../common/models/task';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../../common/services/task.service';
import { ImageService } from '../../common/services/image.service';
import { UserTask } from '../../common/models/userTask';
import { AlertWindowsComponent } from '../../components/alert-windows/alert-windows.component';
import { DialogsService } from '../../components/dialogs/dialogs.service';
import { HttpStatusCodeService } from '../../common/services/http-status-code.service';
import { AuthService } from '../../common/services/auth.service';
import { States } from './../../specific-group/specific-plan/states';

@Component({
  selector: 'app-task-submitor',
  templateUrl: './task-submitor.component.html',
  styleUrls: ['./task-submitor.component.css']
})
export class TaskSubmitorComponent implements OnInit {

  @Input()
  public task: Task;
  public userTask: UserTask;
  public previousResult: string;
  public exists: boolean;

  constructor(public dialogRef: MatDialogRef<TaskSubmitorComponent>,
    private  alertwindow: AlertWindowsComponent,
    private dialogsService: DialogsService,
    private taskService: TaskService,
    private imageService: ImageService,
    private authService: AuthService,
    private httpStatusCodeService: HttpStatusCodeService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.userTask = data.userTask || {};
    this.task = data.task || {};
    this.previousResult = data.userTask.Result || {};
  }

  onCancelClick() {
    if (this.previousResult !== this.userTask.Result) {
      this.dialogsService
      .confirm('Confirm Dialog', 'You have unsaved changes. Do you want to save them?')
      .subscribe(res => {
        if (res) {
          this.saveChanges();
          this.alertwindow.openSnackBar('Your changes are saved!' , 'Ok');
        }
      });
    }
    this.dialogRef.close();
  }

  onSubmitClick() {
    this.saveChanges();
  }

  isTaskApproved() {
    return this.userTask.State === States.approved;
  }

  saveChanges() {
    this.userTask.State = States.done;
    this.userTask.Icon = this.imageService.setImage(States.done);
    const utask = { Id: this.userTask.Id, Result: this.userTask.Result };
    this.taskService.updateUserTaskResult(utask as UserTask).subscribe(ut => ut.headers);
    this.taskService.updateUserTaskState(this.userTask.Id, this.userTask.State).subscribe();
  }

  notExisting() {
    this.dialogRef.close();
    this.alertwindow.openSnackBar('You are not asigned to this plan!' , 'Ok');
  }

  ngOnInit() {
  }
}
