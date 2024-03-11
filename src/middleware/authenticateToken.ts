import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const SECRET_KEY = String(process.env.SECRET_KEY);

interface IRequestAuth extends Request {
    userId?: string
}
const authenticateToken = (req: IRequestAuth, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers?.authorization;

        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) res.status(401).send('Unauthorized');
        jwt.verify(String(token), SECRET_KEY, (err: any, payload: any) => {
            if (err) {
                throw new Error('invalid token')
            };
            req.userId = payload.userId;

            next();
        });
    } catch (error) {
        res.status(401).send('Unauthorized (для работы нужен токен)');
    }
};

export default authenticateToken