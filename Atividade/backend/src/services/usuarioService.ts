import type { Usuario } from "../prisma/generated/prisma/client";
import { usuarioRepository, type UsuarioRepository } from "../repository/usuarioRepository";
import { createHash } from "../utils/createHash";




export class UsuarioService {

    constructor(private readonly repository: UsuarioRepository) {
    }

    async listarTdsUsuarios() {

        const usuarios = await this.repository.listarTdsUsuarios()

        return usuarios
    }

    async buscarUsuarioId(idUsuario: number) {

        const usuario = await this.repository.buscarUsuarioId(idUsuario)

        return usuario
    }

    async criarUsuario(ddsUsuario: Usuario) {

        const hash = await createHash(ddsUsuario.senha)

        const usuarioCriado = await this.repository.criarUsuario({
            nome: ddsUsuario.nome || "",
            email: ddsUsuario.email || "",
            senha: hash,
            role: ddsUsuario.role || "USER"
        })

        return usuarioCriado
    }

    async atualizarUsuario(
        idUsuario: number,
        atualizarDados: Partial<Usuario>
    ) {

        if (atualizarDados.senha) {

            atualizarDados.senha = await createHash(
                atualizarDados.senha
            )

        }

        const ddsAtualizados = await this.repository.atualizarUsuario(
            idUsuario,
            atualizarDados
        )

        return ddsAtualizados
    }

    async deletarUsuario(idUsuario: number) {

        const usuario = await this.repository.deletarUsuario(idUsuario)

        return usuario
    }
}
export const usuarioService = new UsuarioService(usuarioRepository)