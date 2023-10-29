import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from '@/app/_trpc/router';

export const trpc = createTRPCReact<AppRouter>({});
