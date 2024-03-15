import Sentry from "@sentry/node";
import { Response } from 'express';
import ResponceError from '../utils/ResponseError';

class ErrorHandler {
    do(error: any, res: Response) {
        const { code } = error;

        if (code) return res.status(code).json(error)

        Sentry.captureException(error);
        console.error(error)
        res.status(500).json(new ResponceError(500));
    }
}

export default new ErrorHandler();