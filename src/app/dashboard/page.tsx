'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);

            // Redirect to role-specific dashboard
            if (parsedUser.role === 'Admin') {
                router.push('/admin/dashboard');
            } else if (parsedUser.role === 'Talent') {
                router.push('/talent/dashboard');
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            router.push('/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-lg">Redirecting to your dashboard...</div>
        </div>
    );
}
