import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddTasksComponent } from '../add-tasks/add-tasks.component';
import { Observable } from 'rxjs';
import { Task } from '../../../src/app/common/models/task';
import { createElementCssSelector } from '@angular/compiler';
import { Plan } from '../common/models/plan';
import { Image } from '.././common/models/image';
import { AlertWindowsComponent } from '.././components/alert-windows/alert-windows.component';

import { DomSanitizer } from '@angular/platform-browser';
import { PlanService } from '.././common/services/plan.service';
import { TaskService } from '../common/services/task.service';

import { AuthService } from '../common/services/auth.service';
import { HttpStatusCodeService } from '.././common/services/http-status-code.service';
import { isEmpty } from 'rxjs/operators';
import { DISABLED } from '@angular/forms/src/model';


@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.css']

})

export class CreatePlanComponent implements OnInit {
  tasks: Observable<Task>;
  currentId: number;
  idTasks: number;
  name = '';
  description = '';
  published: boolean;
  addTask = false;
  result: Task[];
  created = false;
  privatePlanChecked = false;
  displayedColumns = ['Name', 'Description'];

  selectedFile: File = null;
  idCreator: number = this.authService.getUserId();
  private maxImageSize: number = 1024 * 1024;
  imageData = '../../../assets/images/LWMTagBlack.png';
  selectedImage = null;
  constructor(private dialog: MatDialog,
    private planService: PlanService,
    private taskService: TaskService,
    private authService: AuthService,
    private alertWindow: AlertWindowsComponent,
    private httpStatusCodeService: HttpStatusCodeService, ) {
  }

  openAddTasks(): void {
    const dialogRef = this.dialog.open(AddTasksComponent, {
      width: '1000px',
      data: this.currentId
    });
    dialogRef.afterClosed().subscribe(result => {
      this.idTasks = result;
      this.taskService.getTasks(this.currentId).subscribe(
        task => {
          this.result = task;
        }
      );
    });
  }

  saveChanges() {
    if (this.name === '' || this.description === '') {
      this.alertWindow.openSnackBar('You must enter data for save changing!', 'Ok');
      this.addTask = false;
    } else {
      const plan = {
        Id: this.currentId, Name: this.name, Description: this.description
      };
      this.planService.updatePlan(plan as Plan).subscribe();
    }
    this.alertWindow.openSnackBar('Saved', 'Ok');
  }

  createPlan() {
    if (this.name === '' || this.description === '') {
      this.alertWindow.openSnackBar('You must enter data for creating plan!', 'Ok');
      this.addTask = false;
    } else {
      this.published = false;
      const plan = {
        Name: this.name, Description: this.description, Published: this.published, CreatorId: this.idCreator,
        IsPrivate: this.privatePlanChecked
      };
      this.planService.createPlan(plan as Plan).subscribe(res => {
        this.currentId = res;
        this.created = true;

        if (this.selectedFile) {
          this.planService.updateImage(this.currentId, this.selectedFile).subscribe(
            this.selectedFile = null
          );
        }
      });
      this.alertWindow.openSnackBar('You create plan " ' + this.name + '"', 'Ok');
    }
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

  toggleVisibility() {
    if (this.privatePlanChecked) {
      this.privatePlanChecked = false;
    }
    this.privatePlanChecked = true;
  }

  ngOnInit() {
  }
}
