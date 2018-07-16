import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MAT_DIALOG_DATA } from '@angular/material';
import { GroupService } from '../../../common/services/group.service';
import { AlertWindowsComponent } from '../../../components/alert-windows/alert-windows.component';
import { User } from '../../../common/models/user';
import { HttpErrorResponse } from '../../../../../node_modules/@angular/common/http';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent implements OnInit {

  constructor(private groupService: GroupService,
    private alertwindow: AlertWindowsComponent,
    public thisDialogRef: MatDialogRef<AddUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) {
    this.groupId = data;
  }

  displayedColumns = ['FirstName', 'LastName', 'Email', 'Role', 'Blocked', 'Check'];
  users: User[];
  dataSource = new MatTableDataSource<User>(this.users);
  private searchTerms = new Subject<string>();
  groupId: number;
  someUserAdded = false;
  dataLoaded = false;
  errorMessage: string;
  errorMessageActive = false;
  searchActive = false;

  @HostListener('window:keyup.esc') onKeyUp() {
    this.thisDialogRef.close(this.someUserAdded);
  }

  addChoosenUser(event: any, choosenOne: User) {
    this.groupService.addUserToGroup(choosenOne.Id, this.groupId).subscribe();
    this.someUserAdded = true;
    this.alertwindow.openSnackBar(choosenOne.FirstName + ' ' + choosenOne.LastName + ' added', 'Ok');
    event.currentTarget.setAttribute('disabled', 'disabled');
  }

  activateErrorMessage(message: string): void {
    this.errorMessage = message;
    this.errorMessageActive = true;
  }

  search(term: string): void {
    this.errorMessageActive = false;
    this.searchActive = true;
    this.searchTerms.next(term);
  }

  ngOnInit() {
    this.thisDialogRef.disableClose = true;
    this.thisDialogRef.backdropClick().subscribe(result => {
      this.thisDialogRef.close(this.someUserAdded);
    });
    this.groupService.searchNotUsers('', this.groupId).subscribe(
      data => {
        this.users = data
      },
      (error: HttpErrorResponse) => {
        this.activateErrorMessage(error.error.Message);
        this.dataLoaded = true;
      },
      () => {
        this.dataLoaded = true;
        if (this.users === null || this.users.length < 1) {
          this.activateErrorMessage('There are no users anymore');
          const searchField = document.getElementById('search'); // todo find why null
          searchField.setAttribute('disabled', 'disabled');
        }
      }
    );
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.groupService.searchNotUsers(term, this.groupId))).subscribe(
        data => {
          this.users = data;
          this.searchActive = false;
          if (this.users === null || this.users.length < 1) {
            this.activateErrorMessage('There are no plans by this key');
          }
        },
        (error: HttpErrorResponse) => {
          this.activateErrorMessage(error.error.Message);
          this.searchActive = false;
        }
      );
  }
}
