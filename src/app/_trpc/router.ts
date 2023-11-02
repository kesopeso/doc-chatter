import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError, initTRPC } from '@trpc/server';
import { z } from 'zod';

const { router, procedure: publicProcedure, middleware } = initTRPC.create();

const isAuth = middleware(async (opts) => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if (!user || !user.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return opts.next({
        ctx: {
            userId: user.id,
            user,
        },
    });
});

const privateProcedure = publicProcedure.use(isAuth);

export const appRouter = router({
    authCallback: publicProcedure.query(async () => {
        const { getUser } = getKindeServerSession();
        const user = getUser();

        if (!user.id || !user.email) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }

        // check if the user is in db
        const dbUser = await db.user.findFirst({ where: { id: user.id } });

        if (!dbUser) {
            // create user in db
            await db.user.create({ data: { id: user.id, email: user.email } });
        }

        return { success: true };
    }),

    getUserFiles: privateProcedure.query(async ({ ctx }) => {
        const { userId } = ctx;
        return await db.file.findMany({ where: { userId } });
    }),

    getFile: privateProcedure
        .input(z.object({ key: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { userId } = ctx;

            const file = await db.file.findFirst({
                where: { key: input.key, userId },
            });

            if (!file) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            return file;
        }),

    deleteFile: privateProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { userId } = ctx;
            const file = await db.file.findFirst({
                where: { id: input.id, userId },
            });

            if (!file) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            await db.file.delete({ where: { id: input.id } });
        }),
});

export type AppRouter = typeof appRouter;
