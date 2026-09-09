import type { Prontuario } from "../prisma/generated/prisma/client";
import { prontuarioRepository, type ProntuarioRepository } from "../repository/prontuarioRepository";

export class ProntuarioService {

    constructor(private readonly repository: ProntuarioRepository) { }

    async listarTdsProntuarios(pagina?: number, limite?: number) {

        const prontuarios = await this.repository.listarTdsProntuarios(pagina, limite)

        return prontuarios
    }

    async buscarProntuarioId(idProntuario: number) {

        const prontuario = await this.repository.buscarProntuarioId(idProntuario)

        return prontuario
    }

    async criarProntuario(ddsProntuario: Prontuario) {

        const prontuarioCriado = await this.repository.criarProntuario({
            descricao: ddsProntuario.descricao,
            data: ddsProntuario.data ? new Date(ddsProntuario.data) : null,
            medico_responsavel_id: ddsProntuario.medico_responsavel_id,
            paciente_id: ddsProntuario.paciente_id
        })

        return prontuarioCriado
    }

    async atualizarProntuario(idProntuario: number, atualizarDados: Omit<Prontuario, 'id'>) {

        const ddsProntuarioAtualizados = await this.repository.atualizarProntuario(idProntuario, atualizarDados)

        return ddsProntuarioAtualizados
    }

    async deletarProntuario(idProntuario: number) {

        const prontuarioDeletado = await this.repository.deletarProntuario(idProntuario)

        return prontuarioDeletado
    }
}

export const prontuarioService = new ProntuarioService(prontuarioRepository);
