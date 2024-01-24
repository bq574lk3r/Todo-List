const express = require('express');
const app = express();
const Sentry = require("@sentry/node");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swaggerSpec.js'); 
const path = require('path')

require('dotenv').config();
const PORT = process.env.PORT;
const SENTRY_DSN = process.env.SENTRY_DSN;

const router = require('./routes/');

Sentry.init({
    dsn: SENTRY_DSN,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());



app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customCssUrl: '/swaggerCustoms/style/docs.css' }));

app.use(router);

app.use(express.static(path.join(__dirname, '..', 'static')));


app.use(Sentry.Handlers.errorHandler());

app.use(function onError(err, req, res, next) {
    res.statusCode = 500;
    res.end(res.sentry + "\n");
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});