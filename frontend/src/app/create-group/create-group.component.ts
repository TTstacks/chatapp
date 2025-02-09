import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from '../services/group.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss'
})
export class CreateGroupComponent {
  groupName: string = "";

  constructor(private router: Router, private groupService: GroupService){}

  createGroup(){
    if(this.groupName === "") return;
    this.groupService.createGroup(this.groupName).subscribe({
      next: (value) => {
        this.groupService.addUsersToRoom(value.id, value.users);
      },
      error: (err: any) => {console.log(err);},
    })
    this.router.navigateByUrl("/chat");
  }

}
