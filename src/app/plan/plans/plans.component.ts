import { Component, OnInit, Input } from '@angular/core';
import { Plan } from '../../common/models/plan';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../common/services/auth.service';
import { PlanService } from '../../common/services/plan.service';
import { PlanEditorComponent } from '../plan-editor/plan-editor.component';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {
  plans: Plan[];
  hasPermisionsToDelete = false;
  hasPermisionToEdit = false;
  isExpanded = true;
  constructor(public dialog: MatDialog, private planService: PlanService, private authService: AuthService) {
    planService.getPlans().subscribe( (x: Plan[]) => this.plans = x);
  }
  ngOnInit() {
    if (this.authService.isAdmin() || this.authService.isMentor()) {
      this.hasPermisionsToDelete = true;
      this.hasPermisionToEdit = true;
    }
  }

  openEditDialog(id: number): void {
    const index = this.plans.findIndex((plan: Plan) => plan.Id === id);
    const dialogRef = this.dialog.open(PlanEditorComponent, {
      width: '900px',
      data: this.plans[index]
    });
  }

  onDelete(id: number): void {
    this.planService.deletePlanById(id).subscribe();
    const index = this.plans.findIndex((plan: Plan) => plan.Id === id);
    this.plans.splice(index, 1);
  }
}
