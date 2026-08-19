import { prisma } from "../prisma/prisma";

export class PacienteRepository {

    constructor(private readonly prisma: any) {
        this.prisma = prisma
    }

    async listarTdsPacientes(pagina?: number, limite?: number) {
        const existePaginacao = pagina! && limite!
        if (!existePaginacao) {
            return await prisma.paciente.findMany({
                include: { Prontuario: true, Consulta: true, Exame: true }
            })
        }

        const pacientes = await prisma.paciente.findMany({
            skip: (pagina - 1) * limite,
            take: limite,
            include: { Prontuario: true, Consulta: true, Exame: true }
        })

        const total = await prisma.paciente.count()
        const ttlPgs = Math.ceil(total / limite)

        return { pacientes, total, ttlPgs }
    }

    async buscarPacienteId(idPaciente: number) {
        return await prisma.paciente.findUnique({
            where: { id: idPaciente },
            include: { Prontuario: true, Consulta: true, Exame: true }
        })
    }

    async criarPaciente(ddsPaciente: any) {
        return await this.prisma.paciente.create({
            data: {
                nome: ddsPaciente.nome || "",
                cpf: ddsPaciente.cpf || "",
                data_nascimento: new Date(ddsPaciente.data_nascimento!),
                sexo: ddsPaciente.sexo || "",
                telefone: ddsPaciente.telefone || "",
                email: ddsPaciente.email || "",
                convenio: ddsPaciente.convenio || null,
                alergias: ddsPaciente.alergias || null,
                observacoes: ddsPaciente.observacoes || null,
                responsavel: ddsPaciente.responsavel || null,
            }
        })
    }

    async atualizarPaciente(idPaciente: number, atualizarDados: any) {
        return await prisma.paciente.update({
            where: { id: idPaciente },
            data: {
                ...atualizarDados,
                data_nascimento: new Date(atualizarDados.data_nascimento),
            }
        })
    }

    async deletarPaciente(idPaciente: number) {
        return await prisma.paciente.delete({
            where: { id: idPaciente }
        })
    }
}

export const pacienteRepository = new PacienteRepository(prisma)
