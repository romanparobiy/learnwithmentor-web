import { Component, OnInit, HostListener, Directive } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TaskService } from '../../common/services/task.service';
import { Image } from '../../common/models/image';
import { User } from '../../common/models/user';
import { AuthService } from '../../common/services/auth.service';
import { HttpStatusCodeService } from '../../common/services/http-status-code.service';
import { UserService } from '../../common/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { GroupService } from '../../common/services/group.service';
import { PlanService } from '../../common/services/plan.service';
import { UserTask } from '../../common/models/userTask';
import { Task } from '../../common/models/task';
import { Plan } from '../../common/models/plan';
import { Group } from '../../common/models/group';
import { TaskSubmitorComponent } from '../../task/task-submitor/task-submitor.component';
import { ConversationComponent } from '../../task/conversation/conversation.component';
import { UsersTasks } from '../../common/models/usersTasks';
import { UserWithImage } from '../../common/models/userWithImage';
import { SuggestDeadlineComponent } from '../suggest-deadline/suggest-deadline.component';
import { ReviewSuggestedDeadlinesComponent } from '../review-suggested-deadlines/review-suggested-deadlines.component';
import { Section } from '../../common/models/sections';
import { MatDialog } from '@angular/material';
import { DateTime } from 'date-time-js';
import { States } from './states';
import { TaskReaderComponent } from '../../task/task-reader/task-reader.component';

export class UsersWithTasks {
  user: UserWithImage;
  image;
  usertasks: UserTask[];
}

@Component({
  selector: 'app-specific-plan',
  templateUrl: './specific-plan.component.html',
  styleUrls: ['./specific-plan.component.css']
})

export class SpecificPlanComponent implements OnInit {
  panelOpenState = false;
  is_student = true;
  sections: Section[];
  states: any;
  imageData = null;
  users: UsersWithTasks[] = null;
  user: UsersWithTasks = null;
  planTasks: number[];
  isLoadedUser = false;
  isLoadedUsers = false;
  isUserSelected = false;
  selectedUser = 0;
  info: string;
  buttonName: string;

  constructor(public taskService: TaskService,
    private userService: UserService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private httpStatusCodeService: HttpStatusCodeService,
    private planService: PlanService,
    private groupservice: GroupService,
    private auth: AuthService,
    private router: Router) {
    this.users = new Array;
    this.planTasks = new Array;
    this.user = new UsersWithTasks;
  }

  isUserTaskExpiration(userTask: UserTask): boolean {
    const endDate = new DateTime(userTask.EndDate.toString().split('T')[0]);
    const curentDate = new DateTime();
    return curentDate.isGreater(endDate);
  }

  sendState(sectionId, taskId: number, event: any) {
    if (event.checked) {
      this.sections[sectionId].Content.UsersTasks[taskId].UserTasks[0].State = States.done;
      this.taskService.updateUserTaskState(event.source.id, States.done).subscribe();
      this.setPictureState(sectionId, taskId);
    } else {
      this.sections[sectionId].Content.UsersTasks[taskId].UserTasks[0].State = States.inProgress;
      this.taskService.updateUserTaskState(event.source.id, States.inProgress).subscribe();
      this.setPictureState(sectionId, taskId);
    }
  }

  ischecked(i): boolean {
    return i === this.selectedUser;
  }
  getState(state: string) {
    if (state.toLowerCase() === 'p') {
      return 'InProgress';
    }
    if (state.toLowerCase() === 'r') {
      return 'Rejected';
    }
    if (state.toLowerCase() === 'a') {
      return 'Approved';
    }
    if (state.toLowerCase() === 're') {
      return 'Reseted';
    }
    return 'Done';
  }

  approve(sectionId, taskId, selectedUser: number) {
    const userTaskId = this.sections[sectionId].Content.UsersTasks[taskId].UserTasks[selectedUser].Id;
    this.sections[sectionId].Content.UsersTasks[taskId].UserTasks[selectedUser].State = States.approved;
    this.taskService.updateUserTaskState(userTaskId, States.approved).subscribe();
    this.setUsertasks();
  }

  reject(sectionId, taskId, selectedUser: number) {
    const userTaskId = this.sections[sectionId].Content.UsersTasks[taskId].UserTasks[selectedUser].Id;
    this.sections[sectionId].Content.UsersTasks[taskId].UserTasks[selectedUser].State = States.rejected;
    this.taskService.updateUserTaskState(userTaskId, States.rejected).subscribe();
    this.setUsertasks();
  }

  reset(sectionId, taskId, selectedUser: number) {
    const userTaskId = this.sections[sectionId].Content.UsersTasks[taskId].UserTasks[selectedUser].Id;
    if (this.sections[sectionId].Content.UsersTasks[taskId].UserTasks[selectedUser].State !== States.inProgress) {
      this.sections[sectionId].Content.UsersTasks[taskId].UserTasks[selectedUser].State = States.done;
      this.taskService.updateUserTaskState(userTaskId, States.done).subscribe();
      this.setUsertasks();
    }
  }

  onResultClick(userTask: UserTask, task: Task) {
    const data = { userTask: userTask, task: task };
    if (this.is_student) {
      this.dialog.open(TaskSubmitorComponent, {
        data: data,
        width: '600px'
      });
    } else {
      this.dialog.open(TaskReaderComponent, {
        data: data,
        width: '600px'
      });
    }
  }

  onConversationClick(userTask: UserTask, task: Task) {
    const data = { userTask: userTask, task: task };
    this.dialog.open(ConversationComponent, {
      data: data,
      width: '600px'
    });
  }

  onSuggestDeadlineClick(taskName: string, userTask: UserTask) {
    const data = { taskName: taskName, userTask: userTask };
    const dialogRef = this.dialog.open(SuggestDeadlineComponent, {
      data: data,
      width: '400px'
    });
  }

  onSuggestedDeadlineClick(taskName: string, userTask: UserTask, studentName: string) {
    const data = { taskName: taskName, userTask: userTask, studentName };
    const dialogRef = this.dialog.open(ReviewSuggestedDeadlinesComponent, {
      data: data,
      width: '500px'
    });
  }

  ngOnInit() {
    this.isLoadedUser = false;
    this.isLoadedUsers = false;
    const group_id = +this.router.url.split('/')[2];
    const plan_id = +this.router.url.split('/')[4];
    this.planService.getPlanAndGroupInfo(group_id, plan_id).subscribe(info => {
      this.info = info;
    });
    this.taskService.getTasksInSections(plan_id).subscribe(
      section => {
        this.sections = section;
        if (!this.auth.isStudent()) {
          this.is_student = false;
          this.buttonName = 'Look Result';
          this.groupservice.getGroupUsersWithImage(group_id).subscribe(
            result => {
              this.getUsersWithPictures(result);
            }
          );
        } else {
          this.is_student = true;
          this.buttonName = 'Submit Result';
          this.userService.getUser().subscribe(u => {
            const userWithImage = this.toUserWithImage(u);
            this.getUserWithPictures(userWithImage);
          });
        }
      });
  }

  getPicturesState(alluserState: UserTask[]): UserTask[] {
    for (const userState of alluserState) {
      if (userState.State.toUpperCase() === States.inProgress) {
        userState.Icon = 'remove';
        userState.StyleClass = 'stateIcon black';
      } else if (userState.State.toUpperCase() === States.done) {
        userState.Icon = 'done';
        userState.StyleClass = 'stateIcon blue';
      } else if (userState.State.toUpperCase() === States.approved) {
        userState.Icon = 'done';
        userState.StyleClass = 'stateIcon green';
      } else if (userState.State.toUpperCase() === States.rejected) {
        userState.Icon = 'close';
        userState.StyleClass = 'stateIcon red';
      } else {
        userState.Icon = 'close';
        userState.StyleClass = 'stateIcon red';
      }
    }
    return alluserState;
  }

  setPictureState(section: number, id: number) {
    if (this.sections[section].Content.UsersTasks[id].UserTasks[0].State.toUpperCase() === States.inProgress) {
      this.sections[section].Content.UsersTasks[id].UserTasks[0].Icon = 'remove';
      this.sections[section].Content.UsersTasks[id].UserTasks[0].StyleClass = 'stateIcon black';
    } else if (this.sections[section].Content.UsersTasks[id].UserTasks[0].State.toUpperCase() === States.done) {
      this.sections[section].Content.UsersTasks[id].UserTasks[0].Icon = 'done';
      this.sections[section].Content.UsersTasks[id].UserTasks[0].StyleClass = 'stateIcon blue';
    } else if (this.sections[section].Content.UsersTasks[id].UserTasks[0].State.toUpperCase() === States.approved) {
      this.sections[section].Content.UsersTasks[id].UserTasks[0].Icon = 'done';
      this.sections[section].Content.UsersTasks[id].UserTasks[0].StyleClass = 'stateIcon green';
    } else if (this.sections[section].Content.UsersTasks[id].UserTasks[0].State.toUpperCase() === States.rejected) {
      this.sections[section].Content.UsersTasks[id].UserTasks[0].Icon = 'close';
      this.sections[section].Content.UsersTasks[id].UserTasks[0].StyleClass = 'stateIcon red';
    } else {
      this.sections[section].Content.UsersTasks[id].UserTasks[0].Icon = 'close';
      this.sections[section].Content.UsersTasks[id].UserTasks[0].StyleClass = 'stateIcon red';
    }
  }

  getUsersWithPictures(groupUsers: UserWithImage[]) {
    this.planTasks = this.getPlantasks(this.sections);
    const userids: number[] = new Array;
    for (const user of groupUsers) {
      userids.push(user.Id);
    }
    this.getUsersTasks(userids, this.planTasks).subscribe(
      result_allUsertaskState => {
        for (let i = 0; i < groupUsers.length; i++) {
          const temp = new UsersWithTasks;
          temp.user = groupUsers[i];
          temp.image = this.setUserPic(groupUsers[i].Image);
          temp.usertasks = this.getPicturesState(result_allUsertaskState[i].UserTasks);
          this.users.push(temp);
        }
        this.setAllUserTasks(result_allUsertaskState);
        this.isLoadedUsers = true;
      }
    );
  }

  getFullName(index: number): string {
    return this.users[index].user.FirstName + ' ' + this.users[index].user.LastName;
  }

  getUserWithPictures(user: UserWithImage) {
    this.planTasks = this.getPlantasks(this.sections);
    this.taskService.getUserTasks(user.Id, this.planTasks).subscribe(
      ut => {
        const usersTasks: UsersTasks = new UsersTasks;
        usersTasks.UserTasks = ut;
        this.setUsertasksToSection(usersTasks);
        const temp = new UsersWithTasks;
        temp.user = user;
        temp.usertasks = this.getPicturesState(ut);
        this.user = temp;
      }
    );
  }

  private getUsersTasks(ids: number[], planTasks: number[]): Observable<UsersTasks[]> {
    return this.taskService.getUsersTasksForGroupUsers(ids, planTasks);
  }

  private getPlantasks(sections: Section[]): number[] {
    const planTasks = new Array;
    for (let i = 0; i < sections.length; i++) {
      for (let j = 0; j < sections[i].Content.Tasks.length; j++) {
        planTasks.push(sections[i].Content.Tasks[j].PlanTaskId);
      }
    }
    return planTasks;
  }

  selectedUserbyMentor(index: number) {
    this.selectedUser = index;
    this.isUserSelected = true;
  }

  private isTaskDone(state: string): boolean {
    return state === States.done;
  }

  private isTaskApproved(state: string): boolean {
    return state === States.approved;
  }

  private isChecked(state: string): boolean {
    return state === States.approved || state === States.done;
  }

  setUserPic(img: Image) {
    let image;
    if (typeof img.Base64Data !== 'undefined' && typeof img.Name !== 'undefined') {
      const extension = img.Name.split('.').pop().toLowerCase();
      const imgUrl = `data:image/${extension};base64,${img.Base64Data}`;
      image = this.sanitizer.bypassSecurityTrustUrl(imgUrl);
    } else {
      image = '../../../assets/images/user-default.png';
    }
    return image;
  }

  private setUsertasksToSection(usersTasks: UsersTasks) {
    let index = 0;
    let allTasks;
    for (let i = 0; i < this.sections.length; i++) {
      this.sections[i].Content.UsersTasks = new Array;
      for (let j = 0; j < this.sections[i].Content.Tasks.length; j++) {
        allTasks = new UsersTasks();
        allTasks.UserTasks = new Array;
        allTasks.UserTasks.push(usersTasks.UserTasks[index + j]);
        this.sections[i].Content.UsersTasks.push(allTasks);
      }
      index += this.sections[i].Content.Tasks.length;
    }
    this.isLoadedUser = true;
  }

  setSection(section: Section, usersTasks: UsersTasks[], index: number): Section {
    section.Content.UsersTasks = new Array<UsersTasks>();
    let userTasks;
    let allTasks;
    for (let i = 0; i < section.Content.Tasks.length; i++) {
      userTasks = new Array<UserTask>();
      allTasks = new UsersTasks();
      for (let j = 0; j < this.users.length; j++) {
        userTasks.push(usersTasks[j].UserTasks[i + index]);
      }
      allTasks.UserTasks = userTasks;
      section.Content.UsersTasks.push(allTasks);
    }
    return section;
  }

  setAllUserTasks(usersTasks: UsersTasks[]) {
    let index = 0;
    for (let i = 0; i < this.sections.length; i++) {
      this.sections[i] = this.setSection(this.sections[i], usersTasks, index);
      index += this.sections[i].Content.Tasks.length;
    }
    this.isLoadedUser = true;
  }

  private setUsertasks() {
    const tasks: UserTask[] = new Array;
    for (let i = 0; i < this.sections.length; i++) {
      for (let j = 0; j < this.sections[i].Content.Tasks.length; j++) {
        tasks.push(this.sections[i].Content.UsersTasks[j].UserTasks[this.selectedUser]);
      }
    }
    this.users[this.selectedUser].usertasks = this.getPicturesState(tasks);
  }

  private toUserWithImage(user: User): UserWithImage {
    const userWithImage = new UserWithImage;
    userWithImage.Id = user.Id;
    userWithImage.Role = user.Role;
    userWithImage.LastName = user.LastName;
    userWithImage.FirstName = user.FirstName;
    userWithImage.Email = user.Email;
    userWithImage.Blocked = user.Blocked;
    return userWithImage;
  }
}
