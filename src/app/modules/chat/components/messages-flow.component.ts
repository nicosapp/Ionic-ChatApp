import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Message } from "./../interface";
import { IonInfiniteScroll } from "@ionic/angular";

@Component({
  selector: "app-messages-flow",
  template: `
    <ng-content select="[infiniteScroll]"></ng-content>
    <div class="message-flow-container">
      <app-message
        *ngFor="let message of messages; let i = index"
        [message]="message"
        [prev]="prev(i)"
        [next]="next(i)"
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

  prev(i) {
    return this.messages[i - 1] || null;
  }

  next(i) {
    return this.messages[i + 1] || null;
  }

  ngOnInit() {}
}
