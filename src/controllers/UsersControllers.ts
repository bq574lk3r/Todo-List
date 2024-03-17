import { Request, Response } from 'express';
import usersServices from '../services/UsersServices';
import { validationResult } from "express-validator";
import ResponseError from '../utils/ResponseError';
import ErrorHandler from '../helpers/ErrorHandlerHelpers';

const SECRET_KEY = String(process.env.SECRET_KEY);

import bcrypt from 'bcrypt';


import jwt from 'jsonwebtoken';


class UsersControllers {
    async createUser(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ResponseError(400, errors.array());
            }
            const { username, email, password } = req.body;

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = await usersServices.createUser(username, email, hashedPassword)

            res.status(201).send(newUser);
        } catch (error: any) {
            ErrorHandler.do(error, res)

        }

    }

    async loginUser(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ResponseError(400, errors.array());
            }

            const { email, password } = req.body;

            const user = await usersServices.getUserByEmail(email);
            if (!user) {
                throw new ResponseError(400, "Invalid email address or password");
            }

            const isPasswordValid = await bcrypt.compare(password, String(user.password));
            if (!isPasswordValid) {
                throw new ResponseError(400, "Invalid email address or password");
                
            }

            const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "365d" });


            res.json({ token });
        } catch (error) {
            ErrorHandler.do(error, res)

        }


    }
}

export default new UsersControllers();