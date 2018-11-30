import { BrowserModule } from '@angular/platform-browser';
import { NgModule , ErrorHandler  } from '@angular/core';
import { UserService } from './common/services/user.service';
import { AppComponent } from './app.component';
import { UsersComponent } from './admin/user/users/users.component';
import { CommentComponent } from './task/comment/comment.component';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AppRoutingModule } from './/app-routing.module';
import { AuthGuard } from './auth/auth.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatNativeDateModule } from '@angular/material';
import { TasksComponent } from './task/tasks/tasks.component';
import { MatListModule, MatListBase } from '@angular/material/list';
import { TaskDetailComponent } from './task/task-detail/task-detail.component';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule, MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { TaskEditorComponent } from './task/task-editor/task-editor.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule, MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MainPageComponent } from './main-page/main-page.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SliderComponent } from './main-page/slider/slider.component';
import { GalleryComponent } from './main-page/gallery/gallery.component';
import { BenefitsComponent } from './main-page/benefits/benefits.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from './material.module';
import { PlansComponent } from './plan/plans/plans.component';
import { PlanDetailsComponent } from './plan/plan-details/plan-details.component';
import { TaskSubmitorComponent } from './task/task-submitor/task-submitor.component';
import { TaskReaderComponent } from './task/task-reader/task-reader.component';
import { FormsModule } from '@angular/forms';
import { ConversationComponent } from './task/conversation/conversation.component';
import { AboutPageComponent } from './main-page/about-page/about-page.component';
import { ContactPageComponent } from './main-page/contact-page/contact-page.component';

import { AlertWindowsComponent } from './components/alert-windows/alert-windows.component';
import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog/confirm-dialog.component';
import { PlanEditorComponent } from './plan/plan-editor/plan-editor.component';
import { TasksListEditorComponent } from './task/tasks-list-editor/tasks-list-editor.component';
import { TaskCreatorComponent } from './task/task-creator/task-creator.component';
import { CreatePlanComponent } from './create-plan/create-plan.component';
import { AddTasksComponent } from './add-tasks/add-tasks.component';
import { UserPageComponent } from './user/user-page/user-page.component';
import { SpecificPlanComponent } from './specific-group/specific-plan/specific-plan.component';
import { SpecificPlanForMentorComponent } from './specific-group/specific-plan-for-mentor/specific-plan-for-mentor.component';
import { GroupsComponent } from './groups/groups/groups.component';
import { AddGroupComponent } from './groups/add-group/add-group.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { MatPaginatorModule, MatTableDataSource, MatIconModule } from '@angular/material';
import { MentorGuard } from './auth/mentor.guard';
import { AdminGuard } from './auth/admin.guard';
import { SpecificGroupComponent } from './groups/specific-group/specific-group/specific-group.component';
import { UsersDisplayComponent } from './groups/specific-group/users-display/users-display.component';
import { AddUsersComponent } from './groups/specific-group/add-users/add-users.component';
import { PlansDisplayComponent } from './groups/specific-group/plans-display/plans-display.component';
import { AddPlansComponent } from './groups/specific-group/add-plans/add-plans.component';
import { PaginationComponent } from './pagination/pagination.component';
import { BeginPasswordResetComponent } from './begin-password-reset/begin-password-reset.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { EmailNotConfirmedComponent } from './email-not-confirmed/email-not-confirmed.component';
import { SuggestDeadlineComponent } from './specific-group/suggest-deadline/suggest-deadline.component';
import { ReviewSuggestedDeadlinesComponent } from './specific-group/review-suggested-deadlines/review-suggested-deadlines.component';
import { CustomPaginatorComponent } from './custom-paginator/custom-paginator.component';
import { InViewportModule } from 'ng-in-viewport';
import 'intersection-observer';


import * as Raven from 'raven-js';
Raven
  .config('https://351205e7df8743abbfbf6a26e31848b4@sentry.io/1283915')
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err.originalError);
    Raven.showReportDialog();
  }
}

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    NavbarComponent,
    TasksComponent, TaskDetailComponent, TaskEditorComponent,
    TasksListEditorComponent, TaskCreatorComponent,
    CommentComponent,
    MainPageComponent,
    SigninComponent,
    SignupComponent,
    NavbarComponent,
    FooterComponent,
    SliderComponent,
    GalleryComponent,
    BenefitsComponent,
    AboutPageComponent,
    ContactPageComponent,
    PlansComponent,
    PlanDetailsComponent,
    TaskSubmitorComponent,
    TaskReaderComponent,
    ConversationComponent,
    SpecificGroupComponent,
    AlertWindowsComponent,
    ConfirmDialogComponent,
    UsersDisplayComponent,
    PlansDisplayComponent,
    PlanEditorComponent,
    AddUsersComponent,
    AddPlansComponent,
    PlanEditorComponent,
    CreatePlanComponent,
    AddTasksComponent,
    UserPageComponent,
    SpecificPlanComponent,
    SpecificPlanForMentorComponent,
    GroupsComponent,
    AddGroupComponent,
    UserEditComponent,
    PageNotFoundComponent,
    NotAuthorizedComponent,
    PaginationComponent,
    BeginPasswordResetComponent,
    PasswordResetComponent,
    ConfirmEmailComponent,
    EmailNotConfirmedComponent,
    SuggestDeadlineComponent,
    ReviewSuggestedDeadlinesComponent,
    CustomPaginatorComponent
    ],
  imports: [
    AppRoutingModule,
    MatIconModule,
    BrowserModule,
    HttpClientModule,
    MatPaginatorModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    AppRoutingModule,
    MatTableModule,
    MatListModule,
    MatCardModule,
    MatExpansionModule,
    MatDialogModule,
    MatSidenavModule,
    MatTableModule,
    MaterialModule,
    MatRadioModule,
    FormsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatBadgeModule,
    InViewportModule
    ],

  entryComponents: [TaskEditorComponent,
    TaskCreatorComponent,
    ConfirmDialogComponent,
    TaskSubmitorComponent,
    TaskReaderComponent,
    ConversationComponent,
    SuggestDeadlineComponent,
    SigninComponent,
    SignupComponent,
    AboutPageComponent,
    ContactPageComponent,
    PlanEditorComponent,
    AddUsersComponent,
    AddPlansComponent,
    AddTasksComponent,
    AddGroupComponent,
    UserEditComponent,
    ReviewSuggestedDeadlinesComponent
  ],
  providers: [UserService,
    AuthGuard,
    MentorGuard,
    AdminGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: ErrorHandler, useClass: RavenErrorHandler }
    ],
  bootstrap: [AppComponent],

})
export class AppModule { }
