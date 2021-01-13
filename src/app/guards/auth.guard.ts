import { Injectable, OnDestroy, OnInit } from "@angular/core";

import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from "@angular/router";
import { Observable, from } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return from(this.auth.fetchUser()).pipe(
      map((auth) => {
        const loggedIn = AuthService.loggedIn;

        if (!loggedIn) {
          this.router.navigate(["/tabs/tab2"]);
        }

        return loggedIn;
      })
    );
  }
}
