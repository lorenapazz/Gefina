
import InvoiceRow from './InvoiceRow';
import type { Invoice } from './invoiceTypes';

interface InvoiceTableProps {
    invoices: Invoice[];
    edit: (invoice: Invoice | null) => void;
}

export default function InvoiceTable(props: InvoiceTableProps) {
    return <table>
        <thead>
            <tr>
                <th>Cliente</th>
                <th>Valor</th>
                <th className='numeric-date'>Data de Emissão</th>
                <th className='numeric-date'>Data de Vencimento</th>
                <th>Situação</th>
                <th>Ações</th>
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
    </table>;
}
