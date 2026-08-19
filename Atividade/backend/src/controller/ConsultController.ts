import type { Response,Request } from "express";
import { log } from "node:console";
import type { Consulta } from "../prisma/generated/prisma/client";
import {consultService , type ConsultService} from "../services/ConsultServices";

class ConsultController {
    constructor(private readonly service: ConsultService) {
        
    }

    async buscarTodos(req:Request,res:Response){

        const pagina = req.query.pagina ? Number(req.query.pagina): undefined
        const limite = req.query.limite ? Number(req.query.limite): undefined

        try {
            const consultaBuscados = await this.service.buscarTodos(pagina,limite)

            if (consultaBuscados.consulta.length===0) {

                return res.status(200).json({
                    message:"Nao tem consultas cadastradas",
                    consulta:consultaBuscados
                })
                
            }

            
            return res.status(200).json({
                message:"Consultas encontradas",
                consulta:consultaBuscados
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
            const consulta = await this.service.buscarPorId(id)

            if (consulta) {
                return res.status(200).json({
                    message:"Consulta encontrada",
                    consulta:consulta
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

            const consultaDeletada = await this.service.deletar(id)

            return res.status(200).json({
                message:"Consulta deletada",
                consulta:consultaDeletada
            }
        )
            
        } catch (error) {
            log(error)

            res.status(400).json({
                error
            })
            
        }
    }
    async criar(req: Request, res: Response) {

        try {

            const dadosConsulta = req.body as Consulta
            const consultaCadastrada = await this.service.cadastrar(dadosConsulta)

            return res.status(201).json({
                message: "Exame criado com sucesso",
                consulta: consultaCadastrada
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
            const dadosParaAtualizar = req.body  as Omit<Consulta, 'id'>

            const dadosAtualizados = await this.service.atualizar({...dadosParaAtualizar,id})

            return res.status(200).json({
                message:"Dados Atualizados",
                consulta:dadosAtualizados
                
            });
            
        } catch (error) {
             log(error)

            res.status(400).json({
                error
            })
        }
    }


}


export const consultController = new ConsultController(consultService)