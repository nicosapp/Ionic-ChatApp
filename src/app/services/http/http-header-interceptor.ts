import { Injectable } from "@angular/core";

import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
} from "@angular/common/http";

import { Observable } from "rxjs";

@Injectable()
export class HttpHeaderInterceptorService implements HttpInterceptor {
  constructor() {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = req.clone({
      headers: req.headers
        .set("Accept", "application/json")
        .set("Content-Type", "application/json"),
      withCredentials: true,
    });

    return next.handle(req);
  }
}
