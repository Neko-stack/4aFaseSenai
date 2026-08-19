import type { Request, Response } from "express"
import { medicamentoService, type MedicamentoService } from "../services/MedicamentoService"
import type { Medicamento } from "../prisma/generated/prisma/client"

export class MedicamentoController {

    constructor(private readonly service: MedicamentoService) { }

    async listarTdsMedicamentos(req: Request, res: Response) {
        try {
            const pagina = req.query.pagina ? Number(req.query.pagina) : undefined
            const limite = req.query.limite ? Number(req.query.limite) : undefined
            const medicamentos = await this.service.listarTdsMedicamentos(pagina, limite)

            return res.status(200).json(medicamentos)
        } catch (error) {
            return res.status(404).json({ error })
        }
    }

    async buscarMedicamentoId(req: Request, res: Response) {
        try {
            const idMedicamento = Number(req.params.id)
            const medicamento = await this.service.buscarMedicamentoId(idMedicamento)

            if (!medicamento) {
                return res.status(404).json({ error: "Medicamento não encontrado" })
            }

            return res.status(200).json(medicamento)
        } catch (error) {
            return res.status(404).json({ error })
        }
    }

    async criarMedicamento(req: Request, res: Response) {
        try {
            const ddsMedicamento = req.body as Medicamento
            const medicamentoCriado = await this.service.criarMedicamento(ddsMedicamento)

            return res.status(201).json(medicamentoCriado)
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    }

    async atualizarMedicamento(req: Request, res: Response) {
        try {
            const idMedicamento = Number(req.params.id)
            const novosDdsMedicamento = req.body as Omit<Medicamento, 'id'>
            const medicamentoAtualizado = await this.service.atualizarMedicamento(idMedicamento, novosDdsMedicamento)

            return res.status(200).json(medicamentoAtualizado)
        } catch (error) {
            return res.status(404).json({ error })
        }
    }

    async deletarMedicamento(req: Request, res: Response) {
        try {
            const idMedicamento = Number(req.params.id)
            const medicamento = await this.service.deletarMedicamento(idMedicamento)

            return res.status(200).json({
                mensagem: "Medicamento deletado com sucesso!",
                data: medicamento
            })
        } catch (error) {
            return res.status(404).json({ error })
        }
    }
}

export const medicamentoController = new MedicamentoController(medicamentoService);
