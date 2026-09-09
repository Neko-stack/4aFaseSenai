
import { PrismaClient, type Paciente } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";


export class PacienteRepository{

    constructor(private readonly prisma: PrismaClient ){
        this.prisma = prisma
    }


    async criar(dadosPaciente:Omit <Paciente ,"id">){

        return await this.prisma.paciente.create({
            data:{
                ...dadosPaciente
            }
        })
    }

    async buscarTodos(pagina?:number,limite?:number){

         const existePaginacao = pagina! && limite!

        if (!existePaginacao) return {paciente:await this.prisma.paciente.findMany()}
        
        const paciente = await this.prisma.exame.findMany({
            skip: (pagina-1) * limite,
            take: limite
        })


        const total = await this.prisma.exame.count()

        const totalPaginas = Math.ceil(total/limite)


        return {
            paciente,
            total,
            totalPaginas,

        }


    }


    async buscarPorId(id:number){

        return await this.prisma.paciente.findUnique({
            where:{
                id
            }
        })
    }

    async deletar(id:number){

        return await this.prisma.paciente.delete({
            where:{
                id
            }
        })
    }

    async atualizar(dadosPaciente: Paciente){

        return await this.prisma.paciente.update({
            data:{
                nome: dadosPaciente.nome,
                telefone:dadosPaciente.telefone,
                email:dadosPaciente.email,
                data_nascimento:dadosPaciente.data_nascimento,
                sexo:dadosPaciente.sexo,
                responsavel: dadosPaciente.responsavel
            },
            where:{
                id:dadosPaciente.id
            }

        })
    }


}

export const pacienteRepository = new PacienteRepository(prisma)
