import { UserInterface } from "./user.interface";

export interface MessageInterface{
    text: string;
    user: UserInterface;
    delivered: string;
}