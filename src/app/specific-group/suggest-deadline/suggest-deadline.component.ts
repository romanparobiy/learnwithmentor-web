import { Component, OnInit, Input, Inject } from '@angular/core';
import { UserTask } from '../../common/models/userTask';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertWindowsComponent } from '../../components/alert-windows/alert-windows.component';
import { DialogsService } from '../../components/dialogs/dialogs.service';
import { HttpStatusCodeService } from '../../common/services/http-status-code.service';
import { AuthService } from '../../common/services/auth.service';
import { TaskService } from '../../common/services/task.service';
import { DateTime } from 'date-time-js';

@Component({
  selector: 'app-suggest-deadline',
  templateUrl: './suggest-deadline.component.html',
  styleUrls: ['./suggest-deadline.component.css']
})
export class SuggestDeadlineComponent {
  @Input() private task: string;

  private userTask: UserTask;
  private previousProposeEndDate: DateTime;

  constructor(public dialogRef: MatDialogRef<SuggestDeadlineComponent>,
    private alertwindow: AlertWindowsComponent,
    private dialogsService: DialogsService,
    private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.userTask = data.userTask;
    this.task = data.taskName;
    if (this.userTask.ProposeEndDate) {
      this.previousProposeEndDate = new DateTime(this.userTask.ProposeEndDate.toString().split('T')[0]);
    }
  }

  onCancelClick() {
    let currentProposeEndDate;
    if (this.userTask.ProposeEndDate) {
      currentProposeEndDate = this.userTask.ProposeEndDate.toString().split('T')[0];
    }
    if (this.userTask.ProposeEndDate && !this.previousProposeEndDate.isEqual(currentProposeEndDate)) {
      this.dialogsService
        .confirm('Confirm Dialog', 'You have unsaved changes. Do you want to save them?')
        .subscribe(res => {
          if (res) {
            this.saveChanges();
            this.alertwindow.openSnackBar('Your changes are saved!', 'Ok');
          }
        });
    }
    this.dialogRef.close();
  }

  saveChanges() {
    if (this.userTask.ProposeEndDate) {
      if (this.userTask.ProposeEndDate instanceof Object) {
        this.taskService.updateProposedEndDate(this.userTask.Id, this.userTask.ProposeEndDate.toISOString()).subscribe();
      } else {
        this.taskService.updateProposedEndDate(this.userTask.Id, this.userTask.ProposeEndDate).subscribe();
      }
    }
  }

  onSubmitClick() {
    this.saveChanges();
  }
}
