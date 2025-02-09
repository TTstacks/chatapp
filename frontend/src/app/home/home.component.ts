import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { interval, Observable, Subscription } from 'rxjs';
import { GroupInterface, GroupMapInterface } from '../interfaces/group.interface';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy{

  isAuthenticated = false;
  groupMap: GroupMapInterface = {};
  groupSubscription: Subscription;

  constructor(private router: Router, private authService: AuthService, private groupService: GroupService){
  }

  ngOnInit(): void {
    this.authService.authEvent.subscribe((value: boolean) =>{
      this.isAuthenticated = value;
    });
    this.authService.getUserInfo().subscribe({next: (value) => {
      value.groups.map((obj: GroupInterface) => {
        this.groupMap[obj.id] = {
          name: obj.name,
          users: obj.users
        };
      })
    },
    error: (err: any) => {
      
    }
    });
    this.groupSubscription = this.groupService.observable.subscribe({
      next: (value: GroupInterface) => {
        this.groupMap[value.id] = {
          name: value.name,
          users: value.users
        };
      },
      error: (err: any) => {console.log(err);},
      complete: () => {}   
    });
  }

  ngOnDestroy(): void {
    this.groupSubscription?.unsubscribe();
  }
}
