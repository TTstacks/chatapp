import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { GroupRoomComponent } from './group-room/group-room.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { AdduserComponent } from './adduser/adduser.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path: "login", component: LoginComponent},
    {path: "signup", component: SignupComponent},
    {path: "", redirectTo: "/chat", pathMatch: "full"},
    {
        path: "chat", 
        component: HomeComponent,
        canActivate: [authGuard],
        children: [
            {
                path: "create",
                component: CreateGroupComponent
            },
            {
                path: ":id",
                children: [
                    {
                        path: "",
                        pathMatch: "full",
                        component: GroupRoomComponent,
                    },
                    {
                        path: "add-user",
                        component: AdduserComponent,
                    }
                ]
            }
        ]
    },
    {path: 'not-found', component: NotfoundComponent},
    {path: "**", redirectTo: '/not-found'}
];
