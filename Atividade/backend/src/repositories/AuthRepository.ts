import { PrismaClient, type Token, type Usuario } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";


export class AuthRepository {

    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }


    async cadastrar(dadosUsuario: Partial<Usuario>) {
        return this.prisma.usuario.create({
            data: {
                email: dadosUsuario.email || "",
                senha: dadosUsuario.senha || "",
                nome: dadosUsuario.nome || "",
                role: dadosUsuario.role || "USER"
            }
        })

    }

    async existeUsuario(email: string) {
        return this.prisma.usuario.findUnique({
            where: {
                email: email || '',
            }

        }
        )
        
    }

    async criarToken(dadosToken: Omit<Token, "id" | "revoked">) {
            return await this.prisma.token.create({
                data: dadosToken
            })
        }


}


export const authRepository = new AuthRepository(prisma)