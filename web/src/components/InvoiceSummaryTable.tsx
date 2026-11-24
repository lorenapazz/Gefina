import type { Invoice } from '../types/invoiceTypes';
import { formatCurrency, formatDate } from '../utils';

interface InvoiceSummaryTableProps {
  title: string;
  dateLabel: string;
  invoices: Invoice[];
  date: (invoice: Invoice) => string;
}

export default function InvoiceSummaryTable(
  props: InvoiceSummaryTableProps,
) {
  const header =
    'text-sm font-medium p-3 border-b border-border text-text-muted';

  const cell = 'p-3 border-b border-border';

  return (
    <div className="flex-1 min-w-0 bg-surface border border-border rounded-surface p-4">
      <h2 className="text-xl font-semibold mb-2">
        {props.title}
      </h2>

      <table className="w-full">
        <thead>
          <tr>
            <th className={`${header} text-left`}>
              Cliente
            </th>

            <th className={`${header} text-right`}>
              Valor
            </th>

            <th className={`${header} text-right`}>
              {props.dateLabel}
            </th>
          </tr>
        </thead>

        <tbody>
          {props.invoices.map((invoice) => {
            return (
              <tr key={invoice.id}>
                <td className={`${cell} text-left`}>
                  {invoice.customer.name}
                </td>

                <td className={`${cell} text-right tabular-nums whitespace-nowrap`}>
                  {formatCurrency(invoice.amount)}
                </td>

                <td className={`${cell} text-right tabular-nums whitespace-nowrap`}>
                  {formatDate(props.date(invoice))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}