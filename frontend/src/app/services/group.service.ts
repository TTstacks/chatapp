import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { UserInterface } from '../interfaces/user.interface';
import { GroupInterface } from '../interfaces/group.interface';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private subject: WebSocketSubject<any>;
  public observable: Observable<any>; 
  constructor(private http: HttpClient) { 
    this.subject = webSocket('ws://127.0.0.1/ws/chat/');
    this.observable = this.subject.asObservable();
  }

  addUsersToRoom(id: string, emails: string[]){
    this.subject.next({"id": id, "emails": emails});
  }

  searchUser(id: string, userEmail: string){
    return this.http.get<UserInterface[]>(`http://127.0.0.1/api/chat/${id}/add-user?email=${userEmail}`, {withCredentials: true});
  }

  createGroup(name: string){
    return this.http.post<GroupInterface>('http://127.0.0.1/api/chat/create-group', {"name": name}, {withCredentials: true});
  }
}
