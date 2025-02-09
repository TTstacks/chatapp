import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, firstValueFrom, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { UserInterface } from '../interfaces/user.interface';
import { GroupInterface } from '../interfaces/group.interface';

const HTTPPATH = 'http://127.0.0.1/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpOptions = {withCredentials: true};
  public authEvent = new BehaviorSubject<boolean>(localStorage.getItem('access') != null);
  

  constructor(private http: HttpClient, private router: Router) {
    
   }

  register(obj: any){
    return this.http.post(HTTPPATH + '/register', obj, this.httpOptions).pipe(tap(
      res =>{}),
      catchError((err: any) => {
        console.log(err);
        return throwError(() => err);
      })
    );
  }

  login(obj: any){
    return this.http.post(HTTPPATH + '/token/', obj, this.httpOptions).pipe(tap(
        (res: any) => {
          localStorage.setItem('access', res['access']);
          this.router.navigate(['/chat']);
          this.authEvent.next(true);
        }
      ),
      catchError((err: any) => {
        console.log(err);
        return throwError(() => err);
      })
    );
  }

  getUserInfo(){
    return this.http.get<{user: UserInterface, groups: GroupInterface[]}>(HTTPPATH + '/user', this.httpOptions);
  }

  refresh(){
    return this.http.post<{access: string}>(HTTPPATH + '/token/refresh/', {}, this.httpOptions).pipe(
      tap((value) => {
        localStorage.setItem('access', value.access);
        this.authEvent.next(true);
      }),
      catchError((error) => {
        this.authEvent.next(false);
        return throwError(() => error);
      })
    );
  }

  
  logout(){
    localStorage.removeItem('access');
    this.authEvent.next(false);
  }


}
