import { pacienteRepository, type PacienteRepository } from "../repository/pacienteRepository";

export class PacienteService {

    constructor(private readonly repository: PacienteRepository) { }

    async listarTdsPacientes(pagina?: number, limite?: number) {
        return await this.repository.listarTdsPacientes(pagina, limite)
    }

    async buscarPacienteId(idPaciente: number) {
        return await this.repository.buscarPacienteId(idPaciente)
    }

    async criarPaciente(ddsPaciente: any) {
        return await this.repository.criarPaciente({
            nome: ddsPaciente.nome,
            cpf: ddsPaciente.cpf,
            sexo: ddsPaciente.sexo,
            data_nascimento: new Date(ddsPaciente.data_nascimento),
            telefone: ddsPaciente.telefone,
            email: ddsPaciente.email,
            convenio: ddsPaciente.convenio || null,
            alergias: ddsPaciente.alergias || null,
            observacoes: ddsPaciente.observacoes || null,
            responsavel: ddsPaciente.responsavel || null,
        })
    }

    async atualizarPaciente(idPaciente: number, atualizarDados: any) {
        return await this.repository.atualizarPaciente(idPaciente, atualizarDados)
    }

    async deletarPaciente(idPaciente: number) {
        return await this.repository.deletarPaciente(idPaciente)
    }
}

export const pacienteService = new PacienteService(pacienteRepository);
