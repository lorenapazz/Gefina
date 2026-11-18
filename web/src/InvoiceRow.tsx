import type { Invoice } from "./invoiceTypes";

import { situationLabel, formatCurrency, formatDate, situationClass,} from "./utils";

interface InvoiceRowProps {
    invoice: Invoice;
    edit: (invoice: Invoice) => void;
}

export default function InvoiceRow(props: InvoiceRowProps) {

    const base = "p-3 border-b border-border";
    const invoice = props.invoice;

    return (
        <tr>
            <td className={`${base} text-left`}>
                {invoice.customer.name}
            </td>

            <td className={`${base} text-center tabular-nums`}>
                {formatCurrency(invoice.amount)}
            </td>

            <td className={`${base} text-center tabular-nums`}>
                {formatDate(invoice.issueDate)}
            </td>

            <td className={`${base} text-center tabular-nums`}>
                {formatDate(invoice.dueDate)}
            </td>

            <td className={base}>
                <span className={situationClass(invoice.situation)}>
                    {situationLabel(invoice.situation)}
                </span>
            </td>

            <td className={base}>
                <button
                    className="px-3 py-2 text-sm font-medium rounded-md border border-border hover:bg-gray-100"
                    type="button"
                    onClick={() => props.edit(invoice)}
                >
                    Alterar
                </button>
            </td>
        </tr>
    );
}