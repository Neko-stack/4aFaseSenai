import type { Request, Response } from "express";
import { usuarioService, type UsuarioService } from "../services/usuarioService";
import type { Usuario } from "../prisma/generated/prisma/client";


export class UsuarioController {

    constructor(private readonly service: UsuarioService) {
    }

    async listarTdsUsuarios(_: Request, res: Response) {

        try {

            const usuarios = await this.service.listarTdsUsuarios()

            return res.status(200).json(usuarios)

        } catch (error) {

            // console.log(error)

            return res.status(404).json({
                error
            })
        }
    }

    async buscarUsuarioId(req: Request, res: Response) {

        try {

            const idUsuario = Number(req.params.id)
            const usuario = await this.service.buscarUsuarioId(idUsuario)

            return res.status(201).json(usuario)

        } catch (error) {

            // console.log(error)

            return res.status(404).json({
                error
            })
        }

    }

    async criarUsuario(req: Request, res: Response) {

        try {

            const ddsUsuario = req.body as Usuario
            const usuarioCriado = await this.service.criarUsuario(ddsUsuario)

            return res.status(201).json(usuarioCriado)

        } catch (error) {

            // console.log(error)

            return res.status(404).json({
                error
            })
        }

    }

    async atualizarusuario(req: Request, res: Response) {

        try {

            const idUsuario = Number(req.params.id)

            const ddsAtualizados = req.body as Partial<Usuario>

            const usuarioAtualizado =
                await this.service.atualizarUsuario(
                    idUsuario,
                    ddsAtualizados
                )

            return res.status(200).json(usuarioAtualizado)

        } catch (error) {

            return res.status(404).json({
                error
            })
        }
    }

    async deletarusuario(req: Request, res: Response) {

        try {

            const idUsuario = Number(req.params.id)
            const usuario = await this.service.deletarUsuario(idUsuario)

            return res.status(200).json({
                mensagem: "Usuário deletado com sucesso",
                data: usuario
            })

        } catch (error) {

            // console.log(error)

            return res.status(404).json({
                error
            })
        }
    }
}
export const usuarioController = new UsuarioController(usuarioService)