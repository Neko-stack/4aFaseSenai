import { verificarTokenAcesso } from "../utils/jwt";
import type {
    Response, Request, NextFunction
} from "express";
export function auth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "missing token"
        })
    }
    try {
        const token = header.slice("Bearer ".length)
        const payload = verificarTokenAcesso(token)
        console.log(payload)
        if (!payload) return res.status(401).json({
            error: "invalid token"
        })
        next();
    } catch {
        return res.status(401).json({
            error: "invalid or expired token"
        })
    }
}