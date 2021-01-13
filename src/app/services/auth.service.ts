import { map, catchError } from "rxjs/operators";
import { ToastController } from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, of } from "rxjs";
import { environment as env } from "./../../environments/environment";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public static user: any;
  public authSubject = new Subject<any>();
  public static loggedIn: boolean = false;

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private storage: Storage
  ) {}

  async loginWith({ email, password }) {
    try {
      const response: any = await this.http
        .post(env.baseUrl + "/api/auth/signin", {
          email,
          password,
          device_name: "android",
        })
        .toPromise();
      this.setLocalStorate(response.data);
      AuthService.loggedIn = true;
      this.authSubject.next(AuthService.loggedIn);
    } catch (e) {
      console.log(e);
    }
  }
  logout() {
    return this.http.post(`${env.baseUrl}/api/auth/signout`, {}).pipe(
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
        this.presentToast("You are now loggedin " + AuthService.user.name);
        return res.data;
      }),
      catchError((err: any) => {
        console.log(err);
        return of({});
      })
    );
  }

  refreshToken() {}

  setLocalStorate(x: LoginResult) {
    console.log(x);
    // localStorage.setItem("access_token", x.access_token);
    this.storage.ready().then(() => {
      this.storage.set("access_token", x.access_token);
      this.storage.set("refresh_token", x.refresh_token);
    });
  }

  private getTokenRemainingTime() {}

  private startTokenTimer() {}

  private stopTokenTimer() {
    // this.timer?.unsubscribe();
  }

  clearLocalStorage() {}

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }
}

interface LoginResult {
  access_token: string;
  refresh_token?: string;
}
