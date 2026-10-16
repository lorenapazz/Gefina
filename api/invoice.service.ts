import pool from "./database.ts"

type InvoiceStatus = "paid" | "pending";
type InvoiceSituation = 'paid' | "peding" | "overdue"

interface Customer {
    id: number;
    name: string;
    email: string;
}

interface Invoice {
    id: number;
    amount: number;
    status: InvoiceStatus;
    situation: InvoiceSituation;
    issueDate: string;
    dueDate: string;
    customer: Customer;
}

interface InvoiceRow {
    id: number;
    amount: number;
    status: InvoiceStatus;
    situation: InvoiceSituation;
    issue_date: string;
    customer_id: number;
    customer_name: string;
    costumer_email: string;
}

const baseQuery=`
SELECT
    invoices.id,
    invoices.amount,
    invoices.status,
    CASE
        WHEN invoices.status = 'paid' THEN 'paid'
        WHEN invoices.due_date < CURRENT_DATE THEN 'overdue'
        ELSE 'pending'
    END AS situation,
    invoices.issue_date,
    invoices.due_date,
    customers.id AS customer_id,
    customers.name AS customer_name,
    customers.email AS customer_email
FROM invoices
JOIN customers
    ON customers.id = invoices.customer_id
  `;
function toInvoice(row: InvoiceRow): Invoice{
return {
    id: row.id,
    amount: row.amount,
    status: row. status,
    situation: row.situation,
    issueDate: row.issue_date,
    dueDate: row.issue_date,
    customer: {
        id: row.customer_id,
        name: row.customer_name,
        email: row.costumer_email
    }
}
}


export async function findAllInvoices(): Promise<Invoice[]> {
    const connect = await pool.query<InvoiceRow>(
        `${baseQuery} ORDER BY invoices.issue_date DESC`
    );

    const invoices: Invoice[] = [];

    connect.rows.forEach((invoice) => {invoices.push(toInvoice(invoice));
    });

    return invoices;
}



export async function findInvoiceById(id: number): Promise<Invoice | undefined> {
    const result = await pool.query<InvoiceRow>(
        `${baseQuery} WHERE invoices.id = $1`,
        [id]
    );

    if (!result.rows[0]) return undefined;

    return toInvoice(result.rows[0]);
}
