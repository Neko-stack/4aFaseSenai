import type { Consulta } from "../prisma/generated/prisma/client";
import { ConsultRepository, consultRepository } from "../repositories/ConsultRepository";




export class ConsultService {
    constructor(private readonly repository: ConsultRepository) {

    }

    async buscarTodos(pagina?: number, limite?: number) {


        return await this.repository.buscarTodos(pagina, limite)
    }
    async buscarPorId(id: number) {
        return await this.repository.buscarPorId(id)
    }

    async cadastrar(dadosConsulta: Consulta) {

        if (!dadosConsulta) throw new Error("Dados da consulta nao encontrado")


        if (!dadosConsulta.medico_responsavel_id) throw new Error("Id do medico responsavel não encontrado")


        if (!dadosConsulta.paciente_id) throw new Error("Id do paciente não encontrado")

        

        const consultaCriada = await this.repository.criar({
            paciente_id: Number(dadosConsulta.paciente_id),
            data_consulta: dadosConsulta.data_consulta,
            motivo: dadosConsulta.motivo,
            observacoes: dadosConsulta.observacoes,
            medico_responsavel_id:Number(dadosConsulta.medico_responsavel_id)
            
        })
        return consultaCriada

    }




    async atualizar(dadosParaAtualizar: Consulta) {

        const existeConsulta = await this.repository.buscarPorId(dadosParaAtualizar.id)

        if (existeConsulta) {

            return await this.repository.atualizar(dadosParaAtualizar)
        }
        throw new Error("Consulta não encontrado")

    }

    async deletar(id: number) {
        return await this.repository.deletar(id)
    }

}

export const consultService = new ConsultService(consultRepository)