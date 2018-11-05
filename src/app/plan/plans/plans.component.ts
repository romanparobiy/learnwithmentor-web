import { Component, OnInit } from '@angular/core';
import { Plan } from '../../common/models/plan';
import { AuthService } from '../../common/services/auth.service';
import { PlanService } from '../../common/services/plan.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {
  plans: Plan[];
  hasPermisionsToDelete = false;
  id: number;
  index: number;
  constructor(private planService: PlanService, private authService: AuthService) {
    planService.getPlans().subscribe( (x: Plan[]) => this.plans = x);
  }
  ngOnInit() {
    if (this.authService.isAdmin() || this.authService.isMentor()) {
      this.hasPermisionsToDelete = true;
    }
  }

  onDelete(id: number): void {
    this.id = id;
    this.planService.deletePlanById(this.id).subscribe();
    this.index = this.plans.findIndex((plan: Plan) => plan.Id === id);
    this.plans.splice(this.index, 1);
  }
}
