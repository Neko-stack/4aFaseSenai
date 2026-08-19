import type { Response, Request } from "express"

import type { Usuario } from "../prisma/generated/prisma/client";
import { AuthService, authService } from "../services/AuthServices";



class AuthController {
    constructor(private readonly service: AuthService) {
        this.service = service

    }

    async cadastrar(req: Request, res: Response) {

        try {

            const dadosUsuario = req.body as Usuario
            const usuarioCadastrado = await this.service.cadastrar(dadosUsuario)

            return res.status(201).json({
                message: "Usuario criado com sucesso",
                usuario: usuarioCadastrado
            })

        } catch (error) {

            console.error(error)
            return res.status(400).json({
                error
            })

        }

    }
    async logar(req: Request, res: Response) {

        try {

            const dadosUsuario = req.body as Partial<Usuario>
            const usuarioLogado = await this.service.logar(dadosUsuario)

            return res.status(200).json({
                message: "Usuário autenticado com sucesso!",
                accessToken: usuarioLogado.tokenAcesso,
                refreshToken: usuarioLogado.tokenRefresh
            })



        } catch (error) {

            return res.status(401).json({
                error
            })

        }

    }


}

export const authController = new AuthController(authService)