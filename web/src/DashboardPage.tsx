
import { useState, useEffect } from 'react';

import type { Dashboard } from './dashboardTypes';

import SummaryCard from './SummaryCard';
import InvoiceSummaryTable from './InvoiceSummaryTable';
import { formatCurrency } from './utils';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<null | Dashboard>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDashboard() {
      try {
        const response = await fetch('/api/dashboard');

        if (!response.ok) {
          setError('Não foi possível carregar faturas.');
          setLoading(false);
          return;
        }

        const datas = await response.json();
        setDashboard(datas);
      } catch {
        setError('Não foi possível carregar faturas.');
      }

      setLoading(false);
    }

    getDashboard();
  }, []);

  if (loading) return <p>Carregando painel inicial...</p>;

  if (error || dashboard === null) return <p>{error}</p>;

  return (
    <>
      <h1>Painel Inicial</h1>

      <div className='flex gap-4'>
        <SummaryCard
          label="Total recebido:"
          value={formatCurrency(dashboard.totals.paid)}
        />
        <SummaryCard
          label="Total pendente:"
          value={formatCurrency(dashboard.totals.pending)}
        />
        <SummaryCard
          label="Faturas:"
          value={String(dashboard.totals.invoiceCount)}
        />
        <SummaryCard
          label="Clientes"
          value={String(dashboard.totals.customerCount)}
        />
      </div>

      <div className='flex gap-6 mt-8'>
        <InvoiceSummaryTable
          title="Faturas recentes"
          dateLabel="Emissão"
          invoices={dashboard.recentInvoices}
          date={(invoice) => invoice.issueDate}
        />

        <InvoiceSummaryTable
          title="Faturas atrasadas"
          dateLabel="Vencimento"
          invoices={dashboard.overdueInvoices}
          date={(invoice) => invoice.dueDate}
        />
      </div>
    </>
  );
}