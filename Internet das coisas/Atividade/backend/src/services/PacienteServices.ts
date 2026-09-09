import type { Paciente } from "../prisma/generated/prisma/client";
import { pacienteRepository, PacienteRepository } from "../repositories/PacienteRepository";




export class PacienteService {
    constructor(private readonly repository: PacienteRepository) {

        this.repository = repository
    }

    async criar(dadosPaciente: Paciente) {

        if (!dadosPaciente) {

            throw new Error("Dados invalidos")
        }

        return {
            paciente: await this.repository.criar(dadosPaciente),
            message: "Usuario criado com sucesso"
        }

    }

    async buscarTodos(pagina?: number, limite?: number) {

        const buscarDados = await this.repository.buscarTodos(pagina, limite)

        if (buscarDados.paciente.length === 0) {

            return {
                paciente: buscarDados,
                message: "Não tem pacientes cadastrados"
            }


        }

        return {
            paciente: buscarDados,
            message: "Pacientes encontrados"
        }


    }


    async buscarPorId(id: number) {

        const pacienteBuscado = await this.repository.buscarPorId(id)

        if (!pacienteBuscado?.cpf) {

            return {
                paciente: pacienteBuscado,
                message: "Paciente não encontrado"
            }

        }

        return {
            paciente: pacienteBuscado,
            message: "Paciente encontrado"
        }

    }

    async atualizar(dadosPaciente: Paciente) {


        if (!dadosPaciente) {
            throw new Error("Dados invalidos")
        }

        const buscarDados = await this.buscarPorId(dadosPaciente.id)

        if (!buscarDados) {

            throw new Error("Paciente nao encontrado")

        }

        const atualizarDados = await this.repository.atualizar(dadosPaciente)

        return {
            paciente: atualizarDados,
            message: "Paciente Atualizado"
        }


    }


    async deletar(id: number) {


        const pacienteParaDeletar = await this.repository.buscarPorId(id)

        if (!pacienteParaDeletar) return {
            paciente: pacienteParaDeletar,
            message: "Paciente não encontrado"
        }

        const deletandoPaciente = await this.repository.deletar(id)
        
        return {
            paciente: deletandoPaciente,
            message: "Paciente Deletado"
        }


    }





}

export const pacienteService = new PacienteService(pacienteRepository)