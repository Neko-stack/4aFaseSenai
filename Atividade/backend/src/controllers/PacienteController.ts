import type { Request, Response } from "express"
import { pacienteService, type PacienteService } from "../services/pacienteService"
import type { Paciente } from "../prisma/generated/prisma/client"

export class PacienteController {

    constructor(private readonly service: PacienteService) { }

    async listarTdsPacientes(req: Request, res: Response) {
        try {
            const pagina = req.query.pagina ? Number(req.query.pagina) : undefined
            const limite = req.query.limite ? Number(req.query.limite) : undefined
            const pacientes = await this.service.listarTdsPacientes(pagina, limite)

            return res.status(200).json(pacientes)
        } catch (error) {
            return res.status(404).json({ error })
        }
    }

    async buscarPacienteId(req: Request, res: Response) {
        try {
            const idPaciente = Number(req.params.id)
            const paciente = await this.service.buscarPacienteId(idPaciente)

            return res.status(200).json(paciente)
        } catch (error) {
            return res.status(404).json({ error })
        }
    }

    // async criarPaciente(req: Request, res: Response) {
    //     try {
    //         const ddsPaciente = req.body as Paciente
    //         const pacienteCriado = await this.service.criarPaciente(ddsPaciente)

    //         return res.status(201).json(pacienteCriado)
    //     } catch (error) {
    //         return res.status(404).json({ error })
    //     }
    // }

    async criarPaciente(req: Request, res: Response) {
    try {
        const ddsPaciente = req.body as Paciente
        const pacienteCriado = await this.service.criarPaciente(ddsPaciente)

        return res.status(201).json(pacienteCriado)
    } catch (error) {
        console.error(error);

        return res.status(500).json(error);
    }
}

    async atualizarPaciente(req: Request, res: Response) {
        try {
            const idPaciente = Number(req.params.id)
            const novosDdsPaciente = req.body as Omit<Paciente, 'id'>
            const pacienteAtualizado = await this.service.atualizarPaciente(idPaciente, novosDdsPaciente)

            return res.status(200).json(pacienteAtualizado)
        } catch (error) {
            return res.status(404).json({ error })
        }
    }

    async deletarPaciente(req: Request, res: Response) {
        try {
            const idPaciente = Number(req.params.id)
            const paciente = await this.service.deletarPaciente(idPaciente)

            return res.status(200).json({
                mensagem: "Paciente deletado com sucesso!",
                data: paciente
            })
        } catch (error) {
            return res.status(404).json({ error })
        }
    }
}

export const pacienteController = new PacienteController(pacienteService);
