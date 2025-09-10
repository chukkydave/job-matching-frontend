'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@/lib/types';

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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
            setUser(parsedUser);
        } catch (error) {
            console.error('Error parsing user data:', error);
            router.push('/login');
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-instollar-dark">
                            Welcome back, {user.name}!
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {user.role} • {user.location}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* User Info Card */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-instollar-dark mb-4">
                            Profile Information
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <span className="text-sm text-gray-500">Email:</span>
                                <p className="font-medium">{user.email}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Role:</span>
                                <p className="font-medium">{user.role}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Location:</span>
                                <p className="font-medium">{user.location}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Skills:</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {user.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-instollar-yellow text-instollar-dark px-2 py-1 rounded text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-instollar-dark mb-4">
                            Quick Actions
                        </h2>
                        <div className="space-y-3">
                            <Link
                                href="/jobs"
                                className="block w-full bg-instollar-dark text-white text-center py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                Browse Jobs
                            </Link>
                            {user.role === 'Admin' && (
                                <Link
                                    href="/admin"
                                    className="block w-full bg-instollar-yellow text-instollar-dark text-center py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                                >
                                    Admin Panel
                                </Link>
                            )}
                            {user.role === 'Talent' && (
                                <Link
                                    href="/talent"
                                    className="block w-full bg-instollar-yellow text-instollar-dark text-center py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                                >
                                    My Matches
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-instollar-dark mb-4">
                            Your Stats
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Profile Views:</span>
                                <span className="font-semibold">0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Applications:</span>
                                <span className="font-semibold">0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Matches:</span>
                                <span className="font-semibold">0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
