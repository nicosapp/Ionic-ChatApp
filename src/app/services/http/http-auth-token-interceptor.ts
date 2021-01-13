import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
} from "@angular/common/http";

import { from, Observable } from "rxjs";
import { environment as env } from "src/environments/environment";
import { switchMap } from "rxjs/operators";

const TOKEN_KEY = "access_token";

@Injectable()
export class HttpAuthTokenInterceptorService implements HttpInterceptor {
  private accessToken: string = null;

  constructor(private storage: Storage) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.storage.get(TOKEN_KEY)).pipe(
      switchMap((token) => {
        const isApiUrl = req.url.startsWith(env.apiBaseUrl);
        if (token && isApiUrl) {
          // console.log("accesToken", token, isApiUrl);
          req = req.clone({
            headers: req.headers.set("Authorization", `Bearer ${token}`),
          });
        }
        return next.handle(req);
      })
    );
  }
}
