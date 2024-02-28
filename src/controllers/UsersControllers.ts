import usersServices from '../services/UsersServices';
import { validationResult } from "express-validator";

const SECRET_KEY = String(process.env.SECRET_KEY);

import bcrypt from 'bcrypt';
import Sentry from "@sentry/node";

import jwt from 'jsonwebtoken';


class UsersControllers {
    async createUser(req: any, res: any) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { username, email, password } = req.body;

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            let newUser;
            await usersServices.createUser(username, email, hashedPassword)
                .then((result: any) => { newUser = result })
                .catch(() => { throw new Error('400') })
            res.status(201).send(newUser);
        } catch (err: any) {
            if (err.message === '400') {
                res.status(400).json({ message: "the user is already registered" });
            } else {
                res.status(500).json({ message: "error while registering user" });
                Sentry.captureException(err);
            }

        }

    }

    async loginUser(req: any, res: any) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            const user = await usersServices.getUserByEmail(email);
            if (!user) {
                return res.status(401).json({ message: "Неверный email или пароль" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Неверный email или пароль" });
            }

            const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "365d" });


            res.json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ошибка входа в систему" });
        }


    }
}

export default new UsersControllers();