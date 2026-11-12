
import { Router } from 'express';

import {
    findAllInvoices,
    findInvoiceById,
    insertInvoice,
    modifyInvoice,
    removeInvoice
} from './invoice.service.ts';

import {
    invoiceSchema,
    toFieldErrors
} from './invoice.schema.ts';

const router = Router();

function parseID(value: string): number | undefined {
    const id = Number(value);

    if (!Number.isInteger(id) || id < 1) {
        return undefined;
    }

    return id;
}

// Listar todas as faturas
router.get('/', async (_request, response) => {
    const invoices = await findAllInvoices();

    response.status(200).json(invoices);
});

// Buscar fatura pelo ID
router.get('/:id', async (request, response) => {
    const id = parseID(request.params.id);

    if (!id) {
        response.status(400).json({
            error: {
                status: 400,
                message: 'Identificador inválido'
            }
        });
        return;
    }

    const invoice = await findInvoiceById(id);

    if (!invoice) {
        response.status(404).json({
            error: {
                status: 404,
                message: 'Fatura não encontrada.'
            }
        });
        return;
    }

    response.status(200).json(invoice);
});

// Criar fatura
router.post('/', async (request, response) => {
    const result = invoiceSchema.safeParse(request.body);

    if (!result.success) {
        response.status(400).json({
            error: {
                status: 400,
                message: 'Dados inválidos',
                fields: toFieldErrors(result.error)
            }
        });
        return;
    }

    const invoice = await insertInvoice(result.data);

    response.status(201).json(invoice);
});

// Atualizar fatura
router.put('/:id', async (request, response) => {
    const id = parseID(request.params.id);

    if (!id) {
        response.status(400).json({
            error: {
                status: 400,
                message: 'Identificador inválido'
            }
        });
        return;
    }

    const invoice = await modifyInvoice(
        id,
        request.body
    );

    if (!invoice) {
        response.status(404).json({
            error: {
                status: 404,
                message: 'Fatura não encontrada.'
            }
        });
        return;
    }

    response.status(200).json(invoice);
});

// Excluir fatura
router.delete('/:id', async (request, response) => {
    const id = parseID(request.params.id);

    if (!id) {
        response.status(400).json({
            error: {
                status: 400,
                message: 'Identificador inválido'
            }
        });
        return;
    }

    const deleted = await removeInvoice(id);

    if (!deleted) {
        response.status(404).json({
            error: {
                status: 404,
                message: 'Fatura não encontrada.'
            }
        });
        return;
    }

    response.status(204).end();
});

export default router;
