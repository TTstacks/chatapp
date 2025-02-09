import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../services/group.service';
import { UserInterface } from '../interfaces/user.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adduser',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './adduser.component.html',
  styleUrl: './adduser.component.scss'
})
export class AdduserComponent implements OnInit {
  private id: string;
  users: UserInterface[] = [];
  usersToAdd: string[] = [];
  userEmail: string;
  constructor(private route: ActivatedRoute, private router: Router, private groupService: GroupService){}
  ngOnInit(): void {
    this.id = <string>this.route.snapshot.paramMap.get('id');
  }

  addUsersToRoom(){
    this.groupService.addUsersToRoom(this.id, this.usersToAdd);
    this.router.navigateByUrl(`chat/${this.id}`);
  }

  searchUsers(){
    this.groupService.searchUser(this.id, this.userEmail).subscribe((value)=>{
      this.users = value;
    });
  }

  addUser(user: UserInterface){
    this.usersToAdd.push(user.email);
    console.log(this.usersToAdd);
  }

  deleteUser(user: UserInterface){
    this.usersToAdd.splice(this.usersToAdd.indexOf(user.email), 1);
    console.log(this.usersToAdd);
  }
}
