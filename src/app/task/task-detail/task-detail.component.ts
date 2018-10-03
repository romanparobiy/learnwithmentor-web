import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../../common/models/task';
import { MatDialog } from '@angular/material';
import { AuthService } from '../../common/services/auth.service';
import { TaskEditorComponent } from '../task-editor/task-editor.component';
import { TaskSubmitorComponent } from '../task-submitor/task-submitor.component';
import { ConversationComponent } from '../conversation/conversation.component';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {

  @Input()
  task: Task;
  hasPermisionsToComment = false;
  hasPermisionsToEdit = false;
  constructor(public dialog: MatDialog, private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.isAdmin() || this.authService.isMentor() || this.authService.isStudent()) {
      this.hasPermisionsToComment = true;
    }
    if (this.authService.isAdmin() || this.authService.isMentor()) {
      this.hasPermisionsToEdit = true;
    }
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(TaskEditorComponent, {
      data: this.task
    });
  }

  openConversationDialog(): void {
    const dialogRef = this.dialog.open(ConversationComponent, {
      width: '600px',
      data: { task: this.task, userTask: this }
    });
  }
}
