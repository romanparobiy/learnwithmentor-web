import { Component, OnInit, Injectable , Inject} from '@angular/core';

import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-alert-windows.component',
  templateUrl: 'app.html'
})
@Injectable({
  providedIn: 'root'
})
export class AlertWindowsComponent  implements OnInit {
  constructor(private snackBar: MatSnackBar) { }

  ngOnInit() {
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

}

