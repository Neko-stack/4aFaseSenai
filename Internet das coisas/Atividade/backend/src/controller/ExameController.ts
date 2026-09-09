import type { Response,Request } from "express";
import { log } from "node:console";
import type { Exame } from "../prisma/generated/prisma/client";
import { exameService, type ExameService } from "../services/ExameServices";

class ExameController {
    constructor(private readonly service: ExameService) {
        
    }

    async buscarTodos(req:Request,res:Response){

        const pagina = req.query.pagina ? Number(req.query.pagina): undefined
        const limite = req.query.limite ? Number(req.query.limite): undefined

        try {
            const examesBuscados = await this.service.buscarTodos(pagina,limite)

            if (examesBuscados.exames.length===0) {

                return res.status(200).json({
                    message:"Nao tem Exame cadastrados",
                    exames:examesBuscados
                })
                
            }

            
            return res.status(200).json({
                message:"Exame encontrados",
                exames:examesBuscados
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
            const exame = await this.service.buscarPorId(id)

            if (exame) {
                return res.status(200).json({
                    message:"Exame encontrado",
                    exames:exame
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

            const exameDeletado = await this.service.deletar(id)

            return res.status(200).json({
                message:"Exame deletado",
                exames:exameDeletado
            }
        )
            
        } catch (error) {
            log(error)

            res.status(400).json({
                error
            })
            
        }
    }
    async criarExame(req: Request, res: Response) {

        try {

            const dadosExame = req.body as Exame
            const usuarioCadastrado = await this.service.cadastrar(dadosExame)

            return res.status(201).json({
                message: "Exame criado com sucesso",
                exames: usuarioCadastrado
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
            const dadosParaAtualizar = req.body  as Omit<Exame, 'id'>

            const dadosAtualizados = await this.service.atualizar({...dadosParaAtualizar,id})

            return res.status(200).json({
                message:"Dados Atualizados",
                exames:dadosAtualizados
                
            });
            
        } catch (error) {
             log(error)

            res.status(400).json({
                error
            })
        }
    }


}


export const exameController = new ExameController(exameService)