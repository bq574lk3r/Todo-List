import jwt from 'jsonwebtoken';
const SECRET_KEY = String(process.env.SECRET_KEY);

const authenticateToken = (req: any, res: any, next: any) => {
    try {
        const authHeader = req.headers?.authorization;
        console.log(authHeader)
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) res.status(401).send('Unauthorized');
        jwt.verify(token, SECRET_KEY, (err: any, payload: any) => {
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