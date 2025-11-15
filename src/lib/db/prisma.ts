// /lib/db/prisma.ts

import { PrismaClient } from "@prisma/client";

// This setup prevents creating new PrismaClient instances during hot-reloading in development.
// In production, it will simply create one instance.

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
