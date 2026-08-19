import type { Request, Response } from "express"
import { prontuarioService, type ProntuarioService } from "../services/prontuarioService"
import type { Prontuario } from "../prisma/generated/prisma/client"

export class ProntuarioController {

    constructor(private readonly service: ProntuarioService) { }

    async listarTdsProntuarios(req: Request, res: Response) {
        try {
            const pagina = req.query.pagina ? Number(req.query.pagina) : undefined
            const limite = req.query.limite ? Number(req.query.limite) : undefined
            const prontuarios = await this.service.listarTdsProntuarios(pagina, limite)

            return res.status(200).json(prontuarios)
        } catch (error) {
            return res.status(404).json({ error })
        }
    }

    async buscarProntuarioId(req: Request, res: Response) {
        try {
            const idProntuario = Number(req.params.id)
            const prontuario = await this.service.buscarProntuarioId(idProntuario)

            return res.status(200).json(prontuario)
        } catch (error) {
            return res.status(404).json({ error })
        }
    }

    async criarProntuario(req: Request, res: Response) {
        try {
            const ddsProntuario = req.body as Prontuario
            const prontuarioCriado = await this.service.criarProntuario(ddsProntuario)

            return res.status(201).json(prontuarioCriado)
        } catch (error) {
            return res.status(404).json({ error })
        }
    }

    async atualizarProntuario(req: Request, res: Response) {
        try {
            const idProntuario = Number(req.params.id)
            const novosDdsProntuario = req.body as Omit<Prontuario, 'id'>
            const ddsProntuarioAtualizados = await this.service.atualizarProntuario(idProntuario, novosDdsProntuario)

            return res.status(200).json(ddsProntuarioAtualizados)
        } catch (error) {
            return res.status(404).json({ error })
        }
    }

    async deletarProntuario(req: Request, res: Response) {
        try {
            const idProntuario = Number(req.params.id)
            const prontuario = await this.service.deletarProntuario(idProntuario)

            return res.status(200).json({
                mensagem: "Prontuário deletado com sucesso!",
                data: prontuario
            })
        } catch (error) {
            return res.status(404).json({ error })
        }
    }
}

export const prontuarioController = new ProntuarioController(prontuarioService);
