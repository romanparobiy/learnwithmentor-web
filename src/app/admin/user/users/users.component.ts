import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../common/models/user';
import { Role } from '../../../common/models/role';
import { UserService } from '../../../common/services/user.service';
import { MatPaginator, MatTableDataSource, MatRadioButton, PageEvent, MatCheckboxModule } from '@angular/material';
import { Observable, Subject, of } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import { AlertWindowsComponent } from '../../../components/alert-windows/alert-windows.component';
import { DialogsService } from '../../../components/dialogs/dialogs.service';
import { Pagination } from '../../../common/models/pagination';
import { AuthService } from '../../../common/services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  constructor (
    private userService: UserService,
    private alertwindow: AlertWindowsComponent,
    private dialogsService: DialogsService,
    private authService: AuthService) {
  }
  displayedColumns = ['Check', 'FirstName', 'LastName', 'Role', 'Blocked', 'Action'];
  allUsers = -1;
  roles: Role[];
  users: User[];
  paginator: Pagination<User>;
  role: string;
  selectedType: Role;
  selectedState: boolean;
  roleName: string = null;
  lastArgument: any;
  lastFunction: (pageSize: number, pageNumber: number, arg: any) => void;
  term: string;
  selectedAll: any;
  dataSource = new MatTableDataSource<User>(this.users);
  private searchTerms = new Subject<string>();

  getType(roleName: string, type: Role): string {
    this.selectedType = type;
    this.selectedState = null;
    return this.roleName = roleName;
  }

  getUsersByState(pageSize: number, pageNumber: number, state: boolean) {
    this.selectedState = state;
    this.selectedType = null;
    this.userService.getPageByState(state, pageSize, pageNumber).subscribe(
      paginator => {
        this.paginator = paginator;
        this.users = this.paginator.Items;
      });
    this.lastFunction = this.getUsersByState;
    this.lastArgument = state;
  }

  search(term: string, roleName: string): void {
    this.term = term;
    this.searchTerms.next(term);
    this.lastArgument = roleName;
    this.lastFunction = null;
  }

  getRole(role: string) {
    return this.role = role;
  }

  changeState(isBlocked: boolean) {
    const selectedUsers = this.users.filter(user => user.IsSelected);

    if (selectedUsers.length === 0 || isBlocked == null) {
      this.alertwindow.openSnackBar('Choose users!', 'Ok');
      return false;
    }

    for (let numberOfUser = 0; numberOfUser < selectedUsers.length; numberOfUser++ ) {
      if (this.authService.getUserId() === selectedUsers[numberOfUser].Id) {
        this.alertwindow.openSnackBar('You can\'t block yourself!', 'Ok');
        return false;
      }
    }

    this.dialogsService
      .confirm('Confirm Dialog', 'Are you sure you want to update users statuses?')
      .subscribe(res => {
        if (res) {
          selectedUsers.forEach(element => element.Blocked = isBlocked);
          this.userService.updateMultipleUser(selectedUsers)
            .subscribe(respons => {
              selectedUsers.forEach(element => element.IsSelected = false);
              if (this.selectedAll === true) {
                this.selectedAll = false;
              }
            });
          return true;
        }
      });
  }

  updateRole(role: string) {
    const selectedUsers = this.users.filter(user => user.IsSelected);
    if (role === null || selectedUsers.length === 0) {
      this.alertwindow.openSnackBar('Choose users and role!', 'Ok');
      return false;
    }
    this.dialogsService
      .confirm('Confirm Dialog', 'Are sure you want to update role for selected users ?')
      .subscribe(res => {
        if (res) {
          selectedUsers.forEach(element => element.Role = role);
          this.userService.updateMultipleUser(selectedUsers)
            .subscribe(respons => {
              selectedUsers.forEach(element => element.IsSelected = false);
              if (this.selectedAll === true) {
                this.selectedAll = false;
              }
            });
          return true;
        }
      });
  }

  getByRole(pageSize: number, pageNumber: number, id: number) {
    if (id === this.allUsers) {
      this.setPage(pageSize, pageNumber);
      return true;
    } else {
      this.userService.getPageByRole_id(id, pageSize, pageNumber).subscribe(
        paginator => {
          this.paginator = paginator;
          this.users = this.paginator.Items;
        });
      this.lastFunction = this.getByRole;
      this.lastArgument = id;
    }
  }

  setPage(pageSize = 10, pageNumber = 0) {
    this.userService.getPage(pageSize, pageNumber).subscribe(
      paginator => {
        this.paginator = paginator;
        this.users = this.paginator.Items;
      });
    this.lastFunction = this.setPage;
    this.lastArgument = null;
  }

  ngOnInit() {
    this.userService.getRoles().subscribe(
      role => this.roles = role);
    this.setPage();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.userService.searchPage(term, this.roleName, this.paginator.PageSize, this.paginator.PageNumber))
    ).subscribe(paginator => {
      this.paginator = paginator;
      this.users = this.paginator.Items;
    });
  }

  onPageChange(event: PageEvent) {
    if (this.lastFunction != null) {
      this.lastFunction(event.pageSize, event.pageIndex, this.lastArgument);
    } else {
      this.userService.searchPage(this.term, this.roleName, event.pageSize, event.pageIndex).subscribe(paginator => {
        this.paginator = paginator;
        this.users = this.paginator.Items;
      });
    }
  }

  selectAll() {
    this.users.forEach(element => {
      element.IsSelected = this.selectedAll;
    });
  }

  checkIfAllSelected() {
    this.selectedAll = this.users.every(function (item: any) {
      return item.IsSelected === true;
    });
  }
}
