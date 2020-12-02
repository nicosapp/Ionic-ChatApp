import { map, catchError } from "rxjs/operators";
import { ToastController } from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, of } from "rxjs";
import { environment as env } from "./../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public static user: any;
  public authSubject = new Subject<any>();
  public static loggedIn: boolean = false;

  constructor(
    private http: HttpClient,
    private toastController: ToastController
  ) {}

  async loginWith({ email, password }) {
    try {
      await this.http.get(env.baseUrl + "/sanctum/csrf-cookie").toPromise();
      await this.http
        .post(env.baseUrl + "/login", { email, password })
        .toPromise();
      AuthService.loggedIn = true;
      this.authSubject.next(AuthService.loggedIn);
      this.presentToast("You are now loggedin " + AuthService.user.name);
    } catch (e) {}
  }
  logout() {
    return this.http.post(`${env.baseUrl}/logout`, {}).pipe(
      map((res) => {
        AuthService.loggedIn = false;
        this.authSubject.next(AuthService.loggedIn);
        this.presentToast("You are now logged out");
      })
    );
  }
  fetchUser() {
    return this.http.get(env.baseUrl + "/api/user").pipe(
      map((res: any) => {
        AuthService.user = res.data;
        AuthService.loggedIn = true;
        return res.data;
      }),
      catchError((err: any) => {
        console.log(err);
        return of({});
      })
    );
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }
}
