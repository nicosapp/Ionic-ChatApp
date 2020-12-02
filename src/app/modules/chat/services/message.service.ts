import { PusherService } from "./pusher.service";
// import { ChatModule } from "./chat.module";
import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { Observable, Subject, of } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";

import { Message } from "../interface";

import { environment as env } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  private itemName = "Message";
  private endpoint: string;
  private apiEndpoint: string = `messages`;
  private userId: number;

  private items: Message[] = [];
  itemsSubject = new Subject<any[]>();
  private pusherService: PusherService;

  constructor(public http: HttpClient) {
    this.pusherService = new PusherService();
    // console.log(this.pusherService.client);
    const channel = this.pusherService.client.subscribe("chat");
    channel.bind(
      "App\\Events\\Chats\\MessageSent",
      (data: { message: any }) => {
        let { message } = data;
        console.log(data);
        message.me = this.userId == message.user_id;
        if (!message.me) this.items.push(message);
        this.emitItems();
      }
    );
  }

  setChatConfig({ chatId, userId }) {
    this.endpoint = `${env.chatEndpoint}/${chatId}/${this.apiEndpoint}`;
    this.userId = userId;
  }

  emitItems() {
    this.itemsSubject.next(this.items.slice());
  }

  get(): Observable<Message[]> {
    return this.http.get<Message[]>(this.endpoint).pipe(
      map((res: any) => {
        this.items = this.mapData(res);
      }),
      map((items: any) => {
        //format message items
        this.items = this.items.map((m, i) => {
          if (this.items[i + 1]) {
            m.break = this.items[i].me !== this.items[i + 1].me;
          }
          return m;
        });
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
    return this.http.post(`${this.endpoint}`, item).pipe(
      map((res: any) => {
        const data = this.mapData(res);
        this.items.push(data);
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
