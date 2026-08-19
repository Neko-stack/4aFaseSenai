import { prisma } from "../prisma/prisma";


export class ExameRepository {

    constructor(private readonly prisma: any) { }

    async listarTdsExames( pagina?: number, limite?: number, pacienteId?: number ) {

        const where = pacienteId ? { paciente_id: pacienteId } : {}
        const existePaginacao = pagina && limite

        if (!existePaginacao) {
            return await this.prisma.exame.findMany({
                where,
                include: {
                    paciente: true
                }
            })
        }

        const exames = await this.prisma.exame.findMany({
            where,
            skip: (pagina - 1) * limite,
            take: limite,
            include: {
                paciente: true
            }
        })

        const total = await this.prisma.exame.count({ where })
        const ttlPgs = Math.ceil(total / limite)

        return { exames, total, ttlPgs }
    }

    async buscarExameId(idExame: number) {

        const exame = await prisma.exame.findUnique({
            where: {
                id: idExame
            },
            include: {
                paciente: true
            }
        })

        return exame
    }

    async criarExame(ddsExame: any) {

        return await prisma.exame.create({
            data: {
                tipo_exame: ddsExame.tipo_exame || "",
                valor: ddsExame.valor || 0,
                descricao: ddsExame.descricao || "",
                resultado: ddsExame.resultado || "",
                data_exame: new Date(ddsExame.data_exame || new Date()),
                paciente_id: ddsExame.paciente_id!
            }
        })
    }

    async atualizarExame(idExame: number, atualizarDados: any) {

        const ddsExameAtualizados = await prisma.exame.update({
            data: {
                ...atualizarDados,
                data_exame: new Date(atualizarDados.data_exame),
                paciente_id: atualizarDados.paciente_id
            }, where: {
                id: idExame
            }
        })

        return ddsExameAtualizados
    }

    async deletarExame(idExame: number) {

        const exame = await prisma.exame.delete({
            where: {
                id: idExame
            }
        })

        return exame
    }
}

export const exameRepository = new ExameRepository(prisma)
