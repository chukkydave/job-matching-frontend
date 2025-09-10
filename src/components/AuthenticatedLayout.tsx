'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { User } from '@/lib/types';

interface AuthenticatedLayoutProps {
    children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Routes that don't need authentication
    const publicRoutes = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password', '/'];

    useEffect(() => {
        checkAuth();
    }, [pathname]);

    const checkAuth = () => {
        // Skip auth check for public routes
        if (publicRoutes.includes(pathname)) {
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
        } catch (error) {
            console.error('Error parsing user data:', error);
            router.push('/login');
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading for auth routes
    if (isLoading && !publicRoutes.includes(pathname)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-lg text-gray-600">Loading...</div>
            </div>
        );
    }

    // Show public layout for public routes
    if (publicRoutes.includes(pathname)) {
        return <>{children}</>;
    }

    // Show authenticated layout with sidebar
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar user={user!} />
            <main className="flex-1 overflow-auto">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
