import { PrismaClient, type Consulta } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";

export class ConsultRepository {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async buscarTodos(pagina?: number, limite?: number) {

        const existePaginacao = pagina! && limite!

        if (!existePaginacao) return { consulta: await this.prisma.consulta.findMany() }

        const consulta = await this.prisma.consulta.findMany({
            skip: (pagina - 1) * limite,
            take: limite
        })


        const total = await this.prisma.consulta.count()

        const totalPaginas = Math.ceil(total / limite)


        return {
            consulta,
            total,
            totalPaginas,

        }
    }
    async buscarPorId(id: number) {

        return await this.prisma.consulta.findUnique({
            where: {
                id: id
            }
        });
    }



    async atualizar(dadosConsulta: Consulta) {
        return await this.prisma.consulta.update({
            data: {
                ...dadosConsulta
            },
            where: {
                id: dadosConsulta.id
            }
        })

    }

    async deletar(id: number) {

        return await this.prisma.consulta.delete({
            where: {
                id: id
            }
        })


    }
    async criar(dadosConsulta: Omit<Consulta,"id">) {
        return await this.prisma.consulta.create({
            data: {
                medico_responsavel_id:dadosConsulta.medico_responsavel_id,
                paciente_id: dadosConsulta.paciente_id,
                motivo: dadosConsulta.motivo || '',
                data_consulta: new Date(dadosConsulta.data_consulta||""),
                observacoes: dadosConsulta.observacoes || ""
            }
        })

    }



}

export const consultRepository = new ConsultRepository(prisma)