import { PrismaClient, type Usuario } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";


export class UsuarioRepository {
    constructor(private readonly prisma: PrismaClient) {

        this.prisma = prisma
    }

    async buscarTodos() {

        return await this.prisma.usuario.findMany();
    }
    async buscarPorId(id: number) {

        return await this.prisma.usuario.findUnique({
            where:{
                id:id
            }
        });
    }



    async atualizar(dadosParaAtualizar: Usuario) {
        return await this.prisma.usuario.update({
            data: {
                ...dadosParaAtualizar
            },
            where: {
                id: dadosParaAtualizar.id
            }
        })

    }

    async deletar(id: number) {

        return await this.prisma.usuario.delete({
            where: {
                id: id
            }
        })


    }
    async criar(dadosUsuario: Partial<Usuario>) {
        return await prisma.usuario.create({
            data: {
                email: dadosUsuario.email || "",
                senha: dadosUsuario.senha || "",
                nome: dadosUsuario.nome || "",
                role: dadosUsuario.role|| "USER"
            }
        })

    }



}

export const usuarioRepository = new UsuarioRepository(prisma)