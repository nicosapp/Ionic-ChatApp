// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const apiBaseUrl = "//192.168.0.20:8000";

export const environment = {
  production: false,
  apiBaseUrl: apiBaseUrl,
  baseUrl: apiBaseUrl,
  chatEndpoint: `${apiBaseUrl}/api/chats`,
  PUSHER_AUTH_ENDPOINT: `${apiBaseUrl}/api/broadcasting/auth`,
  PUSHER_WEBSOCKETS_KEY: "local",
  PUSHER_WEBSOCKETS_SERVER: "192.168.0.20",
  PUSHER_WEBSOCKETS_PORT: 6001,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
