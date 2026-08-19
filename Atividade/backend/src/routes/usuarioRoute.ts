import { Router } from "express"
import { usuarioController } from "../controllers/usuarioController"


export const usuarioRoute = Router()

usuarioRoute.get('/usuarios', async(_,res)=> {

    return usuarioController.listarTdsUsuarios(_,res)
})

usuarioRoute.get('/usuarios/:id', async(req,res)=> {

    return usuarioController.buscarUsuarioId(req,res)
})

usuarioRoute.post('/usuarios/', async(req,res)=> {

    return usuarioController.criarUsuario(req,res)
})

usuarioRoute.put('/usuarios/:id', async(req,res)=> {

    return usuarioController.atualizarusuario(req,res)
})

usuarioRoute.delete('/usuarios/:id', async(req,res)=> {

    return usuarioController.deletarusuario(req,res)
})