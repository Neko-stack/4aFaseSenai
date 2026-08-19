import { Router } from "express";
import { prontuarioController } from "../controllers/prontuarioController";

export const prontuarioRouter = Router()

prontuarioRouter.get('/prontuarios', async (req, res) => {
  return prontuarioController.listarTdsProntuarios(req, res)
})

prontuarioRouter.get('/prontuarios/:id', async (req, res) => {
  return prontuarioController.buscarProntuarioId(req, res)
})

prontuarioRouter.post("/prontuarios", async (req, res) => {
  return prontuarioController.criarProntuario(req, res)
})

prontuarioRouter.put("/prontuarios/:id", async (req, res) => {
  return prontuarioController.atualizarProntuario(req, res)
})

prontuarioRouter.delete('/prontuarios/:id', async (req, res) => {
  return prontuarioController.deletarProntuario(req, res)
})
