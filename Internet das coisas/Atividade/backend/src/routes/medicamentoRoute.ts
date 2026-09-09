import { Router } from "express";
import { medicamentoController } from "../controllers/MedicamentoController";

export const medicamentoRouter = Router()

medicamentoRouter.get('/medicamentos', async (req, res) => {
  return medicamentoController.listarTdsMedicamentos(req, res)
})

medicamentoRouter.get('/medicamentos/:id', async (req, res) => {
  return medicamentoController.buscarMedicamentoId(req, res)
})

medicamentoRouter.post("/medicamentos", async (req, res) => {
  return medicamentoController.criarMedicamento(req, res)
})

medicamentoRouter.put("/medicamentos/:id", async (req, res) => {
  return medicamentoController.atualizarMedicamento(req, res)
})

medicamentoRouter.delete('/medicamentos/:id', async (req, res) => {
  return medicamentoController.deletarMedicamento(req, res)
})
