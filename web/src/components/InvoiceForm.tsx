import {
  type SetStateAction,
  type SubmitEvent,
  useState,
} from 'react';
import type { InvoiceFieldErrors } from '../../../api/src/schemas/invoice.schema.js';
import type { CustomerOption } from '../types/customerType.js';
import type {
  Invoice,
  InvoiceInput,
  InvoiceStatus,
} from '../types/invoiceTypes.js';

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
    !props.invoice ? '' : props.invoice.customer.id,
  );

  const [amount, setAmount] = useState(
    !props.invoice ? '' : (props.invoice.amount / 100).toFixed(2),
  );

  const [status, setStatus] = useState<InvoiceStatus>(
    !props.invoice ? 'pending' : props.invoice.status,
  );

  const [issueDate, setIssueDate] = useState(
    !props.invoice ? '' : props.invoice.issueDate,
  );

  const [dueDate, setDueDate] = useState(
    !props.invoice ? '' : props.invoice.dueDate,
  );

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();

    props.onSubmit({
      customerId: Number(customerId),
      amount: Math.round(Number(amount) * 100),
      status,
      issueDate,
      dueDate,
    });
  };

  // Classes reutilizáveis do Tailwind
  const field = 'flex flex-col gap-1';
  const label = 'text-sm text-text-muted';
  const input =
    'w-full px-3 py-2 border border-border rounded-control bg-surface-raised text-text focus-visible:outline-2 focus-visible:outline-primary';
  const buttonSecondary =
    'px-4 py-2 border border-border rounded-control text-text hover:bg-surface-raised disabled:opacity-50';
  const buttonDanger =
    'px-4 py-2 border border-overdue rounded-control text-overdue hover:bg-surface-raised disabled:opacity-50';
  const buttonPrimary =
    'px-4 py-2 bg-primary text-white rounded-control font-medium hover:opacity-90 disabled:opacity-50';

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-2">
        {!props.invoice ? 'Criar fatura' : 'Editar fatura'}
      </h2>

      {/* Cliente */}
      <div className={field}>
        <label className={label} htmlFor="customer">
          Cliente
        </label>

        <select
          id="customer"
          className={input}
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
          <p className="text-sm text-overdue">
            {props.fieldErrors.customerId}
          </p>
        )}
      </div>

      {/* Valor */}
      <div className={field}>
        <label className={label} htmlFor="amount">
          Valor
        </label>

        <input
          className={input}
          id="amount"
          type="number"
          value={amount}
          step="0.01"
          min="0.01"
          onChange={(event) => setAmount(event.target.value)}
          required
        />

        {props.fieldErrors.amount && (
          <p className="text-sm text-overdue">
            {props.fieldErrors.amount}
          </p>
        )}
      </div>

      {/* Situação */}
      <div className={field}>
        <label className={label} htmlFor="status">
          Situação
        </label>

        <select
          className={`${input} appearance-nome`}
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
          <p className="text-sm text-overdue">
            {props.fieldErrors.status}
          </p>
        )}
      </div>

      {/* Datas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 scheme-dark">
        <div className={field}>
          <label className={label} htmlFor="issueDate">
            Emissão
          </label>

          <input
            className={input}
            id="issueDate"
            type="date"
            value={issueDate}
            onChange={(event) => setIssueDate(event.target.value)}
            required
          />

          {props.fieldErrors.issueDate && (
            <p className="text-sm text-overdue">
              {props.fieldErrors.issueDate}
            </p>
          )}
        </div>

        <div className={field}>
          <label className={label} htmlFor="dueDate">
            Vencimento
          </label>

          <input
            className={input}
            id="dueDate"
            type="date"
            value={dueDate}
            min={issueDate}
            onChange={(event) => setDueDate(event.target.value)}
            required
          />

          {props.fieldErrors.dueDate && (
            <p className="text-sm text-overdue">
              {props.fieldErrors.dueDate}
            </p>
          )}
        </div>
      </div>

      {/* Erro geral */}
      {props.error && (
        <p className="text-sm text-overdue">{props.error}</p>
      )}

      {/* Botões */}
      <div className="flex justify-end items-center gap-2 mt-4">
        {props.invoice && (
          <button
            className={`${buttonDanger} mr-auto`}
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
          className={buttonSecondary}
          type="button"
          disabled={props.busy}
          onClick={props.onCancel}
        >
          Cancelar
        </button>

        <button
          className={buttonPrimary}
          type="submit"
          disabled={props.busy}
        >
          {props.busy && !props.confirmDelete
            ? 'Salvando...'
            : 'Salvar'}
        </button>
      </div>

      {/* Confirmação de exclusão */}
      {props.confirmDelete && (
        <div className="flex flex-col gap-3 mt-4 p-4 border border-border rounded-control bg-surface-raised">
          <p className="text-sm text-text">
            A exclusão é definitiva e não pode ser desfeita. Deseja
            prosseguir?
          </p>

          <div className="flex justify-end gap-2">
            <button
              className={buttonSecondary}
              type="button"
              disabled={props.busy}
              onClick={() => props.setConfirmDelete(false)}
            >
              Não
            </button>

            <button
              className={buttonDanger}
              type="button"
              disabled={props.busy}
              onClick={props.confirm}
            >
              Sim
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
