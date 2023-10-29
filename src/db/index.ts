import { PrismaClient } from '@prisma/client';

declare global {
    // eslint-disable-next-line no-var
    var cachedPrisma: PrismaClient;
}

const isProductionEnv = process.env.NODE_ENV === 'production';

if (!isProductionEnv) {
    global.cachedPrisma ||= new PrismaClient();
}

const prisma = isProductionEnv ? new PrismaClient() : global.cachedPrisma;

export const db = prisma;
