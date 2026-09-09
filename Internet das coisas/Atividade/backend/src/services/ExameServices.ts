import type { Exame } from "../prisma/generated/prisma/client";
import { examesRepository, ExamesRepository } from "../repositories/ExamesRepository";




export class ExameService {
    constructor(private readonly repository: ExamesRepository) {

    }

    async buscarTodos(pagina?:number,limite?:number) {


        return await this.repository.buscarTodos(pagina,limite)
    }
    async buscarPorId(id: number) {
        return await this.repository.buscarPorId(id)
    }

    async cadastrar(dadosExame: Exame) {

        if (dadosExame) {
            const exameCriado = await this.repository.criar({
                tipo_exame: dadosExame.tipo_exame,
                valor: dadosExame.valor,
                descricao: dadosExame.descricao,
                data_exame: new Date(dadosExame.data_exame),
                resultado: dadosExame.resultado
            })
            return exameCriado

        }
        throw new Error("Dados do exame nao encontrado")
    }




    async atualizar(dadosParaAtualizar: Exame) {

        const existeExame = await this.repository.buscarPorId(dadosParaAtualizar.id)

        if (existeExame) {

            return await this.repository.atualizar(dadosParaAtualizar)
        }
        throw new Error("Exame não encontrado")

    }

    async deletar(id: number) {
        return await this.repository.deletar(id)
    }

}

export const exameService = new ExameService(examesRepository)