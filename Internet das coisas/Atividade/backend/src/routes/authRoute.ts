import { Router } from "express";
import { createHash } from "../utils/createHash";
import { prisma } from "../prisma/prisma";
import { signTokenAcesso, signTokenRefresh } from "../utils/jwt";
import bcrypt from "bcrypt";
import { authController } from "../controllers/authController";

export const authRoute = Router();

authRoute.post("/cadastro", async (req, res) => {
    return authController.cadastrar(req, res)
})

authRoute.post("/login", async (req, res) => {

    return authController.logar(req, res)
})

authRoute.put("/reset-password", async (req, res) => {
    return authController.resetPassword(req, res)
})