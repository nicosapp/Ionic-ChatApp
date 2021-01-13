import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
} from "@angular/common/http";

import { Observable } from "rxjs";
import { environment as env } from "src/environments/environment";

@Injectable()
export class HttpHeaderInterceptorService implements HttpInterceptor {
  private accessToken: string = null;

  constructor(private storage: Storage) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = req.clone({
      headers: req.headers
        .set("Accept", "application/json")
        .set("Content-Type", "application/json"),
    });
    return next.handle(req);
  }
}
