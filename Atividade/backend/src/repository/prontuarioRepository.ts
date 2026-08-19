import type { Prontuario, PrismaClient } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";

export class ProntuarioRepository {

    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async listarTdsProntuarios(pagina?: number, limite?: number) {
        
        const existePaginacao = pagina! && limite!
        if(!existePaginacao) return await prisma.prontuario.findMany({
            include: { paciente: true, usuario: true }
        })
        
        const prontuarios = await prisma.prontuario.findMany({
            skip:(pagina-1) * limite,
            take: limite,
            include: { paciente: true, usuario: true }
        })

        const total = await prisma.prontuario.count()
        const ttlPgs = Math.ceil(total / limite)

        return {
            prontuarios,
            total,
            ttlPgs
        }
    }

    async buscarProntuarioId(idProntuario: number) {

        const prontuario = await prisma.prontuario.findUnique({
            where:{
                id: idProntuario
            },
            include: { paciente: true, usuario: true }
        })

        return prontuario
    }

    async criarProntuario(ddsProntuario: Partial<Prontuario>) {

        return await this.prisma.prontuario.create({
            data: {
                descricao: ddsProntuario.descricao || "",
                data: ddsProntuario.data ? new Date(ddsProntuario.data) : null,
                medico_responsavel_id: ddsProntuario.medico_responsavel_id!,
                paciente_id: ddsProntuario.paciente_id!
            }
        })
    }

    async atualizarProntuario(idProntuario: number, atualizarDados: Omit<Prontuario, 'id'>){

        const ddsProntuarioAtualizados = await prisma.prontuario.update({
            data: {
                ...atualizarDados,
                data: atualizarDados.data ? new Date(atualizarDados.data) : null
            }, 
            where:{
                id: idProntuario
            }
        })

        return ddsProntuarioAtualizados
    }

    async deletarProntuario(idProntuario: number) {

        const prontuario = await prisma.prontuario.delete({
            where:{
                id: idProntuario
            }
        })

        return prontuario 
    }
}

export const prontuarioRepository = new ProntuarioRepository(prisma)
