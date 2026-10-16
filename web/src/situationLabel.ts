import type { InvoiceSituation } from "./invoiceTypes";

export default function situationLabel (situation: InvoiceStatus) {
    switch (situation) {
        case "paid" : return "paga";
        case "peding" : return "pendente";
        case "overdue" : return "Atrasada" ;
    }
}