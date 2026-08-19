import { Router } from "express";
import { pacienteController } from "../controllers/pacienteController";

export const pacienteRouter = Router()

pacienteRouter.get('/pacientes', async (_, res) => {
  return pacienteController.listarTdsPacientes(_, res)
})

pacienteRouter.get('/pacientes/:id', async (req, res) => {
  return pacienteController.buscarPacienteId(req, res)
})

pacienteRouter.post("/pacientes", async (req, res) => {
  console.log("Entrou na rota POST /pacientes")
  return pacienteController.criarPaciente(req, res)
})

pacienteRouter.put("/pacientes/:id", async (req, res) => {
  return pacienteController.atualizarPaciente(req, res)
})

pacienteRouter.delete('/pacientes/:id', async (req, res) => {
  return pacienteController.deletarPaciente(req, res)
})
