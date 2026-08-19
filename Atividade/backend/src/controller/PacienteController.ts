import type { Response,Request } from "express";
import { log } from "node:console";
import type { Paciente } from "../prisma/generated/prisma/client";
import { pacienteService, type PacienteService } from "../services/PacienteServices";


class PacienteController {
    constructor(private readonly service: PacienteService) {
        
    }

    async buscarTodos(req:Request,res:Response){

        const pagina = req.query.pagina ? Number(req.query.pagina): undefined
        const limite = req.query.limite ? Number(req.query.limite): undefined

        try {
            const pacienteBuscados = await this.service.buscarTodos(pagina,limite)

            if (pacienteBuscados.paciente.paciente.length ===0) {

                return res.status(200).json(pacienteBuscados)
                
            }

            
            return res.status(200).json(pacienteBuscados)

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
            const paciente = await this.service.buscarPorId(id)

            if (paciente) {
                return res.status(200).json(paciente)
                
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

            return res.status(200).json(exameDeletado)
            
        } catch (error) {
            log(error)

            res.status(400).json({
                error
            })
            
        }
    }
    async criar(req: Request, res: Response) {

        try {

            const dadosPaciente = req.body as Paciente
            const usuarioCadastrado = await this.service.criar(dadosPaciente)

            return res.status(201).json(usuarioCadastrado)

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
            const dadosParaAtualizar = req.body  as Omit<Paciente, 'id'>

            const dadosAtualizados = await this.service.atualizar({...dadosParaAtualizar,id})

            return res.status(200).json(dadosAtualizados);
            
        } catch (error) {
             log(error)

            res.status(400).json({
                error
            })
        }
    }


}


export const pacienteController = new PacienteController(pacienteService)