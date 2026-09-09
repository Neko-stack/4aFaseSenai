import type { Request, Response } from "express"
import { exameService, type ExameService } from "../services/exameService"
import type { Exame } from "../prisma/generated/prisma/client"

export class ExameController {

    constructor(private readonly service: ExameService) { }

    async listarTdsExames(req: Request, res: Response) {
        try {

            const pagina = req.query.pagina ? Number(req.query.pagina) : undefined;
            const limite = req.query.limite ? Number(req.query.limite) : undefined;
            const pacienteId = req.query.pacienteId
                ? Number(req.query.pacienteId)
                : undefined;

            const exames = await this.service.listarTdsExames(
                pagina,
                limite,
                pacienteId
            );

            return res.status(200).json(exames);

        } catch (error) {
            return res.status(404).json({ error });
        }
    }

    async buscarExameId(req: Request, res: Response) {

        try {

            const idExame = Number(req.params.id)
            const exame = await this.service.buscarExameId(idExame)

            return res.status(200).json(exame)

        } catch (error) {

            // console.log(error)

            return res.status(404).json({ error })
        }
    }

    async criarExame(req: Request, res: Response) {

        try {
            console.log(req.body);

            const ddsExame = req.body as Exame
            const exameCriado = await this.service.criarExame(ddsExame)

            return res.status(201).json(exameCriado)

        } catch (error) {

            // console.log(error)

            return res.status(404).json({ error })
        }
    }

    async atualizarExame(req: Request, res: Response) {

        try {

            const idExame = Number(req.params.id)
            const novosDdsExame = req.body as Omit<Exame, 'id'>
            const ddsExameAtualizados = await this.service.atualizarExame(idExame, novosDdsExame)

            return res.status(200).json(ddsExameAtualizados)

        } catch (error) {

            // console.log(error)

            return res.status(404).json({ error });
        }
    }

    async deletarExame(req: Request, res: Response) {

        try {

            const idExame = Number(req.params.id)
            const exame = await this.service.deletarExame(idExame)

            return res.status(200).json({
                mensagem: "Usuário deletado com sucesso!",
                data: exame
            })

        } catch (error) {

            // console.log(error)
            return res.status(404).json({ error });
        }
    }
}

export const exameController = new ExameController(exameService);