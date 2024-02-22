import express from 'express';
const app = express();
import Sentry from "@sentry/node";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerSpec';
import path from 'path';

require('dotenv').config({ path: `${process.env.NODE_ENV || ''}.env` });

const PORT = process.env.PORT;
const SENTRY_DSN = process.env.SENTRY_DSN;

import router from './routes/';

// Sentry.init({
//     dsn: SENTRY_DSN,
// });

// app.use(Sentry.Handlers.requestHandler());
// app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customCssUrl: '/swaggerCustoms/style/docs.css' }));

app.use(router);

app.use(express.static(path.join(__dirname, '..', 'static')));

// app.use(Sentry.Handlers.errorHandler());

// app.use(function onError(err: any, req: any, res: any, next: any) {
//     res.statusCode = 500;
//     res.end(res.sentry + "\n");
// });

app.listen(PORT, () => {
    console.log(`Сервер запущен на 👉 http://localhost:${PORT}`);
});

export default app;