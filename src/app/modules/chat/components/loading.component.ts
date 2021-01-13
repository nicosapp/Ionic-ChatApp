import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "chat-loading",
  template: `
    <div class="chat-loading-container">
      <ion-spinner name="crescent"></ion-spinner>
    </div>
  `,
  styles: [
    `
      .chat-loading-container {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class LoadingComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
