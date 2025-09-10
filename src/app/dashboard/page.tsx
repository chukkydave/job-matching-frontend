'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '../../lib/types';

interface DashboardStats {
    totalJobs: number;
    totalUsers: number;
    totalTalents: number;
    totalAdmins: number;
    totalMatches: number;
    activeMatches: number;
    completedMatches: number;
    verifiedUsers: number;
    unverifiedUsers: number;
}

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<DashboardStats>({
        totalJobs: 0,
        totalUsers: 0,
        totalTalents: 0,
        totalAdmins: 0,
        totalMatches: 0,
        activeMatches: 0,
        completedMatches: 0,
        verifiedUsers: 0,
        unverifiedUsers: 0,
    });
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

            if (parsedUser.role === 'Admin') {
                fetchAdminStats();
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            router.push('/login');
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const fetchAdminStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const statsData = await response.json();
                setStats(statsData);
            } else {
                console.error('Failed to fetch admin stats');
            }
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        }
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
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-instollar-dark">
                    Welcome back, {user.name}!
                </h1>
                <p className="text-gray-600 mt-2">
                    {user.role} • {user.location}
                </p>
            </div>

            {user.role === 'Admin' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Jobs Stats */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-instollar-yellow rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-instollar-dark">{stats.totalJobs}</p>
                                <p className="text-gray-600">Total Jobs</p>
                            </div>
                        </div>
                    </div>

                    {/* Users Stats */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-instollar-yellow rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-instollar-dark">{stats.totalUsers}</p>
                                <p className="text-gray-600">Total Users</p>
                            </div>
                        </div>
                    </div>

                    {/* Talents Stats */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-instollar-yellow rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-instollar-dark">{stats.totalTalents}</p>
                                <p className="text-gray-600">Talents</p>
                            </div>
                        </div>
                    </div>

                    {/* Admins Stats */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-instollar-yellow rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-instollar-dark">{stats.totalAdmins}</p>
                                <p className="text-gray-600">Admins</p>
                            </div>
                        </div>
                    </div>

                    {/* Total Matches */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-instollar-yellow rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-instollar-dark">{stats.totalMatches}</p>
                                <p className="text-gray-600">Total Matches</p>
                            </div>
                        </div>
                    </div>

                    {/* Active Matches */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">{stats.activeMatches}</p>
                                <p className="text-gray-600">Active Matches</p>
                            </div>
                        </div>
                    </div>

                    {/* Completed Matches */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-600">{stats.completedMatches}</p>
                                <p className="text-gray-600">Completed Matches</p>
                            </div>
                        </div>
                    </div>

                    {/* Verified Users */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">{stats.verifiedUsers}</p>
                                <p className="text-gray-600">Verified Users</p>
                            </div>
                        </div>
                    </div>

                    {/* Unverified Users */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-red-600">{stats.unverifiedUsers}</p>
                                <p className="text-gray-600">Unverified Users</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
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
                                    {user.skills && user.skills.map((skill, index) => (
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
                            <Link
                                href="/talent"
                                className="block w-full bg-instollar-yellow text-instollar-dark text-center py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                My Matches
                            </Link>
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
            )}
        </div>
    );
}
