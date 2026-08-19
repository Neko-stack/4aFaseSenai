import { Router } from "express";
import { consultaController } from "../controllers/consultaController";

export const consultaRouter = Router()

consultaRouter.get('/consultas', async (_, res) => {
  return consultaController.listarTdsConsultas(_, res)
})

consultaRouter.get('/consultas/:id', async (req, res) => {
  return consultaController.buscarConsultaId(req, res)
})

consultaRouter.post("/consultas", async (req, res) => {
  return consultaController.criarConsulta(req, res)
})

consultaRouter.put("/consultas/:id", async (req, res) => {
  return consultaController.atualizarConsulta(req, res)
})

consultaRouter.delete('/consultas/:id', async (req, res) => {
  return consultaController.deletarConsulta(req, res)
})
