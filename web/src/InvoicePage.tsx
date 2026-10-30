
import { useState, useEffect, useRef } from 'react';

import type { Invoice, InvoiceInput } from './invoiceTypes.ts';
import InvoiceTable from './invoiceTable';
import InvoiceForm from './InvoiceForm';

import { getAllInvoices, createInvoice } from './invoiceapi';
import type { CustomerOption } from './customerType.ts';

export default function InvoicePage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [customersOptions, setCustomersOptions] = useState<CustomerOption[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialogContent, setDialogContent] = useState(false);

    const dialogRef = useRef<HTMLDialogElement>(null);

    function openModal() {
        setFormError(null);
        setDialogContent(true);

        dialogRef.current?.showModal();
    }

    function closeModal() {
        dialogRef.current?.close();
    }

    useEffect(() => {
        async function getInvoices() {
            try {
                const datas = await getAllInvoices();
                setInvoices(datas);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        }

        getInvoices();
    }, []);

    useEffect(() => {
        async function getCustomersOptions() {
            try {
                const response = await fetch('/api/customers/options');

                if (!response.ok) {
                    throw new Error('Falha ao buscar opções de clientes.');
                }

                const datas: CustomerOption[] = await response.json();

                setCustomersOptions(datas);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            }
        }

        getCustomersOptions();
    }, []);

    async function refresh() {
        const datas = await getAllInvoices();
        setInvoices(datas);
    }

    async function submit(datas: InvoiceInput) {
        setBusy(true);
        setFormError(null);

        try {
            await createInvoice(datas);
            await refresh();
            closeModal();
        } catch (error) {
            if (error instanceof Error) {
                setFormError(error.message);
            }
        } finally {
            setBusy(false);
        }
    }

    if (loading) return <p>Carregando faturas...</p>;

    if (error) return <p>{error}</p>;

    return (
        <>
            <h1>Faturas</h1>

            <button type="button" onClick={openModal}>
                Nova Fatura
            </button>

            <div className="panel">
                <InvoiceTable invoices={invoices} />
            </div>

           <dialog ref={dialogRef} onClose={closeModal}>
    {dialogContent && (
        <InvoiceForm
            invoice={null}
            customers={customersOptions}
            error={formError}
            onDelete={() => null}
            onCancel={closeModal}
            onSubmit={submit}
            busy={busy}
        />
    )}
</dialog>
        </>
    );
}
