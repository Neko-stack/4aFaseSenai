import { consultaRepository, type ConsultaRepository } from "../repository/consultaRepository";

export class ConsultaService {

    constructor(private readonly repository: ConsultaRepository) { }

    async listarTdsConsultas( 
        pagina?: number, 
        limite?: number, 
        pacienteId?: number 
    ) {    
        const consultas = await this.repository.listarTdsConsultas(
            pagina,
            limite,
            pacienteId
        )

        return consultas
    }

    async buscarConsultaId(idConsulta: number) {
        const consulta = await this.repository.buscarConsultaId(idConsulta)
        return consulta
    }

    async criarConsulta(ddsConsulta: any) {
        const consultaCriada = await this.repository.criarConsulta({
            motivo: ddsConsulta.motivo || "",
            data_consulta: new Date(ddsConsulta.data_consulta || new Date()),
            observacoes: ddsConsulta.observacoes || "",
            medico_responsavel_id: Number(ddsConsulta.medico_responsavel_id),
            paciente_id: ddsConsulta.paciente_id!,
        })

        return consultaCriada
    }

    async atualizarConsulta(idConsulta: number, atualizarDados: any) {
        const ddsConsultaAtualizados = await this.repository.atualizarConsulta(idConsulta, atualizarDados)
        return ddsConsultaAtualizados
    }

    async deletarConsulta(idConsulta: number) {
        const consultaDeletada = await this.repository.deletarConsulta(idConsulta)
        return consultaDeletada
    }
}

export const consultaService = new ConsultaService(consultaRepository);
