import type { PrismaClient, Medicamento } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma"

export class MedicamentoRepository {

    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async listarTdsMedicamentos(pagina?: number, limite?: number) {
        const existePaginacao = pagina! && limite!
        if (!existePaginacao) {
            return await prisma.medicamento.findMany()
        }

        const medicamentos = await prisma.medicamento.findMany({
            skip: (pagina - 1) * limite,
            take: limite
        })

        const total = await prisma.medicamento.count()
        const ttlPgs = Math.ceil(total / limite)

        return { medicamentos, total, ttlPgs }
    }

    async buscarMedicamentoId(idMedicamento: number) {
        return await prisma.medicamento.findUnique({
            where: {
                id: idMedicamento
            }
        })
    }

    async criarMedicamento(ddsMedicamento: Partial<Medicamento>) {
        return await this.prisma.medicamento.create({
            data: {
                nome: ddsMedicamento.nome || "",
                marca: ddsMedicamento.marca || "",
                fabricante: ddsMedicamento.fabricante || "",
                data_vencimento: new Date(ddsMedicamento.data_vencimento!)
            }
        })
    }

    async atualizarMedicamento(
        idMedicamento: number,
        atualizarDados: Omit<Medicamento, 'id'>
    ) {
        return await prisma.medicamento.update({
            where: {
                id: idMedicamento
            },
            data: {
                ...atualizarDados,
                data_vencimento: new Date(atualizarDados.data_vencimento)
            }
        })
    }

    async deletarMedicamento(idMedicamento: number) {
        return await prisma.medicamento.delete({
            where: {
                id: idMedicamento
            }
        })
    }
}

export const medicamentoRepository = new MedicamentoRepository(prisma)
