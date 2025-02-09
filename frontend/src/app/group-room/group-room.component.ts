import { AfterViewChecked, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { UserInterface } from '../interfaces/user.interface';
import { MessageInterface } from '../interfaces/message.interface';
import { MessageService } from '../services/message.service';
import { map, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-group-room',
  standalone: true,
  imports: [FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './group-room.component.html',
  styleUrl: './group-room.component.scss'
}) 
export class GroupRoomComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messageBody') mBody: any;
  userInfo: UserInterface;
  messages: MessageInterface[];
  inputValue: string;
  subject: any;
  subscription: Subscription;
  constructor(private route: ActivatedRoute, private authService: AuthService, private messageService: MessageService){}
  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(paramMap => <string>paramMap.get("id"))
    ).subscribe((value) => {
      if(this.subscription) this.subscription.unsubscribe();
      this.messageService.getRoomMessages().subscribe((value)=>{
        this.messages = value;
        this.messageService.connectToRoom();
        this.subscription = this.messageService.observale.subscribe({
          next: (msg: MessageInterface) => {
            this.messages.push(msg);
          },
          error: (err: any) => {
            console.log(err.status);
          },
          complete: () => {}
        });
      });
    })
    this.authService.getUserInfo().subscribe((value) => {
      this.userInfo = value.user;
    });

    
   
  }

  ngOnDestroy(): void {
    if(!this.subscription) return;
    this.subscription.unsubscribe();
  }

  ngAfterViewChecked(): void {
    this.mBody.nativeElement.scrollTop = this.mBody.nativeElement.scrollHeight;
  }

  getInputValue(){
    if(this.inputValue === "") return;
    this.messageService.sendMessage(this.inputValue);
    this.inputValue = "";
  }
}
