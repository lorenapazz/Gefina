import type { Invoice } from "./invoiceTypes";

import {
    situationLabel,
    formatCurrency,
    formatDate,
    situationClass,
} from "./utils";

interface InvoiceRowProps {
    invoice: Invoice;
    edit: (invoice: Invoice) => void;
}

export default function InvoiceRow(props: InvoiceRowProps) {
    const invoice = props.invoice
    return <tr>
        <td>{invoice.customer.name}</td>
        <td className='numeric'>{formatCurrency(props.invoice.amount)}</td>
        <td className='numeric numeric-date'>{formatDate(props.invoice.issueDate)}</td>
        <td className='numeric numeric-date'>{formatDate(props.invoice.dueDate)}</td>
        <td className={situationClass(props.invoice.situation)}>{situationLabel(props.invoice.situation)}</td>
        <td className="td-button">
            <button
             className='button-secondary'
             type='button'
             onClick={() => props.edit(props.invoice)}
            >Alterar</button>
        </td>

    </tr>;
}