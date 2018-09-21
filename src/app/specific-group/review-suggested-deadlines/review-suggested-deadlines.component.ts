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
  selector: 'app-review-suggested-deadlines',
  templateUrl: './review-suggested-deadlines.component.html',
  styleUrls: ['./review-suggested-deadlines.component.css']
})
export class ReviewSuggestedDeadlinesComponent implements OnInit {

  @Input()
  public task: string;
  public userTask: UserTask;
  public studentName: string;

  constructor(public dialogRef: MatDialogRef<ReviewSuggestedDeadlinesComponent>,
    private alertwindow: AlertWindowsComponent,
    private dialogsService: DialogsService,
    private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.userTask = data.userTask;
      this.task = data.taskName;
      this.studentName = data.studentName;
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onApproveClick() {
    this.userTask.EndDate = this.userTask.ProposeEndDate;
    this.userTask.ProposeEndDate = null;
    this.taskService.updateEndDate(this.userTask.Id).subscribe();
  }

  onRejectClick() {
    this.userTask.ProposeEndDate = null;
    this.taskService.deleteProposedEndDate(this.userTask.Id).subscribe();
  }

  ngOnInit() {
  }

}
