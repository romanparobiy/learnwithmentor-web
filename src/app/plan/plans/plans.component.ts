import { Component, OnInit } from '@angular/core';
import { Plan } from '../../common/models/plan';
import { PlanService } from '../../common/services/plan.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {
  plans: Plan[];
  constructor(private planService: PlanService) {
    planService.getPlans().subscribe(x => this.plans = x);
  }
  ngOnInit() {
  }
}
