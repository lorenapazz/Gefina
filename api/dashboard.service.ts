
import prisma from './prisma.ts';

import {
    type Invoice,
    type InvoiceStatus,
    findRecentInvoices,
    findOverdueInvoices
} from './invoice.service.ts';

// Soma os valores das faturas de acordo com o status
async function sumAmountByStatus(
    status: InvoiceStatus
): Promise<number> {

    // Utiliza o Prisma para somar os valores
    const result = await prisma.invoice.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: status
        }
    });

    // Retorna a soma ou 0 caso não existam faturas
    return result._sum.amount ?? 0;
}

// Define os recursos que podem ser contados
type Resource = 'invoices' | 'customers';

// Conta a quantidade de registros
async function count(resource: Resource): Promise<number> {

    // Conta as faturas
    if (resource === 'invoices') {
        return prisma.invoice.count();
    }

    // Conta os clientes
    return prisma.customer.count();
}

// Define os totais exibidos no dashboard
interface DashboardTotals {
    paid: number;
    pending: number;
    invoiceCount: number;
    customerCount: number;
}

// Define a estrutura completa do dashboard
interface Dashboard {
    totals: DashboardTotals;
    recentInvoices: Invoice[];
    overdueInvoices: Invoice[];
}

// Busca os dados necessários para o dashboard
export default async function findDashboard(): Promise<Dashboard> {

    // Soma os valores das faturas pagas
    const paid = await sumAmountByStatus('paid');

    // Soma os valores das faturas pendentes
    const pending = await sumAmountByStatus('pending');

    // Conta as faturas cadastradas
    const invoiceCount = await count('invoices');

    // Conta os clientes cadastrados
    const customerCount = await count('customers');

    // Busca as faturas mais recentes
    const recentInvoices = await findRecentInvoices();

    // Busca as faturas vencidas
    const overdueInvoices = await findOverdueInvoices();

    // Retorna todos os dados para o dashboard
    return {
        totals: {
            paid,
            pending,
            invoiceCount,
            customerCount
        },
        recentInvoices,
        overdueInvoices
    };
}
