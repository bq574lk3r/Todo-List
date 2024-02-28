import { v4 as uuidv4 } from 'uuid';

export class Task {
    id: string;
    title: string;
    isCompleted: boolean;
    idUser: string;
    constructor(title:string, isCompleted:boolean, idUser:string) {
    
        this.id = uuidv4();
        this.title = title;
        this.isCompleted = isCompleted;
        this.idUser = idUser;

    }
}