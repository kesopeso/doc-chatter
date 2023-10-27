import { useRouter, useSearchParams } from 'next/navigation';
import { trpc } from '../_trpc/client';

const AuthCallbackPage = async () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const origin = searchParams.get('origin');

    const { data, isLoading } = trpc.authCallback.useQuery(undefined, {
        onSuccess: ({ success }) => {
            if (success) {
                // user is synced to the db
                router.push(origin ? `/${origin}` : '/dashboard');
            }
        },
    });
};

export default AuthCallbackPage;
