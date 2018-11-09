import { Component, OnInit } from '@angular/core';
import { Plan } from '../../common/models/plan';
import { HttpStatusCodeService } from '../../common/services/http-status-code.service';
import { AuthService } from '../../common/services/auth.service';
import { PlanService } from '../../common/services/plan.service';
import { AlertWindowsComponent } from '../../components/alert-windows/alert-windows.component';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {
  plans: Plan[];
  hasPermisionsToDelete = false;
  errorMessage: string;
  errorMessageActive = false;

  constructor(private planService: PlanService, private authService: AuthService, private httpStatusCodeService: HttpStatusCodeService,
     private alertwindow: AlertWindowsComponent) {
    planService.getPlans().subscribe( (x: Plan[]) => this.plans = x);
  }

  ngOnInit() {
    if (this.authService.isAdmin() || this.authService.isMentor()) {
      this.hasPermisionsToDelete = true;
    }
  }

  activateErrorMessage(message: string): void {
    this.errorMessage = message;
    this.errorMessageActive = true;
  }

  onDelete(id: number): void {
    this.planService.deletePlanById(id).subscribe(
      resp => {
        if (this.httpStatusCodeService.isOk(resp.status)) {
          let deletedElement: Plan;
          const index = this.plans.findIndex((plan: Plan) => plan.Id === id);
          if (index > -1) {
             deletedElement = this.plans.splice(index, 1)[0];
          }
          this.alertwindow.openSnackBar(deletedElement.Name + ' deleted', 'Ok');
          if (this.plans === undefined || this.plans.length < 1) {
            this.activateErrorMessage('There are no plans in this group');
            this.plans = [];
          }
        }
      },
      error => {
        this.alertwindow.openSnackBar('Error ocurred on deletion: please try again', 'Ok');
      }
    );
  }
}
