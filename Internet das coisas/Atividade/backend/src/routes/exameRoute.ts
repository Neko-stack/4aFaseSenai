import { Router } from "express";
import { exameController } from "../controllers/exameController";

export const exameRouter = Router()

exameRouter.get('/exames', async (_, res) => {
  return exameController.listarTdsExames(_, res)
})

exameRouter.get('/exames/:id', async (req, res) => {
  return exameController.buscarExameId(req, res)
})

exameRouter.post("/exames", async (req, res) => {
  return exameController.criarExame(req, res)
})

exameRouter.put("/exames/:id", async (req, res) => {
  return exameController.atualizarExame(req, res)
})

exameRouter.delete('/exames/:id', async (req, res) => {
  return exameController.deletarExame(req, res)
})