import type { Prontuario } from "../prisma/generated/prisma/client";
import {prontuarioRepository ,ProntuarioRepository  } from "../repositories/ProntuarioRepository";




export class ProntuarioService {
    constructor(private readonly repository: ProntuarioRepository) {

    }

    async buscarTodos(pagina?: number, limite?: number) {


        return await this.repository.buscarTodos(pagina, limite)
    }
    async buscarPorId(id: number) {
        return await this.repository.buscarPorId(id)
    }

    async cadastrar(dadosProntuario: Prontuario) {

        if (!dadosProntuario) throw new Error("Dados do prontuario nao encontrado")


        if (!dadosProntuario.medico_responsavel_id) throw new Error("Id do medico responsavel não encontrado")


        if (!dadosProntuario.paciente_id) throw new Error("Id do paciente não encontrado")

        

        const prontuarioCriada = await this.repository.criar({
            paciente_id: Number(dadosProntuario.paciente_id),
            data: dadosProntuario.data,
            descricao: dadosProntuario.descricao,
            medico_responsavel_id:Number(dadosProntuario.medico_responsavel_id)
            
        })
        return prontuarioCriada

    }




    async atualizar(dadosParaAtualizar: Prontuario) {

        const existeProntuario = await this.repository.buscarPorId(dadosParaAtualizar.id)

        if (existeProntuario) {

            return await this.repository.atualizar(dadosParaAtualizar)
        }
        throw new Error("Prontuario não encontrado")

    }

    async deletar(id: number) {
        return await this.repository.deletar(id)
    }

}

export const prontuarioService = new ProntuarioService(prontuarioRepository)