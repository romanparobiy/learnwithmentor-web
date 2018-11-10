import { Component, OnInit, Input, Inject } from '@angular/core';
import { Plan } from '../../common/models/plan';
import { PlanService } from '../../common/services/plan.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Task } from '../../common/models/task';
import { TaskService } from '../../common/services/task.service';
import { AlertWindowsComponent } from '../../components/alert-windows/alert-windows.component';
import { Observable, of } from 'rxjs';
import { Image } from '../../common/models/image';
import { DomSanitizer } from '@angular/platform-browser';
import { TaskCreatorComponent } from '../../task/task-creator/task-creator.component';
import { HttpStatusCodeService } from '../../common/services/http-status-code.service';

@Component({
  selector: 'app-plan-editor',
  templateUrl: './plan-editor.component.html',
  styleUrls: ['./plan-editor.component.css']
})
export class PlanEditorComponent implements OnInit {
  selectedFile: File = null;
  private maxImageSize: number = 1024 * 1024;
  imageData = null;
  selectedImage = null;
  tasksInPlan: Task[];
  tasksNotInPlan: Task[];
  @Input()
  plan: Plan;
  constructor(private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PlanEditorComponent>,
    private alertWindow: AlertWindowsComponent,
    private httpStatusCodeService: HttpStatusCodeService,
    private planService: PlanService, private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) public data: Plan) { this.plan = data; }

  ngOnInit() {
    this.taskService.getTasks(this.plan.Id).subscribe(data => {
      this.tasksInPlan = data;
      this.getImage();
      if (this.imageData == null) {
        this.imageData = '../../../assets/images/LWMTagBlack.png';
      }
      this.taskService.getTasks().subscribe(allTasks => {
        this.tasksInPlan.forEach(task => this.deleteFromArrey(task, allTasks));
        this.tasksNotInPlan = allTasks;
      });
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onTaskChange(tasksInPlan: boolean, task: Task) {
    if (tasksInPlan) {
      this.tasksNotInPlan.push(task);
      this.deleteFromArrey(task, this.tasksInPlan);
    } else {
      this.tasksInPlan.push(task);
      this.deleteFromArrey(task, this.tasksNotInPlan);
    }
  }
  deleteFromArrey(task: Task, tasks: Task[]) {
    let index = -1;
    tasks.forEach(element => {
      if (element.Id === task.Id) {
        ++index;
        tasks.splice(index, 1);
        return;
      }
      ++index;
    });
  }
  onSaveClick(name: string, description: string) {
    this.plan.Name = name;
    this.plan.Description = description;
    this.planService.updatePlan(this.plan);
    // send image
    this.planService.updateImage(this.plan.Id, this.selectedFile).subscribe();
    // todo: add tasks to plan
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile.size > this.maxImageSize) {
      this.alertWindow.openSnackBar(`Image size must be less then ${this.maxImageSize / (1024 * 1024)} mb, please select another`, 'Ok');
      this.selectedFile = null;
    } else {
      const preview = document.getElementById('newImage') as HTMLImageElement;
      const reader = new FileReader();
      reader.onloadend = function () {
        preview.src = String(reader.result);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  getImage() {
    this.planService.getImage(this.plan.Id).subscribe(
      resp => {
        if (this.httpStatusCodeService.isOk(resp.status)) {
          const extension = resp.body.Name.split('.').pop().toLowerCase();
          const imgUrl = `data:image/${extension};base64,${resp.body.Base64Data}`;
          this.imageData = this.sanitizer.bypassSecurityTrustUrl(imgUrl);
        }
      }
    );
  }
  onAddClick() {
    const dialogRef = this.dialog.open(TaskCreatorComponent, {
      data: this.plan.Id
    });
  }
}
