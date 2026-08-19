import type { PrismaClient, Usuario } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma"

export class UsuarioRepository {

    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async listarTdsUsuarios() {

        const usuarios = await prisma.usuario.findMany();

        return usuarios
    }

    async buscarUsuarioId(idUsuario: number) {

        const usuario = await prisma.usuario.findUnique({
            where: {
                id: idUsuario
            }
        })

        return usuario
    }

    async criarUsuario(ddsUsuario: Partial<Usuario>) {

        // console.log(ddsUsuario)

        return await this.prisma.usuario.create({
            data: {
                nome: ddsUsuario.nome || "",
                email: ddsUsuario.email || "",
                senha: ddsUsuario.senha || "",
                role: ddsUsuario.role || "USER"
            }
        })
    }

    async atualizarUsuario(
        idUsuario: number,
        atualizarDados: Partial<Usuario>
    ) {

        const ddsAtualizados = await prisma.usuario.update({
            data: {
                ...atualizarDados
            },
            where: {
                id: idUsuario
            }
        })
        return ddsAtualizados
    }

    async deletarUsuario(idUsuario: number) {

        const usuario = await prisma.usuario.delete({
            where: {
                id: idUsuario
            }
        })
        return usuario
    }
    
} export const usuarioRepository = new UsuarioRepository(prisma)