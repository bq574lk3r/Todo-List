const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) res.status(401).send('Unauthorized');
        jwt.verify(token, SECRET_KEY, (err, payload) => {
            if (err) { 
                next(new Error('invalid token')); 
            };

            req.userId = payload.userId;

            next();
        });
    } catch (error) {
        res.status(401).send('Unauthorized (для работы нужен токен)');
    }
};

module.exports = authenticateToken;