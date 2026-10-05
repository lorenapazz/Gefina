import type { Invoice } from "./invoiceTypes";

interface InvoiceRowProps {
    invoice: Invoice;

}

export default function InvoiceRow(props) {
    return <tr>
        <td>{props.invoice.customer.name7} </td>
        <td>{props.invoice.amount} </td>
        <td>{props.invoice.issueDate} </td>
        <td>{props.invoice.dueDate} </td>
        <td> {StatusLabel(props.invoice.status)} </td>
    </tr>;
}