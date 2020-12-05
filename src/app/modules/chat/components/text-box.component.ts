import { MessageService } from "./../services/message.service";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-text-box",
  template: `
    <div class="text-box-wrapper">
      <ion-item>
        <ion-textarea
          rows="1"
          [autoGrow]="true"
          name="message"
          enterkeyhint="enter"
          [(ngModel)]="message"
        ></ion-textarea>
        <ion-fab-button
          size="small"
          slot="end"
          [disabled]="disabled"
          (click)="send()"
        >
          <ion-icon name="send" size="small"></ion-icon>
        </ion-fab-button>
      </ion-item>
    </div>
  `,
  styles: [
    `
      .text-box-wrapper {
        padding: 10px;
        background: transparent;
      }
      ion-item {
        --border-radius: 0.3rem;
        --highlight-height: 0;
        --inner-padding-end: 0;
        --border-width: 0;
        --background: var(--ion-color-light);
      }
      ion-textarea {
        max-height: 100px;
        overflow: scroll;
      }
    `,
  ],
})
export class TextBoxComponent implements OnInit {
  @Input() chatId: number;

  private message: string;
  get disabled() {
    return !this.message || !this.message.length;
  }
  constructor(private messageService: MessageService) {}

  async send() {
    const message = {
      message: this.message,
    };
    // this.messageService.setChatConfig(this.chatId);
    try {
      this.messageService.store(message).toPromise();
      this.message = "";
    } catch (e) {}
  }
  ngOnInit() {}
}
