
import { useState, useEffect, useRef } from 'react';

// Importa os tipos das faturas
import type {
    Invoice,
    InvoiceInput,
    InvoiceFieldErrors
} from './invoiceTypes.ts';

// Importa os componentes
import InvoiceTable from './invoiceTable';
import InvoiceForm from './InvoiceForm';

// Importa as funções da API
import {
    getAllInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice
} from './invoiceApi.js';

import type { CustomerOption } from './customerType.ts';

export default function InvoicePage() {

    // Lista de faturas
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    // Lista de clientes para selecionar no formulário
    const [customersOptions, setCustomersOptions] =
        useState<CustomerOption[]>([]);

    // Erros gerais da página
    const [error, setError] = useState<string | null>(null);

    // Erros de validação dos campos
    const [fieldErrors, setFieldErrors] =
        useState<InvoiceFieldErrors>({});

    // Controla operações em andamento
    const [busy, setBusy] = useState(false);

    // Erros apresentados dentro do formulário
    const [formError, setFormError] =
        useState<string | null>(null);

    // Controla o carregamento inicial
    const [loading, setLoading] = useState(true);

    // Controla o conteúdo do modal
    const [dialogContent, setDialogContent] = useState(false);

    // Fatura selecionada para edição
    const [target, setTarget] = useState<Invoice | null>(null);

    // Controla a confirmação de exclusão
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Referência ao elemento dialog
    const dialogRef = useRef<HTMLDialogElement>(null);

    // Abre o formulário para criar ou editar uma fatura
    function openModal(invoice: Invoice | null) {
        setTarget(invoice);
        setFormError(null);
        setFieldErrors({});
        setConfirmDelete(false);
        setDialogContent(true);

        dialogRef.current?.showModal();
    }

    // Fecha o formulário
    function closeModal() {
        setFormError(null);
        dialogRef.current?.close();
    }

    // Busca as faturas quando a página é carregada
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

    // Busca as opções de clientes
    useEffect(() => {
        async function getCustomersOptions() {
            try {
                const response = await fetch('/api/customers/options');

                if (!response.ok) {
                    throw new Error('Falha ao buscar opções de clientes.');
                }

                const datas: CustomerOption[] =
                    await response.json();

                setCustomersOptions(datas);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            }
        }

        getCustomersOptions();
    }, []);

    // Atualiza a lista de faturas
    async function refresh() {
        const datas = await getAllInvoices();
        setInvoices(datas);
    }

    // Cria ou atualiza uma fatura
    async function submit(datas: InvoiceInput) {
        setBusy(true);
        setFormError(null);
        setFieldErrors({});

        try {
            if (!target) {
                // Cria uma nova fatura
                await createInvoice(datas);
            } else {
                // Atualiza uma fatura existente
                await updateInvoice(target.id, datas);
            }

            // Atualiza a lista de faturas
            await refresh();

            // Fecha o formulário
            closeModal();

        } catch (error) {
            if (error instanceof Error) {
                setFormError(error.message);
            }
        } finally {
            setBusy(false);
        }
    }

    // Confirma a exclusão de uma fatura
    async function confirm() {
        if (!target) return;

        setBusy(true);
        setFormError(null);

        try {
            // Exclui a fatura selecionada
            await deleteInvoice(target.id);

            setConfirmDelete(false);
            closeModal();

            // Atualiza a lista após excluir
            await refresh();

        } catch (error) {
            if (error instanceof Error) {
                setFormError(error.message);
            }
        } finally {
            setBusy(false);
        }
    }

    // Exibe mensagem durante o carregamento
    if (loading) {
        return (
            <p className="p-4 text-sm text-gray-500">
                Carregando faturas...
            </p>
        );
    }

    // Exibe erro caso a busca falhe
    if (error) {
        return (
            <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {error}
            </p>
        );
    }

    return (
        <>
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">
                    Faturas
                </h1>

                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
                    type="button"
                    onClick={() => openModal(null)}
                >
                    Nova fatura
                </button>
            </header>

            <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
                <InvoiceTable
                    invoices={invoices}
                    edit={openModal}
                />
            </div>

            <dialog
                className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl backdrop:bg-black/50"
                ref={dialogRef}
                onClose={() => {
                    setDialogContent(false);
                    setConfirmDelete(false);
                    setFieldErrors({});
                }}
            >
                {dialogContent && (
                    <InvoiceForm
                        invoice={target}
                        customers={customersOptions}
                        error={formError}
                        fieldErrors={fieldErrors}
                        confirmDelete={confirmDelete}
                        setConfirmDelete={setConfirmDelete}
                        confirm={confirm}
                        onDelete={() => setConfirmDelete(true)}
                        onCancel={closeModal}
                        onSubmit={submit}
                        busy={busy}
                    />
                )}
            </dialog>
        </>
    );
}
