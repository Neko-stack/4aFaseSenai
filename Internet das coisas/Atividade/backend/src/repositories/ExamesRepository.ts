import { PrismaClient, type Exame} from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";

export class ExamesRepository {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async buscarTodos(pagina?:number,limite?:number) {

        const existePaginacao = pagina! && limite!

        if (!existePaginacao) return {exames:await this.prisma.exame.findMany()}
        
        const exames = await this.prisma.exame.findMany({
            skip: (pagina-1) * limite,
            take: limite
        })


        const total = await this.prisma.exame.count()

        const totalPaginas = Math.ceil(total/limite)


        return {
            exames,
            total,
            totalPaginas,

        }
    }
    async buscarPorId(id: number) {

        return await this.prisma.exame.findUnique({
            where: {
                id: id
            }
        });
    }



    async atualizar(dadosExame: Exame) {
        return await this.prisma.exame.update({
            data: {
                ...dadosExame
            },
            where: {
                id: dadosExame.id
            }
        })

    }

    async deletar(id: number) {

        return await this.prisma.exame.delete({
            where: {
                id: id
            }
        })


    }
    async criar(dadosExame: Partial<Exame>) {
        return await this.prisma.exame.create({
            data: {
                
                tipo_exame: dadosExame.tipo_exame||'',
                valor: dadosExame.valor||'',
                descricao: dadosExame.descricao||'',
                data_exame: new Date(dadosExame.data_exame||""),
                resultado: dadosExame.resultado ||""
            }
        })

    }



}

export const examesRepository = new ExamesRepository(prisma)