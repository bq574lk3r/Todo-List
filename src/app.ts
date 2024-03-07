require('dotenv').config({ path: `${process.env.NODE_ENV || ''}.env` });
import express from 'express';
import router from './routes/';

import * as Sentry from "@sentry/node";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerSpec';

import path from 'path';
import ip from 'ip';

import mongoose from 'mongoose';
import connectDb from './config/db';


const app = express();

const PORT = process.env.PORT;
const SENTRY_DSN = process.env.SENTRY_DSN;



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

app.use(function onError(err: any, req: any, res: any) {
    res.status(500).end(res.sentry + "\n");
});

connectDb();

mongoose.connection.once('open', () => {
    console.log('Connect mongoose DB')
    app.listen(process.env.PORT, () => {
        console.log(`Server start 👉 http://${ip.address()}:${PORT}`)
    })
})

export default app;