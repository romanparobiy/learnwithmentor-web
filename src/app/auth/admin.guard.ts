import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../common/services/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.auth.isAdmin()) {
      return true;
    }
    this.router.navigate(['/not-authorized']);
    return false;
  }
}
