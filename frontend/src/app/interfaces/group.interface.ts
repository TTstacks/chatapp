export interface GroupInterface{
    id: string;
    name: string;
    users: string[];
}

export type GroupMapInterface ={
    [id: string]: {
        name: string;
        users: string[];
    }
}