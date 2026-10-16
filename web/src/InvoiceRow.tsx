import type { Invoice } from "./invoiceTypes";
import situationLabel from "./situationLabel";

interface InvoiceRowProps {
  invoice: Invoice;
}

function statusLabel(status: Invoice["status"]) {
  return status === "paid" ? "Pago" : "Pendente";
}

export default function InvoiceRow(props: InvoiceRowProps) {
  return (
    <tr>
      <td>{props.invoice.customer.name}</td>
      <td>{props.invoice.amount}</td>
      <td>{props.invoice.issueDate}</td>
      <td>{props.invoice.dueDate}</td>
      <td>{situationLabel(props.invoice.situation)}</td>
    </tr>
  );
}