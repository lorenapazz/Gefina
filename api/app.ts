
import express from 'express';

import dashboard from './dashboard.route.ts';
import invoices from './invoice.route.ts';
import handleError from './error.middleware.ts';

const app = express();

app.use(express.json());

app.use('/api/dashboard', dashboard);
app.use('/api/invoices', invoices);

app.use((_request, response) => {
    response.status(404).json({
        error: {
            status: 404,
            message: 'Recurso não encontrado.'
        }
    });
});

app.use(handleError);

export default app;
