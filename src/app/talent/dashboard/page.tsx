'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Matching } from '../../../lib/types';

export default function TalentDashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [matches, setMatches] = useState<Matching[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMatches, setIsLoadingMatches] = useState(false);
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
            if (parsedUser.role !== 'Talent') {
                router.push('/admin/dashboard');
                return;
            }
            setUser(parsedUser);
            fetchUserMatches();
        } catch (error) {
            console.error('Error parsing user data:', error);
            router.push('/login');
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const fetchUserMatches = async () => {
        setIsLoadingMatches(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/matching/user', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const matchesData = await response.json();
                setMatches(matchesData);
            } else {
                console.error('Failed to fetch user matches');
            }
        } catch (error) {
            console.error('Error fetching user matches:', error);
        } finally {
            setIsLoadingMatches(false);
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

    const activeMatches = matches.filter(match => match.status === 'Active');
    const completedMatches = matches.filter(match => match.status === 'Inactive');

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-instollar-dark">
                    Talent Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                    Welcome back, {user.name} • {user.location}
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Profile Information */}
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

                {/* Match Statistics */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-instollar-dark mb-4">
                        Your Matches
                    </h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Matches:</span>
                            <span className="font-semibold">
                                {isLoadingMatches ? '...' : matches.length}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Active Matches:</span>
                            <span className="font-semibold text-green-600">
                                {isLoadingMatches ? '...' : activeMatches.length}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Completed:</span>
                            <span className="font-semibold text-blue-600">
                                {isLoadingMatches ? '...' : completedMatches.length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Recent Matches */}
                <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-2 lg:col-span-3">
                    <h2 className="text-xl font-semibold text-instollar-dark mb-4">
                        Recent Matches
                    </h2>
                    {isLoadingMatches ? (
                        <div className="text-center py-4">
                            <div className="text-gray-500">Loading matches...</div>
                        </div>
                    ) : matches.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-gray-500 text-lg mb-4">
                                No matches yet
                            </div>
                            <Link
                                href="/jobs"
                                className="bg-instollar-dark text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                Browse Available Jobs
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {matches.slice(0, 3).map((match) => (
                                <div key={match._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-instollar-dark mb-1">
                                                {match.jobId.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-2">
                                                {match.jobId.description.substring(0, 100)}...
                                            </p>
                                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {match.jobId.location}
                                            </div>
                                            <div className="flex items-center">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${match.status === 'Active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {match.status}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    Matched {new Date(match.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {matches.length > 3 && (
                                <div className="text-center pt-4">
                                    <Link
                                        href="/talent"
                                        className="text-instollar-dark hover:underline"
                                    >
                                        View All Matches ({matches.length})
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
