const saltRound = 10;
import bcrypt from "bcrypt"

export async function createHash(senha: string) {
    return await bcrypt.hash(senha, saltRound)
}