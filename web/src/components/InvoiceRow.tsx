import type { Invoice } from '../types/invoiceTypes';

import {
  formatCurrency,
  formatDate,
  situationClass,
  situationLabel,
} from '../utils';

interface InvoiceRowProps {
  invoice: Invoice;
  edit: (invoice: Invoice) => void;
}

export default function InvoiceRow(props: InvoiceRowProps) {
  const base = 'p-3 border-b border-border';

  return (
    <tr>
      <td className={base}>{props.invoice.customer.name}</td>
      <td className={`${base} tabular-nums`}>
        {formatCurrency(props.invoice.amount)}
      </td>
      <td className={`${base} text-center tabular-nums`}>
        {formatDate(props.invoice.issueDate)}
      </td>
      <td className={`${base} text-center tabular-nums`}>
        {formatDate(props.invoice.dueDate)}
      </td>
      <td
        className={`${base} text-center ${situationClass(props.invoice.situation)}`}
      >
        {situationLabel(props.invoice.situation)}
      </td>
      <td className={`${base} text-center px-0`}>
        <button
          className="px-4 py-2 border border-border rounded-control cursor-pointer hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-primary"
          type="button"
          onClick={() => props.edit(props.invoice)}
        >
          Alterar
        </button>
      </td>
    </tr>
  );
}
