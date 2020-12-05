import { PusherService } from "./pusher.service";
import { MessageService } from "./message.service";
import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { Observable, Subject, of } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";

import { Chat } from "../interface";

import { environment as env } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private itemName = "Chat";
  private endpoint: string = env.chatEndpoint;
  private userId: number;
  private channel: string = `private-chats.updated`;

  private items: Chat[] = [];
  itemsSubject = new Subject<Chat[]>();

  constructor(public http: HttpClient, public pusherService: PusherService) {}

  emitItems() {
    this.itemsSubject.next(this.items.slice());
  }

  listen() {
    // private channel
    const channel = this.pusherService.client.subscribe(this.channel);
    channel.bind("App\\Events\\Chats\\ChatUpdated", (data: { chat: any }) => {
      let { chat } = data;

      console.log(data);

      this.items = this.items.map((c: any) => {
        if (c.id == chat.id) {
          c = { ...c, ...{ last_message: chat.last_message } };
        }
        return c;
      });
      this.emitItems();
    });
  }

  unlisten() {
    this.pusherService.client.unsubscribe(this.channel);
  }

  get(): Observable<Chat[]> {
    return this.http.get<Chat[]>(this.endpoint).pipe(
      map((res: any) => {
        this.items = res.data;
        this.emitItems();
        return res.data;
      }),
      tap((_) => this.log(`fetched ${this.itemName}`)),
      catchError(this.handleError<Chat[]>(this.log, `get${this.itemName}`, []))
    );
  }

  show(item: Chat | number): Observable<Chat> {
    const id = typeof item === "number" ? item : item.id;
    return this.http.get<Chat>(`${this.endpoint}/${id}`).pipe(
      map((res: any) => res.data),
      tap((_) => this.log(`fetched ${this.itemName} id=${id}`)),
      catchError(
        this.handleError<Chat>(this.log, `get${this.itemName} id=${id}`)
      )
    );
  }

  store(item: any): Observable<Chat> {
    return this.http.post(`${this.endpoint}`, item).pipe(
      map((res: any) => {
        this.items.push(res.data);
        this.emitItems();
        return res.data;
      }),
      tap((item: any) => this.log(`added ${this.itemName} w/ id=${item.id}`)),
      catchError(this.handleError<Chat>(this.log, `add${this.itemName}`))
    );
  }

  update(item: Chat): Observable<Chat> {
    return this.http.patch(`${this.endpoint}/${item.id}`, item).pipe(
      map((res: any) => {
        this.items = this.items.map((item: any) => {
          if (item.id === res.data.id) return res.data;
          return res.data;
        });
        this.emitItems();
        return res.data;
      }),
      tap((_) => this.log(`updated ${this.itemName} id=${item.id}`)),
      catchError(this.handleError<any>(this.log, `update${this.itemName}`))
    );
  }

  delete(item: Chat | number): Observable<any> {
    const id = typeof item === "number" ? item : item.id;
    return this.http.delete(`${this.endpoint}/${id}`).pipe(
      map((res: any) => {
        this.items = this.items.filter((item: any) => {
          item.id !== res.data.id;
        });
        this.emitItems();
        return res.data;
      }),
      tap((_) => this.log(`deleted ${this.itemName} id=${id}`)),
      catchError(this.handleError<Chat>(this.log, `delete ${this.itemName}`))
    );
  }

  private log = (message: string) => {
    console.log(`${this.itemName} Service: ${message}`);
    // this.messageService.add(`Chat Service: ${message}`);
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
