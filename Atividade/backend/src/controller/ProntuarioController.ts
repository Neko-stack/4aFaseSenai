import type { Response,Request } from "express";
import { log } from "node:console";
import type { Prontuario } from "../prisma/generated/prisma/client";
import { prontuarioService , type ProntuarioService} from "../services/ProntuarioServices";

class ProntuarioController {
    constructor(private readonly service: ProntuarioService) {
        
    }

    async buscarTodos(req:Request,res:Response){

        const pagina = req.query.pagina ? Number(req.query.pagina): undefined
        const limite = req.query.limite ? Number(req.query.limite): undefined

        try {
            const prontuarioBuscados = await this.service.buscarTodos(pagina,limite)

            if (prontuarioBuscados.prontuario.length===0) {

                return res.status(200).json({
                    message:"Nao tem prontuarios cadastrados",
                    prontuario:prontuarioBuscados
                })
                
            }

            
            return res.status(200).json({
                message:"Prontuario encontradas",
                prontuario:prontuarioBuscados
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
            const prontuario = await this.service.buscarPorId(id)

            if (prontuario) {
                return res.status(200).json({
                    message:"Prontuario encontrada",
                    prontuario:prontuario
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

            const prontuarioDeletada = await this.service.deletar(id)

            return res.status(200).json({
                message:"Prontuario deletada",
                prontuario:prontuarioDeletada
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

            const dadosProntuario = req.body as Prontuario
            const consultaCadastrada = await this.service.cadastrar(dadosProntuario)

            return res.status(201).json({
                message: "Prontuario criado com sucesso",
                prontuario: consultaCadastrada
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
            const dadosParaAtualizar = req.body  as Omit<Prontuario, 'id'>

            const dadosAtualizados = await this.service.atualizar({...dadosParaAtualizar,id})

            return res.status(200).json({
                message:"Dados Atualizados",
                prontuario:dadosAtualizados
                
            });
            
        } catch (error) {
             log(error)

            res.status(400).json({
                error
            })
        }
    }


}


export const prontuarioController = new ProntuarioController(prontuarioService)