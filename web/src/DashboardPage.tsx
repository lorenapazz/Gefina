
import { useState, useEffect } from 'react';

import type { Dashboard } from './dashboardTypes';

import SummaryCard from './SummaryCard';
import InvoiceSummaryTable from './InvoiceSummaryTable';
import { formatCurrency } from './utils';

export default function DashboardPage() {
    const [dashboard, setDashboard] = useState<Dashboard | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getDashboard() {
            try {
                const response = await fetch('/api/dashboard');

                if (!response.ok) {
                    setError('Não foi possível carregar o painel.');
                    return;
                }

                const datas = await response.json();
                setDashboard(datas);

            } catch {
                setError('Não foi possível carregar o painel.');
            } finally {
                setLoading(false);
            }
        }

        getDashboard();
    }, []);

    if (loading) return <p>Carregando Painel...</p>;

    if (error) return <p>{error}</p>;

    if (!dashboard) return <p>Painel indisponível.</p>;

    return (
        <>
            <h1>PAINEL INICIAL</h1>

            <div>
                <SummaryCard label="Total recebido:" value={formatCurrency(dashboard.totals.paid)}
                />

                <SummaryCard label="Total Pendente:"value={formatCurrency(dashboard.totals.pending)}
                />

                <SummaryCard label="Faturas:" value={String(dashboard.totals.invoiceCount)}
                />

                <SummaryCard label="Clientes:"value={String(dashboard.totals.customerCount)}
                />
            </div>

<InvoiceSummaryTable
    title="Faturas Recentes"
    dateLabel="Emissão"
    invoices={dashboard.recentInvoices}
    date={(invoice) => invoice.issueDate}
/>

<InvoiceSummaryTable
    title="Faturas Atrasadas"
    dateLabel="Vencimento"
    invoices={dashboard.overdueInvoices}
    date={(invoice) => invoice.dueDate}
/>
</>
);
}

