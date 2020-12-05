import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import Pusher from "pusher-js";
import { environment as env } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class PusherService {
  public client: Pusher;

  constructor(private http: HttpClient) {
    this.client = new Pusher(env.PUSHER_WEBSOCKETS_KEY, {
      // cluster: "",
      forceTLS: false,
      disableStats: true,
      wsHost: env.PUSHER_WEBSOCKETS_SERVER,
      wsPort: env.PUSHER_WEBSOCKETS_PORT,
      authorizer: (channel, options) => {
        return {
          authorize: (socketId, callback) => {
            this.http
              .post(env.PUSHER_AUTH_ENDPOINT, {
                socket_id: socketId,
                channel_name: channel.name,
              })
              .toPromise()
              .then((response: any) => {
                // console.log(response);
                callback(null, response);
              })
              .catch((error) => {
                // console.log(error);
                callback(error, null);
              });
          },
        };
      },
    });
  }
}
