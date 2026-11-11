
import supertest from 'supertest';

import {
    describe,
    it,
    expect,
    beforeEach,
    afterAll
} from 'vitest';

import app from './app.ts';
import prisma from './prisma.ts';

// Dados do cliente utilizado nos testes
const customer = {
    id: 0,
    email: 'teste@gefina.com.br'
};

// Guarda o ID da fatura criada para os testes
const invoice = { id: 0 };

// Remove os dados criados pelos testes
async function clear(): Promise<void> {

    // Exclui primeiro as faturas vinculadas ao cliente
    await prisma.invoice.deleteMany({
        where: {
            customer: {
                email: customer.email
            }
        }
    });

    // Depois exclui o cliente de teste
    await prisma.customer.deleteMany({
        where: {
            email: customer.email
        }
    });

    // Reinicia os IDs armazenados
    customer.id = 0;
    invoice.id = 0;
}

// Prepara os dados necessários para cada teste
async function populate(): Promise<void> {

    // Busca o primeiro usuário cadastrado
    const user = await prisma.user.findFirst({
        orderBy: {
            id: 'asc'
        }
    });

    // O cliente precisa estar vinculado a um usuário
    if (!user) {
        throw new Error(
            'Nenhum usuário encontrado para criar o cliente de teste.'
        );
    }

    // Cria um cliente utilizando o Prisma
    const createdCustomer = await prisma.customer.create({
        data: {
            userId: user.id,
            name: 'Teste',
            email: customer.email
        }
    });

    // Guarda o ID do cliente criado
    customer.id = createdCustomer.id;

    // Cria uma fatura vinculada ao cliente
    const createdInvoice = await prisma.invoice.create({
        data: {
            customerId: customer.id,
            amount: 125037,
            status: 'pending',
            issueDate: new Date('2026-10-01'),
            dueDate: new Date('2026-10-31')
        }
    });

    // Guarda o ID da fatura criada
    invoice.id = createdInvoice.id;
}

// Permite testar as rotas do Express
const request = supertest(app);

describe('rotas de faturas', () => {

    // Executa antes de cada teste
    beforeEach(async () => {
        await clear();
        await populate();
    });

    // Executa após todos os testes
    afterAll(async () => {
        await clear();

        // Encerra a conexão do Prisma com o banco
        await prisma.$disconnect();
    });

    // TESTE 1: Listar faturas
    it('devolve a relação de faturas', async () => {
        const response = await request.get('/api/invoices');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // TESTE 2: Criar uma fatura
    it('cria fatura e devolve o registro criado', async () => {
        const response = await request
            .post('/api/invoices')
            .send({
                customerId: customer.id,
                amount: 12345,
                status: 'pending',
                issueDate: '2026-10-01',
                dueDate: '2026-10-31'
            });

        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.customer.id).toBe(customer.id);
        expect(response.body.situation).toBe('overdue');
    });

    // TESTE 3: Atualizar uma fatura
    it('altera fatura e devolve fatura alterada', async () => {
        const response = await request
            .put(`/api/invoices/${invoice.id}`)
            .send({
                customerId: customer.id,
                amount: 125037,
                status: 'paid',
                issueDate: '2026-10-01',
                dueDate: '2026-10-31'
            });

        expect(response.status).toBe(200);
        expect(response.body.situation).toBe('paid');
    });

    // TESTE 4: Excluir uma fatura
    it('remove fatura', async () => {
        const removal = await request.delete(
            `/api/invoices/${invoice.id}`
        );

        const search = await request.get(
            `/api/invoices/${invoice.id}`
        );

        expect(removal.status).toBe(204);
        expect(search.status).toBe(404);
    });

    // TESTE 5: Rejeitar identificador inválido
    it('recusa busca de fatura com identificador inválido', async () => {
        const response = await request.get('/api/invoices/abc');

        expect(response.status).toBe(400);
    });

    // TESTE 6: Rejeitar fatura com valor zerado
    it('recusa criação de fatura com valor zerado', async () => {
        const response = await request
            .post('/api/invoices')
            .send({
                customerId: customer.id,
                amount: 0,
                status: 'pending',
                issueDate: '2026-10-01',
                dueDate: '2026-10-31'
            });

        expect(response.status).toBe(400);
        expect(response.body.error.fields.amount).toBeDefined();
    });
});
