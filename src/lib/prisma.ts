import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { logger } from "../utils/logger";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  max: 10, // Adjust based on VM size and database capacity
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "info" },
    { emit: "event", level: "warn" },
    { emit: "event", level: "error" },
  ],
});

prisma.$on("query" as any, (e: any) => {
    logger.debug({ query: e.query, params: e.params, duration: `${e.duration}ms` }, "Prisma Query");
});

prisma.$on("info" as any, (e: any) => {
    logger.info(e.message);
});

prisma.$on("warn" as any, (e: any) => {
    logger.warn(e.message);
});

prisma.$on("error" as any, (e: any) => {
    logger.error(e.message);
});

export { prisma, pool };

export class PrismaService {
  public client = prisma;
}