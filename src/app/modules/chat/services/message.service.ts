import { PusherService } from "./pusher.service";
// import { ChatModule } from "./chat.module";
import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { Observable, Subject, of } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";

import { Message } from "../interface";

import { environment as env } from "src/environments/environment";

import { sortBy as _sortBy } from "lodash";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  private itemName = "Message";
  private endpoint: string;
  private apiEndpoint: string = `messages`;
  private user: any;
  private chatId: number;
  private members: any = [];
  private channel = () => {
    return `presence-chat.${this.chatId}`;
  };

  private currentPage: number = 1;
  private lastPage: number = 1;

  private items: Message[] = [];
  itemsSubject = new Subject<any[]>();
  private isMemberOnline: boolean;
  memberOnlineSubject = new Subject<boolean>();
  private isOnline = (count: number) => {
    this.isMemberOnline = count > 1 ? true : false;
    this.memberOnlineSubject.next(this.isMemberOnline);
    if (this.isMemberOnline) this.markAsReadMessage();
  };

  constructor(public http: HttpClient, private pusherService: PusherService) {}

  setChatConfig({ chatId, userId }) {
    this.chatId = chatId;
    // this.userId = userId;
    this.endpoint = `${env.chatEndpoint}/${chatId}/${this.apiEndpoint}`;
  }

  listen() {
    // private channel
    const channel: any = this.pusherService.client.subscribe(this.channel());
    channel.bind("pusher:subscription_succeeded", (members) => {
      this.isOnline(channel.members.count);

      const me = members.me;
      this.user = me.info;
    });
    channel.bind("pusher:member_added", (member: any) => {
      this.isOnline(channel.members.count);
      this.members = [...this.members, ...[member.info]];
    });
    channel.bind("pusher:member_removed", (member: any) => {
      this.isOnline(channel.members.count);
      this.members = this.members.filter((m) => m.id != member.id);
      console.log(this.members);
    });
    channel.bind(
      "App\\Events\\Chats\\MessageSent",
      (data: { message: any }) => {
        let { message } = data;
        console.log(data);
        message.me = this.user.id == message.user_id;
        if (!message.me) {
          this.items = [...[message], ...this.items];
        }
        this.emitItems();
      }
    );
  }

  unlisten() {
    this.pusherService.client.unsubscribe(this.channel());
  }

  emitItems() {
    this.items = _sortBy(this.items, (i) => {
      return new Date(i.created_at);
    });
    this.items = this.items.map((m, i) => {
      if (this.items[i + 1]) {
        m.break = this.items[i].me !== this.items[i + 1].me;
      }
      return m;
    });
    this.itemsSubject.next(this.items.slice());
  }

  markAsReadMessage() {
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].is_read) break;
      this.items[i].is_read = true;
    }
  }

  getMessages() {
    return this.get().pipe(
      map((data) => {
        if (this.currentPage > this.lastPage) return { finished: true };
        return { received: true };
      })
    );
  }

  get(): Observable<Message[]> {
    return this.http
      .get<Message[]>(`${this.endpoint}?page=${this.currentPage}`)
      .pipe(
        map((res: any) => {
          this.items = [...this.items, ...res.data];
          this.currentPage = this.currentPage + 1;
          this.lastPage = res.meta.last_page;
          this.emitItems();
          return this.items;
        }),
        tap((_) => this.log(`fetched ${this.itemName}`)),
        catchError(
          this.handleError<Message[]>(this.log, `get${this.itemName}`, [])
        )
      );
  }

  show(item: Message | number): Observable<Message> {
    const id = typeof item === "number" ? item : item.id;
    return this.http.get<Message>(`${this.endpoint}/${id}`).pipe(
      map((res: any) => this.mapData(res)),
      tap((_) => this.log(`fetched ${this.itemName} id=${id}`)),
      catchError(
        this.handleError<Message>(this.log, `get${this.itemName} id=${id}`)
      )
    );
  }

  store(item: any): Observable<Message> {
    item.is_member_online = this.isMemberOnline;
    item.created_at = new Date();
    item.me = true;
    this.items = [...[item], ...this.items]; //on ajoute le message à la liste de message
    this.emitItems();
    return this.http.post(`${this.endpoint}`, item).pipe(
      map((res: any) => {
        const data = this.mapData(res);
        this.items = this.items.map((item: any) => {
          if (item.message === data.message) return data;
          return item;
        });
        // this.items = [...[data], ...this.items];
        this.emitItems();
        return data;
      }),
      tap((item: any) => {
        this.log(`added ${this.itemName} w/ id=${item.id}`);
      }),
      catchError(this.handleError<Message>(this.log, `add${this.itemName}`))
    );
  }

  update(item: Message): Observable<Message> {
    return this.http.patch(`${this.endpoint}/${item.id}`, item).pipe(
      map((res: any) => {
        const data = this.mapData(res);
        this.items = this.items.map((item: any) => {
          if (item.id === data.id) return data;
          return item;
        });
        this.emitItems();
        return data;
      }),
      tap((_) => this.log(`updated ${this.itemName} id=${item.id}`)),
      catchError(this.handleError<any>(this.log, `update${this.itemName}`))
    );
  }

  delete(item: Message | number): Observable<any> {
    const id = typeof item === "number" ? item : item.id;
    return this.http.delete(`${this.endpoint}/${id}`).pipe(
      map((res: any) => {
        const data = this.mapData(res);
        this.items = this.items.filter((item: any) => {
          item.id !== data.id;
        });
        this.emitItems();
        return data;
      }),
      tap((_) => this.log(`deleted ${this.itemName} id=${id}`)),
      catchError(this.handleError<Message>(this.log, `delete ${this.itemName}`))
    );
  }

  private mapData(res) {
    let data = res;
    if (res.data) data = res.data;
    return data;
  }

  private log = (message: string) => {
    console.log(`${this.itemName} Service: ${message}`);
    // this.messageService.add(`Message Service: ${message}`);
  };

  private handleError<T>(log: Function, operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
