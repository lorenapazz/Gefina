
import prisma from './prisma.ts';

// Define quais informações do cliente serão retornadas
interface CustomerOption {
    id: number;
    name: string;
    email: string;
}

// Busca os clientes cadastrados no banco de dados
export async function findCustomersOptions(): Promise<CustomerOption[]> {

    // Consulta os clientes utilizando o Prisma
    const records = await prisma.customer.findMany({
        select: {
            id: true,
            name: true,
            email: true
        }
    });

    // Retorna a lista de clientes encontrados
    return records;
}
