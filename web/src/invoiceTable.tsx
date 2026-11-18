import InvoiceRow from './InvoiceRow';
import type { Invoice } from './invoiceTypes';

interface InvoiceTableProps {
    invoices: Invoice[];
    edit: (invoice: Invoice | null) => void;
}

export default function InvoiceTable(props: InvoiceTableProps) {
    const base = "text-sm font-medium p-3 border-b border-border text-text-muted";

    return (
        <table>
            <thead>
                <tr>
                    <th className={`${base} text-left`}>Cliente</th>
                    <th className={`${base} text-right`}>Valor</th>
                    <th className={base}>Data de Emissão</th>
                    <th className={base}>Data de Vencimento</th>
                    <th className={base}>Situação</th>
                    <th className={base}>Ações</th>
                </tr>
            </thead>

            <tbody>
                {props.invoices.map(invoice => (
                    <InvoiceRow
                        key={invoice.id}
                        invoice={invoice}
                        edit={props.edit}
                    />
                ))}
            </tbody>
        </table>
    );
}
    
