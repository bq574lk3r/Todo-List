export class Task {
    id: string | undefined;
    title: string;
    isCompleted: boolean;
    _idUser: string | any;
    constructor(title: string, isCompleted: boolean, idUser: any) {
        this.title = title;
        this.isCompleted = isCompleted;
        this._idUser = idUser;
    }
}