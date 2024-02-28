import { v4 as uuidv4 } from 'uuid';

export class User {
    [x: string]: string;
    constructor(username: string, email: string, password: string) {
        this.id = uuidv4();
        this.username = username;
        this.email = email;
        this.password = password;

    }
}