import { Component, OnInit, Input } from '@angular/core';
import { Plan } from '../../common/models/plan';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../common/services/auth.service';
import { PlanEditorComponent } from '../plan-editor/plan-editor.component';

@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.css']
})
export class PlanDetailsComponent implements OnInit {

  @Input()
  plan: Plan;
  hasPermisionsToEdit = false;
  constructor(public dialog: MatDialog, private authService: AuthService) { }

  ngOnInit() {
   if (this.authService.isAdmin() || this.authService.isMentor()) {
      this.hasPermisionsToEdit = true;
    }
  }
  openEditDialog(): void {
    const dialogRef = this.dialog.open(PlanEditorComponent, {
      width: '900px',
      data: this.plan
    });
  }
}
