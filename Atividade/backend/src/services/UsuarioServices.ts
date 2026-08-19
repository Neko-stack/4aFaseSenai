import type { Usuario } from "../prisma/generated/prisma/client";
import { usuarioRepository, type UsuarioRepository } from "../repositories/UsuarioRepository";
import { createHash } from "../utils/createHash";



export class UsuarioService{
    constructor( private readonly repository:UsuarioRepository){
        
    }

    async buscarTodos(){
        

        return await this.repository.buscarTodos()
    }
    async buscarPorId(id: number){
        return await this.repository.buscarPorId(id)
    }

    async cadastrar(dadosUsuario: Usuario) {
            const hash = await createHash(dadosUsuario.senha);
    
            const usuarioCriado = await this.repository.criar({
                email: dadosUsuario.email,
                nome: dadosUsuario.nome || null,
                senha: hash,
                role:dadosUsuario.role
            })
            return usuarioCriado
        }
    



    async atualizar(dadosParaAtualizar: Usuario) {

        const existeUsuario = await this.repository.buscarPorId(dadosParaAtualizar.id)

        if (existeUsuario) {
            
            return await this.repository.atualizar(dadosParaAtualizar)
        }
        throw new Error("Usuario não encontrado")

    }

    async deletar(id:number){
        return await this.repository.deletar(id)
    }
    
}

export const usuarioService = new UsuarioService(usuarioRepository)