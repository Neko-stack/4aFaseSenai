import type { Request, Response } from "express"
import { consultaService, type ConsultaService } from "../services/consultaService"
import type { Consulta } from "../prisma/generated/prisma/client"

export class ConsultaController {

    constructor(private readonly service: ConsultaService) { }

    async listarTdsConsultas(req: Request, res: Response) {
        try {
            const pagina = req.query.pagina ? Number(req.query.pagina) : undefined
            const limite = req.query.limite ? Number(req.query.limite) : undefined
            const pacienteId = req.query.pacienteId ? Number(req.query.pacienteId) : undefined;
            const consultas = await this.service.listarTdsConsultas(pagina, limite, pacienteId)

            return res.status(200).json(consultas)
        } catch (error) {
            return res.status(404).json({ error })
        }
    }

    async buscarConsultaId(req: Request, res: Response) {
        try {
            const idConsulta = Number(req.params.id)
            const consulta = await this.service.buscarConsultaId(idConsulta)

            return res.status(200).json(consulta)
        } catch (error) {
            return res.status(404).json({ error })
        }
    }

    async criarConsulta(req: Request, res: Response) {
        try {
            const ddsConsulta = req.body as Consulta
            const consultaCriada = await this.service.criarConsulta(ddsConsulta)

            return res.status(201).json(consultaCriada)
        } catch (error) {
            return res.status(404).json({ error })
        }
    }

    async atualizarConsulta(req: Request, res: Response) {
        try {
            const idConsulta = Number(req.params.id)
            const novosDdsConsulta = req.body as Omit<Consulta, 'id'>
            const ddsConsultaAtualizados = await this.service.atualizarConsulta(idConsulta, novosDdsConsulta)

            return res.status(200).json(ddsConsultaAtualizados)
        } catch (error) {
            return res.status(404).json({ error })
        }
    }

    async deletarConsulta(req: Request, res: Response) {
        try {
            const idConsulta = Number(req.params.id)
            const consulta = await this.service.deletarConsulta(idConsulta)

            return res.status(200).json({
                mensagem: "Consulta deletada com sucesso!",
                data: consulta
            })
        } catch (error) {
            return res.status(404).json({ error })
        }
    }
}

export const consultaController = new ConsultaController(consultaService);
