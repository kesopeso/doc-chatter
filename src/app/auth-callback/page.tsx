'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';
import { Loader2 } from 'lucide-react';

const AuthCallbackPage = () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const origin = searchParams.get('origin');

    trpc.authCallback.useQuery(undefined, {
        onSuccess: ({ success }) => {
            // user is synced to the db, redirect him to the page he came from
            // or to dashboard if there's no data about the origin page
            success && router.push(origin ? `/${origin}` : '/dashboard');
        },
        onError: (err) => {
            err.data?.code === 'UNAUTHORIZED' && router.push('/sign-in');
        },
        retry: true,
        retryDelay: 500,
    });

    return (
        <div className="mt-24 flex w-full justify-center">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
                <h3 className="text-xl font-semibold">
                    Setting up your account...
                </h3>
                <p>You will be redirected automatically.</p>
            </div>
        </div>
    );
};

export default AuthCallbackPage;
