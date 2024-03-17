import usersServices from '../services/UsersServices';
import ResponseError from '../utils/ResponseError';
import { Request, Response } from 'express';
import { validationResult } from "express-validator";

import bcrypt from 'bcrypt';
import ErrorHandler from '../helpers/ErrorHandlerHelpers';
import jwt from 'jsonwebtoken';

const SECRET_KEY = String(process.env.SECRET_KEY);

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

            const newUser = await usersServices.createUser(username, email, hashedPassword);

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
                throw new ResponseError(400, "Invalid email address or password" );
            }

            const isPasswordValid = await bcrypt.compare(password, String(user.password));
            if (!isPasswordValid) {
                throw new ResponseError(400, "Invalid email address or password" );
            }

            const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "365d" });//TODO: don't forget to change


            res.json({ token });
        } catch (error: any) {
            ErrorHandler.do(error, res)
        }


    }
}

export default new UsersControllers();