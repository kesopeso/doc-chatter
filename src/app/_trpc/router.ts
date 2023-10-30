import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError, initTRPC } from '@trpc/server';

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
});

export type AppRouter = typeof appRouter;
