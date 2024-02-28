export class User {
    id: string | undefined;
    username: string;
    email: string;
    password: string;
    tasks: any[];
    constructor(username: string, email: string, password: string) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.tasks = [];
    }
}