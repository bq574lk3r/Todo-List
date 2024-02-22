import fileHelpers from './FileHelpers';
const testDataFile = process.env.DATA || 'data.test.json';

class testHelpers {
    async deleteData(): Promise<void> {
        const data = await fileHelpers.readFile(testDataFile);
            data.tasks.length = 0;
            data.users.length = 0;
            await fileHelpers.writeFile(testDataFile, data);
    }
}

export default new testHelpers();