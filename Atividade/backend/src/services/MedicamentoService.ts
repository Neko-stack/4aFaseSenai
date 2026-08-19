import type { Medicamento } from "../prisma/generated/prisma/client";
import { medicamentoRepository, type MedicamentoRepository } from "../repository/MedicamentoRepository";

export class MedicamentoService {

    constructor(private readonly repository: MedicamentoRepository) { }

    async listarTdsMedicamentos(pagina?: number, limite?: number) {
        return await this.repository.listarTdsMedicamentos(pagina, limite)
    }

    async buscarMedicamentoId(idMedicamento: number) {
        return await this.repository.buscarMedicamentoId(idMedicamento)
    }

    async criarMedicamento(ddsMedicamento: Medicamento) {
        return await this.repository.criarMedicamento({
            nome: ddsMedicamento.nome,
            marca: ddsMedicamento.marca,
            fabricante: ddsMedicamento.fabricante,
            data_vencimento: new Date(ddsMedicamento.data_vencimento)
        })
    }

    async atualizarMedicamento(idMedicamento: number, atualizarDados: Omit<Medicamento, 'id'>) {
        return await this.repository.atualizarMedicamento(idMedicamento, atualizarDados)
    }

    async deletarMedicamento(idMedicamento: number) {
        return await this.repository.deletarMedicamento(idMedicamento)
    }
}

export const medicamentoService = new MedicamentoService(medicamentoRepository);
