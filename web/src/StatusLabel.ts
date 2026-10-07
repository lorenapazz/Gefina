import type { InvoiceStatus } from "./invoiceTypes";

export default function statusLabel (status: InvoiceStatus) {
    return status ==="paid" ? "pago" : "pendente"
}