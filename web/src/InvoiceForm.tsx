
import { useState, type SetStateAction, type SubmitEvent } from 'react';
import type { InvoiceFieldErrors } from '../../api/invoice.schema.ts';
import type { Invoice, InvoiceStatus, InvoiceInput } from './invoiceTypes.ts';
import type { CustomerOption } from './customerType.ts';

interface InvoiceFormProps {
    invoice: Invoice | null;
    customers: CustomerOption[];
    error: string | null;
    fieldErrors: InvoiceFieldErrors;
    onDelete: () => void;
    confirmDelete: boolean;
    setConfirmDelete: React.Dispatch<SetStateAction<boolean>>;
    onCancel: () => void;
    confirm: () => void;
    onSubmit: (values: InvoiceInput) => void;
    busy: boolean;
}

export default function InvoiceForm(props: InvoiceFormProps) {
    const [customerId, setCustomerId] = useState(
        !props.invoice ? '' : props.invoice.customer.id
    );

    const [amount, setAmount] = useState(
        !props.invoice ? '' : (props.invoice.amount / 100).toFixed(2)
    );

    const [status, setStatus] = useState<InvoiceStatus>(
        !props.invoice ? 'pending' : props.invoice.status
    );

    const [issueDate, setIssueDate] = useState(
        !props.invoice ? '' : props.invoice.issueDate
    );

    const [dueDate, setDueDate] = useState(
        !props.invoice ? '' : props.invoice.dueDate
    );

    const handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();

        props.onSubmit({
            customerId: Number(customerId),
            amount: Math.round(Number(amount) * 100),
            status,
            issueDate,
            dueDate
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{!props.invoice ? 'Criar fatura' : 'Editar fatura'}</h2>

            <div className="field">
                <label htmlFor="customer">Cliente</label>

                
<select
    id="customer"
    value={customerId}
    onChange={(event) => setCustomerId(event.target.value)}
    required

                >
                    <option value="">Selecione um cliente</option>

                    {props.customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                            {customer.name} — {customer.email}
                        </option>
                    ))}
                </select>

                {props.fieldErrors.customerId && (
                    <p>{props.fieldErrors.customerId}</p>
                )}
            </div>

            <div className="field">
                <label htmlFor="amount">Valor</label>

                <input
                    id="amount"
                    type="number"
                    value={amount}
                    step="0.01"
                    min="0.01"
                    onChange={(event) => setAmount(event.target.value)}
                    required
                />

                {props.fieldErrors.amount && (
                    <p>{props.fieldErrors.amount}</p>
                )}
            </div>

            <div className="field">
                <label htmlFor="status">Situação</label>

                <select
                    id="status"
                    value={status}
                    onChange={(event) =>
                        setStatus(event.target.value as InvoiceStatus)
                    }
                >
                    <option value="pending">Pendente</option>
                    <option value="paid">Paga</option>
                </select>

                {props.fieldErrors.status && (
                    <p>{props.fieldErrors.status}</p>
                )}
            </div>

            <div className="field">
                <label htmlFor="issueDate">Emissão</label>

                <input
                    id="issueDate"
                    type="date"
                    value={issueDate}
                    onChange={(event) => setIssueDate(event.target.value)}
                    required
                />

                {props.fieldErrors.issueDate && (
                    <p>{props.fieldErrors.issueDate}</p>
                )}
            </div>

            <div className="field">
                <label htmlFor="dueDate">Vencimento</label>

                <input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    min={issueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    required
                />

                {props.fieldErrors.dueDate && (
                    <p>{props.fieldErrors.dueDate}</p>
                )}
            </div>

            {props.error && <p>{props.error}</p>}

            <div>
                {props.invoice && (
                    <button
                        className="button-danger"
                        type="button"
                        disabled={props.busy}
                        onClick={props.onDelete}
                    >
                        {props.busy && props.confirmDelete
                            ? 'Excluindo...'
                            : 'Excluir'}
                    </button>
                )}

                <button
                    className="button-secondary"
                    type="button"
                    disabled={props.busy}
                    onClick={props.onCancel}
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={props.busy}
                >
                    {props.busy && !props.confirmDelete
                        ? 'Salvando...'
                        : 'Salvar'}
                </button>
            </div>

            {props.confirmDelete && (
                <div className="confirm-form">
                    <p>
                        A exclusão é definitiva e não pode ser desfeita.
                        Deseja prosseguir?
                    </p>

                    <button
                        className="button-secondary"
                        type="button"
                        disabled={props.busy}
                        onClick={() => props.setConfirmDelete(false)}
                    >
                        Não
                    </button>

                    <button
                        className="button-danger"
                        type="button"
                        disabled={props.busy}
                        onClick={props.confirm}
                    >
                        Sim
                    </button>
                </div>
            )}
        </form>
    );
}
