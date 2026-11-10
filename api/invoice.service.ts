
import prisma from './prisma.ts';


import type {
    Invoice as InvoiceRecord,
    Customer as CustomerRecord
} from '@prisma/client';


import type { InvoiceInput } from './invoice.schema.ts';

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

function formatInvoice(record: InvoiceWithCustomer): Invoice {
    const situation: InvoiceSituation = record.status === 'paid'? 'paid':
     record.dueDate < new Date()? 'overdue': 'pending';

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

