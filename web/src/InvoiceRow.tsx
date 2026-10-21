import type { Invoice } from "./invoiceTypes";

import {
    situationLabel,
    formatCurrency,
    formatDate,
    situationClass,
} from "./utils";

interface InvoiceRowProps {
    invoice: Invoice;
}

export default function InvoiceRow(props: InvoiceRowProps) {
    return (
        <tr>
            <td>{props.invoice.customer.name}</td>

            <td className="numeric">
                {formatCurrency(props.invoice.amount)}
            </td>

            <td className="numeric">
                {formatDate(props.invoice.issueDate)}
            </td>

            <td className="numeric">
                {formatDate(props.invoice.dueDate)}
            </td>

            <td className={situationClass(props.invoice.situation)}>
                {situationLabel(props.invoice.situation)}
            </td>
        </tr>
    );
}