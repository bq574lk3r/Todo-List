import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ResponseError from '../utils/ResponseError';
import ErrorHandler from '../helpers/ErrorHandlerHelpers';

const SECRET_KEY = String(process.env.SECRET_KEY);

interface IRequestAuth extends Request {
    userId?: string
}
const authenticateToken = (req: IRequestAuth, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers?.authorization;

        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) throw new ResponseError(401);
        jwt.verify(String(token), SECRET_KEY, (err: any, payload: any) => {
            if (err) {
                throw new ResponseError(401);
            };
            req.userId = payload.userId;

            next();
        });
    } catch (error: any) {
        ErrorHandler.do(error, res)
    }
};

export default authenticateToken