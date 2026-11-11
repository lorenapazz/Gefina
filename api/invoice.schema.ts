import { z, type ZodError } from 'zod';

const invoiceStatusSchema = z.enum([
        'paid',
        'pending'
    ],
    'A situação informada é inválida. Os valores permitidos são "Paga" e "Pendente".'
);

export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>

export const invoiceSchema = z
    .object({
            customerId: z
                .number('O cliente é obrigatório.')
                .int('O identificador do cliente deve ser um número inteiro.')
                .positive('O identificador do cliente deve ser maior que zero.'),
            amount: z
                .number('O valor é obrigatório.')
                .int('O valor da fatura deve ser um número inteiro.')
                .positive('O valor da fatura deve ser maior que zero.'),
            status: invoiceStatusSchema,
            issueDate: z.iso.date('A data de emissão deve ser uma data válida.'),
            dueDate: z.iso.date('A data de vencimento deve ser uma data válida.')
        })
        .refine(
            (datas) => datas.dueDate >= datas.issueDate,
            {
                error: 'A data de vencimento não pode ser anterior a data de emissão.',
                path: ['dueDate']
            }
        );

export type InvoiceInput = z.infer<typeof invoiceSchema>;

interface InvoiceFieldErrors {
    customerId?: string;
    amount?: string;
    status?: string;
    issueDate?: string;
    dueDate?: string;
}

export function toFieldErrors(error: ZodError<InvoiceInput>): InvoiceFieldErrors {
  const { 
    customerId,
    amount,
    status,
    issueDate,
    dueDate
   } = z.flattenError(error).fieldErrors;

  return {
    customerId: customerId?.[0],
    amount: amount?.[0],
    status: status?.[0],
    issueDate: issueDate?.[0],
    dueDate: dueDate?.[0]
  };
}