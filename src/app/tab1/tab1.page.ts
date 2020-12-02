import { environment as env } from "./../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
  get username() {
    return AuthService.user.name;
  }
  constructor(
    private http: HttpClient,
    private modalController: ModalController
  ) {}

  ionViewWillEnter() {
    console.log("Tab1 will enter");
  }
  ionViewDidEnter() {
    console.log("Tab1 did enter");
  }
  ionViewWillLeave() {
    console.log("Tab1 will leave");
  }
  ionViewDidLeave() {
    console.log("Tab1 did leave");
  }
}
