'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

interface ConditionalLayoutProps {
    children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const pathname = usePathname();

    // Auth pages that shouldn't show the header
    const authPages = ['/login', '/register', '/verify-email', '/forgot-password'];
    const isAuthPage = authPages.includes(pathname);

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <main className="min-h-screen">
                {children}
            </main>
        </>
    );
}
