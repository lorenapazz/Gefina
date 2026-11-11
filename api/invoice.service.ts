
import prisma from './prisma.ts';

import type {
    Invoice as InvoiceRecord,
    Customer as CustomerRecord
} from '@prisma/client';

import type { InvoiceStatus, InvoiceInput } from './invoice.schema.ts';

export type InvoiceStatus = 'paid' | 'pending';

type InvoiceSituation = 'paid' | 'pending' | 'overdue';

export interface Invoice {
    id: number;
    amount: number;
    status: InvoiceStatus;
    situation: InvoiceSituation;
    issueDate: string;
    dueDate: string;
    customer: {
        id: number;
        name: string;
        email: string;
    };
}

type InvoiceWithCustomer = InvoiceRecord & {
    customer: CustomerRecord;
};

// Formata os dados retornados pelo Prisma
function formatInvoice(record: InvoiceWithCustomer): Invoice {
    const situation: InvoiceSituation =
        record.status === 'paid'
            ? 'paid'
            : record.dueDate < new Date()
                ? 'overdue'
                : 'pending';

    return {
        id: record.id,
        amount: record.amount,
        status: record.status as InvoiceStatus,
        situation,
        issueDate: record.issueDate.toISOString().slice(0, 10),
        dueDate: record.dueDate.toISOString().slice(0, 10),
        customer: {
            id: record.customer.id,
            name: record.customer.name,
            email: record.customer.email
        }
    };
}

// Lista todas as faturas
export async function findAllInvoices(): Promise<Invoice[]> {
    const records = await prisma.invoice.findMany({
        include: {
            customer: true
        },
        orderBy: {
            id: 'desc'
        }
    });

    return records.map(formatInvoice);
}

// Busca uma fatura pelo ID
export async function findInvoiceById(
    id: number
): Promise<Invoice | undefined> {
    const record = await prisma.invoice.findUnique({
        where: {
            id: id
        },
        include: {
            customer: true
        }
    });

    if (!record) return undefined;

    return formatInvoice(record);
}

// Lista as 5 faturas mais recentes
export async function findRecentInvoices(): Promise<Invoice[]> {
    const records = await prisma.invoice.findMany({
        include: {
            customer: true
        },
        orderBy: {
            id: 'desc'
        },
        take: 5
    });

    return records.map(formatInvoice);
}

// Lista as 5 faturas vencidas
export async function findOverdueInvoices(): Promise<Invoice[]> {
    const records = await prisma.invoice.findMany({
        where: {
            status: 'pending',
            dueDate: {
                lt: new Date()
            }
        },
        include: {
            customer: true
        },
        orderBy: {
            dueDate: 'asc'
        },
        take: 5
    });

    return records.map(formatInvoice);
}

// Cadastra uma nova fatura
export async function insertInvoice(
    data: InvoiceInput
): Promise<Invoice> {
    const record = await prisma.invoice.create({
        data: {
            customerId: data.customerId,
            amount: data.amount,
            status: data.status,
            issueDate: new Date(data.issueDate),
            dueDate: new Date(data.dueDate)
        },
        include: {
            customer: true
        }
    });

    return formatInvoice(record);
}

// Atualiza uma fatura existente
export async function modifyInvoice(
    id: number,
    data: InvoiceInput
): Promise<Invoice | undefined> {
    const existing = await findInvoiceById(id);

    if (!existing) return undefined;

    const record = await prisma.invoice.update({
        where: { id: id },
        data: {
            customerId: data.customerId,
            amount: data.amount,
            status: data.status,
            issueDate: new Date(data.issueDate),
            dueDate: new Date(data.dueDate)
        }, include: {
            customer: true
        }
    });

    return formatInvoice(record);
}

// Exclui uma fatura
export async function removeInvoice(id: number): Promise<InvoiceRecord | undefined> {
    const existing = await prisma.invoice.findUnique({
        where: {id: id
        }
    });

    if (!existing) return;

const record = await prisma.invoice.delete({
    where: { id: id }
});

return record;
}
