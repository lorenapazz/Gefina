
import { beforeEach, describe, it, expect, afterAll } from 'vitest';
import supertest from 'supertest';
import app from './app.ts';
import pool from './database.ts';

const user = { id: 0 };

const customer = {
    id: 0,
    email: 'cliente@teste.com.br'
};

const invoice = { id: 0 };

async function populate(): Promise<void> {
    const connect = await pool.query(
        `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id;
        `,
        [
            'Usuário de Teste',
            `usuario-${Date.now()}@teste.com`,
            'placeholder'
        ]
    );

    user.id = connect.rows[0].id;

    const connectCustomer = await pool.query(
        `
        INSERT INTO customers (user_id, name, email)
        VALUES ($1, $2, $3)
        RETURNING id;
        `,
        [
            user.id,
            'Cliente de Teste',
            `cliente-${Date.now()}@teste.com.br`
        ]
    );

    customer.id = connectCustomer.rows[0].id;

    const connectInvoice = await pool.query(
        `
        INSERT INTO invoices
        (customer_id, amount, status, issue_date, due_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
        `,
        [
            customer.id,
            125037,
            'pending',
            '2023-10-01',
            '2026-10-31'
        ]
    );

    invoice.id = connectInvoice.rows[0].id;
}

async function cleanup(): Promise<void> {
    if (invoice.id !== 0) {
        await pool.query(
            'DELETE FROM invoices WHERE id = $1;',
            [invoice.id]
        );
        invoice.id = 0;
    }

    if (customer.id !== 0) {
        await pool.query(
            'DELETE FROM customers WHERE id = $1;',
            [customer.id]
        );
        customer.id = 0;
    }

    if (user.id !== 0) {
        await pool.query(
            'DELETE FROM users WHERE id = $1;',
            [user.id]
        );
        user.id = 0;
    }
}

const request = supertest(app);

describe('rotas de fatura', () => {

    beforeEach(async () => {
        await cleanup();
        await populate();
    });

    afterAll(async () => {
        try {
            await cleanup();
        } finally {
            await pool.end();
        }
    });

    it('devolve a relação de faturas', async () => {
        const response = await request.get('/api/invoices');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
