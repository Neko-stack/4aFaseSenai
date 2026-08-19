import type { Response,Request } from "express";
import { usuarioService, type UsuarioService } from "../services/UsuarioServices";
import { log } from "node:console";
import type { Usuario } from "../prisma/generated/prisma/client";

class UsuarioController {
    constructor(private readonly service: UsuarioService) {
        
    }

    async buscarTodos(req:Request,res:Response){

        try {
            const usuariosBuscados = await this.service.buscarTodos()

            return res.status(200).json({
                message:"usuarios encontrados",
                usuario:usuariosBuscados
            })

        } catch (error) {

            log(error)

            res.status(400).json({
                error
            })
            
        }
    }
    async buscarPorId(req:Request,res:Response){

        try {
            const id = Number(req.params.id)
            const usuarios = await this.service.buscarPorId(id)

            if (usuarios) {
                return res.status(200).json({
                    message:"usuario encontrado",
                    usuario:usuarios
                })
                
            }
        
            

        } catch (error) {

            log(error)

            res.status(400).json({
                error
            })
            
        }
    }


    async deletar (req:Request,res:Response){

        try {

            const id = Number(req.params.id)

            const usuarioDeletado = await this.service.deletar(id)

            return res.status(200).json({
                message:"usuario deletado",
                usuario:usuarioDeletado
            }
        )
            
        } catch (error) {
            log(error)

            res.status(400).json({
                error
            })
            
        }
    }
    async criarUsuario(req: Request, res: Response) {

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


    async atualizar(req:Request,res:Response){


        try {
            const id = Number(req.params)
            const dadosParaAtualizar = req.body as Omit<Usuario, "id">

            const dadosAtualizados = await this.service.atualizar({...dadosParaAtualizar,id})

            return res.status(200).json({
                message:"Dados Atualizados",
                usuario:dadosAtualizados
                
            });
            
        } catch (error) {
             log(error)

            res.status(400).json({
                error
            })
        }
    }


}


export const usuarioController = new UsuarioController(usuarioService)