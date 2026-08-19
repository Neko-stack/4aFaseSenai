import type { Request, Response } from "express";
import type { Usuario } from "../prisma/generated/prisma/client"
import { AuthService, authService } from "../services/authService";

class AuthController {
    constructor(private readonly service: AuthService) {
    }

    async cadastrar(req: Request, res: Response) {
        try {
            const dadosUsuario = req.body as Usuario
            const usuarioCriado = await this.service.cadastrar(dadosUsuario);
            return res.status(201).json({
                message: "Usuário criado com sucesso!",
                data: usuarioCriado
            })
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async logar(req: Request, res: Response) {
        try {
            const dadosUsuario = req.body as Partial<Usuario>
            const dadosLogin = await this.service.logar(dadosUsuario);
            return res.status(200).json({
                message: "Usuário autenticado com sucesso!",
                accessToken: dadosLogin.tokenAcesso,
                refreshToken: dadosLogin.tokenRefresh
            })
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async resetPassword(req: Request, res: Response) {

        try {

            const { email, senha } = req.body

            if (!email || !senha) {
                return res.status(400).json({
                    mensagem: "E-mail e senha são obrigatórios."
                })
            }

            await this.service.resetPassword(email, senha)

            return res.status(200).json({
                mensagem: "Senha alterada com sucesso!"
            })

        } catch (error) {

            console.log(error)

            if (
                error instanceof Error &&
                error.message === "Usuário não encontrado."
            ) {
                return res.status(404).json({
                    mensagem: error.message
                })
            }

            return res.status(500).json({
                mensagem: "Erro ao alterar senha."
            })

        }

    }
}
export const authController = new AuthController(authService)