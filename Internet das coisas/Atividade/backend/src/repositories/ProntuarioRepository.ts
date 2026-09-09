import { PrismaClient, type Prontuario } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";

export class ProntuarioRepository {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async buscarTodos(pagina?: number, limite?: number) {

        const existePaginacao = pagina! && limite!

        if (!existePaginacao) return { prontuario: await this.prisma.prontuario.findMany() }

        const prontuario = await this.prisma.prontuario.findMany({
            skip: (pagina - 1) * limite,
            take: limite
        })


        const total = await this.prisma.prontuario.count()

        const totalPaginas = Math.ceil(total / limite)


        return {
            prontuario,
            total,
            totalPaginas,

        }
    }
    async buscarPorId(id: number) {

        return await this.prisma.prontuario.findUnique({
            where: {
                id: id
            }
        });
    }



    async atualizar(dadosProntuario: Prontuario) {
        return await this.prisma.prontuario.update({
            data: {
                ...dadosProntuario
            },
            where: {
                id: dadosProntuario.id
            }
        })

    }

    async deletar(id: number) {

        return await this.prisma.prontuario.delete({
            where: {
                id: id
            }
        })


    }
    async criar(dadosProntuario: Omit<Prontuario,"id">) {
        return await this.prisma.prontuario.create({
            data: {
                medico_responsavel_id:dadosProntuario.medico_responsavel_id,
                paciente_id: dadosProntuario.paciente_id,
                descricao: dadosProntuario.descricao || '',
                data: new Date(dadosProntuario.data||"")
            }
        })

    }



}

export const prontuarioRepository = new ProntuarioRepository(prisma)