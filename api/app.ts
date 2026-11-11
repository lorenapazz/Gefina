
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';

// Importa as rotas da aplicação
import dashboard from './dashboard.route.ts';
import invoices from './invoice.route.ts';
import customers from './customer.route.ts';

// Importa o Prisma para acessar o banco de dados
import prisma from './prisma.ts';

// Importa o middleware responsável pelos erros
import handleError from './error.middleware.ts';

// Cria a aplicação Express
const app = express();

// Permite receber dados em formato JSON
app.use(express.json());

// Localiza a pasta de produção do frontend React
const dist = path.join(
    import.meta.dirname,
    '..',
    'web',
    'dist'
);

// Registra no terminal as requisições recebidas
app.use((request, _response, next) => {
    console.log(`${request.method} ${request.url}`);

    // Continua para o próximo middleware ou rota
    next();
});

// Verifica se o servidor e o banco estão funcionando
app.get('/api/health', async (_request, response) => {
    try {

        // Executa uma consulta simples no PostgreSQL
        // para verificar se a conexão está funcionando
        await prisma.$queryRaw`SELECT 1`;

        // Retorna sucesso quando o banco responde
        response.status(200).json({
            server: 'Server is running.',
            database: 'connected'
        });

    } catch (error) {

        // Mostra o erro no terminal
        console.error(error);

        // Retorna erro caso o banco não responda
        response.status(500).json({
            server: 'Server is running.',
            database: 'unavailable'
        });
    }
});

// Registra a rota do dashboard
app.use('/api/dashboard', dashboard);

// Registra as rotas dos clientes
app.use('/api/customers', customers);

// Registra as rotas das faturas
app.use('/api/invoices', invoices);

// Disponibiliza os arquivos estáticos do React
app.use(express.static(dist));

// Permite que o React Router controle as páginas
app.use((request, response, next) => {

    // Se for uma rota da API, não encontrada,
// ou uma requisição diferente de GET,
// passa para o próximo middleware
    if (
        request.url.startsWith('/api') ||
        request.method !== 'GET' ||
        !fs.existsSync(path.join(dist, 'index.html'))
    ) {
        next();
        return;
    }

    // Envia o index.html para o React
    response.sendFile(path.join(dist, 'index.html'));
});

// Responde quando nenhuma rota foi encontrada
app.use((_request, response) => {
    response.status(404).json({
        message: 'Recurso não encontrado.'
    });
});

// Middleware responsável por tratar erros da aplicação
app.use(handleError);

// Exporta o Express para server.ts e para os testes
export default app;
