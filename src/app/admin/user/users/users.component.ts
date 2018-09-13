import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../common/models/user';
import { Role } from '../../../common/models/role';
import { UserService } from '../../../common/services/user.service';
import { MatPaginator, MatTableDataSource, MatRadioButton, PageEvent } from '@angular/material';
import { Observable, Subject, of } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import { AlertWindowsComponent } from '../../../components/alert-windows/alert-windows.component';
import { DialogsService } from '../../../components/dialogs/dialogs.service';
import { Pagination } from '../../../common/models/pagination';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {

  constructor(private userService: UserService, private alertwindow: AlertWindowsComponent, private dialogsService: DialogsService) {
  }

  displayedColumns = ['Check', 'FirstName', 'LastName', 'Role', 'Blocked', 'Action'];
  allUsers = -1;
  roles: Role[];
  users: User[];
  paginator: Pagination<User>;
  name: string;
  surname: string;
  role: string;
  state: boolean;
  newState: boolean;
  id: number;
  forMessage: string;
  selectedType: Role;
  selectedState: boolean;
  roleName: string = null;
  lastArgument: any;
  public result: any;
  lastFunction: (pageSize: number, pageNumber: number, arg: any) => void;
  term: string;
  dataSource = new MatTableDataSource<User>(this.users);
  private searchTerms = new Subject<string>();

  getType(roleName: string, type: Role): string {
    this.selectedType = type;
    this.selectedState = null;
    return this.roleName = roleName;
  }

  chooseUser(id: number, role: string, name: string, surname: string, state: boolean) {
    this.surname = surname;
    this.name = name;
    this.state = state;
    this.id = id;
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

  changeState(id: number, state: boolean, newState) {
    if (this.id == null || state == null) {
      this.alertwindow.openSnackBar('Choose user!', 'Ok');
      return false;
    }
    if (newState) {
      this.forMessage = ' block ';
    }
    if (!newState) {
      this.forMessage = ' unblock ';
    }
    if (this.state === newState) {
      this.alertwindow.openSnackBar('User ' + this.name + ' ' + this.surname + ' already' + this.forMessage, 'Ok');
      return false;
    }
    const user = { Blocked: newState, Id: this.id };
    this.dialogsService
      .confirm('Confirm Dialog', 'Are sure you want to ' + this.forMessage + ' user : ' + this.name + ' ' + this.surname + '  ?')
      .subscribe(res => {
        this.result = res;

        if (this.result) {
          this.userService.updateUser(user as User).subscribe();
          this.users.forEach(element => {
            if (element.Id === id) {
              element.Blocked = newState;
            }
          });
          this.state = newState;
          return true;
        }
      });
  }

  updateRole(id: number, role: string, name: string, surname: string) {
    if (role == null || id == null) {
      this.alertwindow.openSnackBar('Choose role!', 'Ok');
      return false;
    }
    this.dialogsService
      .confirm('Confirm Dialog', 'Are sure you want to update role for user  ' + name + ' ' + surname + ' on role "' + role + '" ?')
      .subscribe(res => {
        this.result = res;
        if (this.result) {
          const user = { Role: role, Id: id };
          this.userService.updateUser(user as User).subscribe();
          this.users.forEach(element => {
            if (element.Id === id) {
              element.Role = role;
            }
          });
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
}
