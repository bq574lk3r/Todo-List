const fs = require('fs');

class FileHelpers {
    readFile(file) {
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
    writeFile(file, data) {
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

module.exports = new FileHelpers();