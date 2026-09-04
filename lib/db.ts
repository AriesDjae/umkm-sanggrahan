import { PrismaClient } from "@prisma/client";

const globalUntukPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalUntukPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalUntukPrisma.prisma = db;
