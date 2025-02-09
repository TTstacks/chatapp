import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {
  isAuthenticated = false;

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.authService.authEvent.subscribe((value: boolean) =>{
      this.isAuthenticated = value;
    })
  }

  logout(): void{
    this.authService.logout();
  }
}
