import {z, type ZodError} from "zod";

const invoiceStatusSchema = z.enum(
    [
        'paid',
        'pending'
    ],
    'A situação informada é inválida. Os valores permitidos são "Paga" e "Pendente".'
);

export const invoiceSchema = z
    .object(
        {
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
            (datas)=> datas.dueDate >= datas.issueDate,
        
        )
        {
            error: "A data de vencimento não pode ser anterior a data de emisão."
            path: ['dueDate']
        }

type InvoiceInput = z.infer<typeof invoiceSchema>;
interface InvoiceFieldErros {
    customerId?: string;
    amount?: string;
    status?: string;
    issueDate?: string;
    dueDate?: string;
}


export function toFieldErrors(error: ZodError<InvoiceInput>): InvoiceFieldErrors {
    const { fieldErrors } = z.flattenError(error);

    return {
        customerId: fieldErrors.customerId,
        amount: fieldErrors.amount,
        status: fieldErrors.status,
        issueDate: fieldErrors.issueDate,
        dueDate: fieldErrors.dueDate
    };
}

    