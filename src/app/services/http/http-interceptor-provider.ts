import { HttpAuthTokenInterceptorService } from "./http-auth-token-interceptor";
import { HttpHeaderInterceptorService } from "./http-header-interceptor";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

export const httpInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpHeaderInterceptorService,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpAuthTokenInterceptorService,
    multi: true,
  },
];
