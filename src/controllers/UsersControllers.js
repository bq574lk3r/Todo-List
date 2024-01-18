const { UsersServices } = require('../services/UsersServices');
const { validationResult } = require("express-validator");
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const bcrypt = require('bcrypt');
const Sentry = require("@sentry/node");

const jwt = require('jsonwebtoken')


class UsersControllers {
    async createUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { username, email, password } = req.body;

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = await UsersServices.createUser(username, email, hashedPassword)

            res.status(201).send(newUser);
        } catch (error) {
            res.status(500).json({ message: "Ошибка при регистрации пользователя" });
            Sentry.captureException(error);
        }

    }

    async loginUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const {email, password } = req.body;

            const user = await UsersServices.getUserByEmail(email);
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

module.exports = new UsersControllers();