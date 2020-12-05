import { Component, OnInit, Input } from "@angular/core";
import { Message } from "./../interface";
@Component({
  selector: "app-messages-flow",
  template: `
    <div class="message-flow-container">
      <app-message
        *ngFor="let message of messages; let i = index"
        [message]="message"
        [ngClass]="{ 'break-flow': message.break }"
        [showIsReadIcon]="i > lastMessageMemberIndex"
      ></app-message>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        margin-top: 1rem;
      }
      .break-flow {
        margin-bottom: 0.5rem;
      }
    `,
  ],
})
export class MessagesFlowComponent implements OnInit {
  @Input() messages: Message[];
  @Input() lastMessageMemberIndex: number;

  constructor() {}

  ngOnInit() {}
}
