import * as generatedPrisma from "./generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123@localhost:5432/faxina_db?schema=public';

const adapter = new PrismaPg({ connectionString });
const { PrismaClient } = generatedPrisma;
export const prisma: any = new PrismaClient({ adapter, log: ['query'] });
