import fs from 'fs';

class FileHelpers {
    readFile(file:string):Promise<any> {
        return new Promise((res, rej) => {
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    rej(err)
                }
                res(JSON.parse(data))
            });
        });
    }
    writeFile(file:string, data:any):Promise<any> {
        return new Promise((res, rej) => {
            fs.writeFile(file, JSON.stringify(data, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    rej(err)
                }
                res('ok')
            });
        });
    }
}

export default new FileHelpers();
