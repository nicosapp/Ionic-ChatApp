import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

import Echo from "laravel-echo";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));

// Echo.private("chat").listen("MessageSent", (e) => {
//   this.messages.push({
//     broadcaster: "pusher",
//     key: environment.PUSHER_WEBSOCKETS_KEY,
//     wsHost: environment.PUSHER_WEBSOCKETS_SERVER,
//     wsPort: environment.PUSHER_WEBSOCKETS_PORT,
//     forceTLS: false,
//     disableStats: true,
//   });
// });

// window.Echo.channel('private-chat').list('MessageSent', (e)=>{
//   console.log(e)
// })
