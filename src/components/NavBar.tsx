import Link from 'next/link';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { buttonVariants } from '@/components/ui/button';
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { ArrowRight } from 'lucide-react';

type NavBarProps = {};

const NavBar = ({}: NavBarProps) => {
    return (
        <nav className="sticky inset-x-0 top-0 z-30 h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <MaxWidthWrapper>
                <div className="flex h-14 items-center justify-between border-b border-zinc-200">
                    <Link href="/" className="z-40 flex font-semibold">
                        <span>Doc-Chatter</span>
                    </Link>

                    {/*  todo: add mobile navbar */}

                    <div className="hidden items-center space-x-4 sm:flex">
                        <>
                            <Link
                                href="/pricing"
                                className={buttonVariants({
                                    variant: 'ghost',
                                    size: 'sm',
                                })}
                            >
                                Pricing
                            </Link>
                            <LoginLink
                                className={buttonVariants({
                                    variant: 'ghost',
                                    size: 'sm',
                                })}
                            >
                                Sign in
                            </LoginLink>
                            <RegisterLink
                                className={buttonVariants({ size: 'sm' })}
                            >
                                Get started <ArrowRight />
                            </RegisterLink>
                        </>
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    );
};

export default NavBar;
