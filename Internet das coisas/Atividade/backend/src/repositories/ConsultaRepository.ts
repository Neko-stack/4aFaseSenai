import type { Consulta, PrismaClient } from "../prisma/generated/prisma";
import { prisma } from "../prisma/prisma";

export class ConsultaRepository {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async listarTodasConsultas(pagina?: number, limite?: number) {
        const existePaginacao = pagina && limite;

        if (!existePaginacao) {
            return await this.prisma.consulta.findMany();
        }

        const consultas = await this.prisma.consulta.findMany({
            skip: (pagina - 1) * limite,
            take: limite
        });

        const total = await this.prisma.consulta.count();
        const totalPaginas = Math.ceil(total / limite);

        return {
            consultas,
            total,
            totalPaginas
        };
    }

    async buscarConsultaId(idConsulta: number) {
        return await this.prisma.consulta.findUnique({
            where: {
                id: idConsulta
            }
        });
    }

    async criarConsulta(dadosConsulta: Partial<Consulta>) {
        return await this.prisma.consulta.create({
            data: {
                motivo: dadosConsulta.motivo || "",
                data_consulta: new Date(dadosConsulta.data_consulta || ""),
                observacoes: dadosConsulta.observacoes || "",
                medico_responsavel_id: dadosConsulta.medico_responsavel_id || 0,
                paciente_id: dadosConsulta.paciente_id || 0
            }
        });
    }

    async atualizarConsulta(
        idConsulta: number,
        dadosConsulta: Omit<Consulta, "id">
    ) {
        return await this.prisma.consulta.update({
            where: {
                id: idConsulta
            },
            data: {
                ...dadosConsulta,
                data_consulta: new Date(dadosConsulta.data_consulta)
            }
        });
    }

    async deletarConsulta(idConsulta: number) {
        return await this.prisma.consulta.delete({
            where: {
                id: idConsulta
            }
        });
    }
}

export const consultaRepository = new ConsultaRepository(prisma);