import type { InvoiceSituation } from "./invoiceTypes";

export default function situationLabel (situation: InvoiceStatus) {
    switch (situation) {
        case "paid" : return "paga";
        case "peding" : return "pendente";
        case "overdue" : return "Atrasada" ;
    }
}

export function formatCurrency (cents: number): string {
    const formatter = new Intl.NumberFormat("pt-BR" {
        style:"currency", 
        currency: "BRL"
    });
return formatter.format (cents /100);
}
export function formatDate(issueDate: string): string {
    const formatter = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    return formatter.format(new Date(`${issueDate}T00:00:00`));
}