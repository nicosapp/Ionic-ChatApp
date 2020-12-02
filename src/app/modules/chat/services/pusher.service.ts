import { Injectable } from "@angular/core";
import Pusher from "pusher-js";
import { environment as env } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class PusherService {
  public client: Pusher;

  constructor() {
    this.client = new Pusher(env.PUSHER_WEBSOCKETS_KEY, {
      // cluster: "",
      wsHost: env.PUSHER_WEBSOCKETS_SERVER,
      wsPort: env.PUSHER_WEBSOCKETS_PORT,
      forceTLS: false,
      disableStats: true,
    });
  }
}
