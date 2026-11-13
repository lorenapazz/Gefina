import { describe, it, expect, vi } from "vitest";
import {render, screen} from "@testing-library/react";
import InvoiceForm from "./InvoiceForm";
import user from "@testing-library/user-event";
import { selectOptions } from "@testing-library/user-event/dist/cjs/utility/selectOptions.js";


describe('InvoiceForm', () => {

    it('Apresenta os campos com rótulo associado', () => {
        render(
            <InvoiceForm
                invoice={null}
                customers={[
                    {
                        id: 1,
                        name: 'Cliente Teste',
                        email: 'teste@gefina.com'
                    }
                ]}
                error={null}
                fieldErrors={{}}
                onDelete={() => {}}
                confirmDelete={false}
                setConfirmDelete={() => {}}
                confirm={() => {}}
                onCancel={() => {}}
                onSubmit={() => {}}
                busy={false}
            /> );
        expect(screen.getByLabelText('Cliente')).toBeDefined();
        expect(screen.getByLabelText('Valor')).toBeDefined();
        expect(screen.getByLabelText('Situação')).toBeDefined();
        expect(screen.getByLabelText('Emissão')).toBeDefined();
        expect(screen.getByLabelText('Vencimento')).toBeDefined();
    });

it('Entrega os valores convertidos no envio',
    async () => {
       const onSubmit = vi.fn();
        render(
            <InvoiceForm
                invoice={null}
                customers={[
                    {
                        id: 1,
                        name: 'Cliente Teste',
                        email: 'teste@gefina.com'
                    }
                ]}
                error={null}
                fieldErrors={{}}
                onDelete={() => {}}
                confirmDelete={false}
                setConfirmDelete={() => {}}
                confirm={() => {}}
                onCancel={() => {}}
                onSubmit={onSubmit}
                busy={false}
            /> );

await user.selectOptions(screen.getByLabelText("Cliente"), "1" );
await user.type(screen.getByLabelText("Valor"), "1250.37");
await user.selectOptions(screen.getByLabelText("Situação"), "pending" );
await user.type(screen.getByLabelText("Emissão"), "2026-11-01" );
await user.type(screen.getByLabelText("Vencimento"), "2026-11-30" );
await user.click(screen.getByRole("button", {name: "Salvar"}));
expect(onSubmit).toHaveBeenLastCalledWith({
    customerId: 1,
    amount: 125037,
    status: 'peding',
    issueDate: '2026-11-01',
    dueDate: '2026-11-30'
});

    
    });


});