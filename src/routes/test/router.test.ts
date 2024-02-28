import app from '../../app'
import request from 'supertest'
import testHelpers from '../../helpers/TestHelpers'

afterAll(async () => {
    await testHelpers.deleteData();
});


describe('POST /register', () => {

    it('returns status code 201 if name, email and password is provided.', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'testUser',
                email: 'testuser@testmail.com',
                password: 't2stPas$ss'
            })

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining({
            id: expect.any(String),
            username: expect.any(String),
            email: expect.any(String)
        }))
    })

    it('returns a 400 status code if no name, email, or password is provided.', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'testUser',
                email: 'testuser@testmail.com',
            })
        expect(res.statusCode).toEqual(400);
    })

    it('returns a 400 status code if this user is already registered.', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'testUser',
                email: 'testuser@testmail.com',
                password: 't2stPas$ss'
            })
        expect(res.statusCode).toEqual(400);
    })

})

describe('POST /login', () => {

    it('returns status code 200 if successfully authorized.', async () => {
        await request(app)
            .post('/register')
            .send({
                username: 'testUserLogin',
                email: 'testuserlogin@testmail.com',
                password: 't2stPas$ss'
            })

        const res = await request(app)
            .post('/login')
            .send({
                email: 'testuserlogin@testmail.com',
                password: 't2stPas$ss'
            })

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({
            token: expect.any(String),
        }))
    })

    it('returns a 400 status code if not successfully authorized.', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'testUserLogin',
                password: 'notCorrecT2stPas$ss'
            })
        expect(res.statusCode).toEqual(400);
    })
})

describe('POST /todos', () => {
    let token: string;
    beforeAll(async () => {
        await request(app)
            .post('/register')
            .send({
                username: 'testUsertodos',
                email: 'testusertodos@testmail.com',
                password: 't2stPas$ss'
            })


        token = (await request(app)
            .post('/login')
            .send({
                email: 'testusertodos@testmail.com',
                password: 't2stPas$ss'
            })).body.token
    });

    it('returns status code 201 in case of successful authorization and task creation.', async () => {
        const res = await request(app)
            .post('/todos')
            .set('Authorization', 'Bearer ' + token)
            .send({
                'title': 'testTask',
                'isCompleted': false
            })

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
            isCompleted: expect.any(Boolean),
            idUser: expect.any(String),
        }))
    })
    it('returns status code 400 in case of successful authorization and invalid data.', async () => {
        const res = await request(app)
            .post('/todos')
            .set('Authorization', 'Bearer ' + token)
            .send({
                'isCompleted': false
            })

        expect(res.statusCode).toEqual(400);
    })

    it('returns status code 401 in case of unauthorized.', async () => {
        const res = await request(app)
            .post('/todos')
            .send({
                'isCompleted': false
            })

        expect(res.statusCode).toEqual(401);
    })
})

describe('GET /todos', () => {
    let token: string;
    beforeAll(async () => {
        await request(app)
            .post('/register')
            .send({
                username: 'testUsertodosGET',
                email: 'testusertodosget@testmail.com',
                password: 't2stPas$ss'
            })


        token = (await request(app)
            .post('/login')
            .send({
                email: 'testusertodosget@testmail.com',
                password: 't2stPas$ss'
            })).body.token


        await request(app)
            .post('/todos')
            .set('Authorization', 'Bearer ' + token)
            .send({
                'title': 'testTask Get method',
                'isCompleted': false
            })

    });

    it('returns status code 200 in case of successful authorization', async () => {
        const res = await request(app)
            .get('/todos')
            .set('Authorization', 'Bearer ' + token)
            .send()

        expect(res.statusCode).toEqual(200);
    })

    it('returns status code 401 in case of unauthorized.', async () => {
        const res = await request(app)
            .get('/todos')
            .send()

        expect(res.statusCode).toEqual(401);
    })
})

describe('PATCH /todos', () => {
    let token: string;
    let idTask: string;
    beforeAll(async () => {
        await request(app)
            .post('/register')
            .send({
                username: 'testUsertodosPATCH',
                email: 'testusertodospatch@testmail.com',
                password: 't2stPas$ss'
            })

        token = (await request(app)
            .post('/login')
            .send({
                email: 'testusertodospatch@testmail.com',
                password: 't2stPas$ss'
            })).body.token


        idTask = (await request(app)
            .post('/todos')
            .set('Authorization', 'Bearer ' + token)
            .send({
                'title': 'testTask PATCH method',
                'isCompleted': false
            })).body.id
    });
    it('returns status code 200 in case of successful authorization', async () => {
        const newTitle = 'test title'
        const res = await request(app)
            .patch('/todos/' + idTask)
            .set('Authorization', 'Bearer ' + token)
            .send(
                {
                    title: newTitle
                }
            )

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({
            id: expect.any(String),
            title: newTitle,
            isCompleted: expect.any(Boolean),
            idUser: expect.any(String),
        }))
    })

    it('returns status code 400 in case of of invalid title.', async () => {
        const res = await request(app)
            .patch('/todos/' + idTask)
            .set('Authorization', 'Bearer ' + token)
            .send(
                {
                    title: ''
                }
            )

        expect(res.statusCode).toEqual(400);
    })


    it('returns status code 404 in case of invalid id.', async () => {
        const res = await request(app)
            .patch('/todos/not-' + idTask)
            .set('Authorization', 'Bearer ' + token)
            .send(
                {
                    title: ''
                }
            )

        expect(res.statusCode).toEqual(404);
    })
})

describe('DELETE /todos', () => {
    let token: string;
    let idTask: string;
    beforeAll(async () => {
        await request(app)
            .post('/register')
            .send({
                username: 'testUsertodosDELETE',
                email: 'testusertodosdelete@testmail.com',
                password: 't2stPas$ss'
            })

        token = (await request(app)
            .post('/login')
            .send({
                email: 'testusertodosdelete@testmail.com',
                password: 't2stPas$ss'
            })).body.token


        idTask = (await request(app)
            .post('/todos')
            .set('Authorization', 'Bearer ' + token)
            .send({
                'title': 'testTask DELETE method',
                'isCompleted': false
            })).body.id
    });

    it('returns status code 200 if delete is successful', async () => {
        const res = await request(app)
            .delete('/todos/' + idTask)
            .set('Authorization', 'Bearer ' + token)
            .send()

        expect(res.statusCode).toEqual(200);
    })

    it('returns status code 404 in case of invalid id', async () => {
        const res = await request(app)
            .delete('/todos/' + idTask)
            .set('Authorization', 'Bearer ' + token)
            .send()

        expect(res.statusCode).toEqual(404);
    })
})