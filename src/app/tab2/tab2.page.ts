import { AuthService } from "./../services/auth.service";
import { environment as env } from "./../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page {
  private email: string = "nicolas.izac.app@gmail.com";
  private password: string = "Therom04!";

  constructor(
    private http: HttpClient,

    private authService: AuthService
  ) {}

  async login(number) {
    let email, password;
    if (number === 1) {
      email = "nicolas.izac.app@gmail.com";
      password = "Therom04!";
    } else if (number === 2) {
      email = "cazi.nicolas@gmail.com";
      password = "password";
    } else if (number === 3) {
      email = "bernardgmail.com";
      password = "password";
    }

    await this.authService.loginWith({ email, password });
    this.authService.fetchUser().subscribe();
  }

  async logout() {
    this.authService.logout().subscribe();
  }
}
