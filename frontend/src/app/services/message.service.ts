import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router, RouterFeatures } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { MessageInterface } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly httpOptions = {withCredentials: true};
  private subject: WebSocketSubject<any>;
  public observale: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
  }

  connectToRoom(){
    this.subject = webSocket(`ws://127.0.0.1/ws${this.router.url}/`);
    this.observale = this.subject.asObservable();
  }

  sendMessage(text: string){
    this.subject.next({'text': text});
  }

  getRoomMessages(){
    return this.http.get<MessageInterface[]>(`http://127.0.0.1/api${this.router.url}`, this.httpOptions).pipe(
      catchError((err: any) => {
        if(err.status === 404) this.router.navigateByUrl('/not-found');
        return throwError(() => new Error('damn'));
      })
    );
  }

}



