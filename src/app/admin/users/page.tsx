'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<'all' | 'talent' | 'admin'>('all');
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            if (parsedUser.role !== 'Admin') {
                router.push('/dashboard');
                return;
            }
            fetchUsers();
        } catch (error) {
            console.error('Error parsing user data:', error);
            router.push('/login');
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                setError('Failed to load users');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        if (filter === 'all') return true;
        return user.role.toLowerCase() === filter;
    });

    const talentCount = users.filter(user => user.role === 'Talent').length;
    const adminCount = users.filter(user => user.role === 'Admin').length;

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-600">Loading users...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-instollar-dark mb-2">
                        User Management
                    </h1>
                    <p className="text-gray-600">
                        Manage all registered users and their roles
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-instollar-yellow rounded-lg flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-instollar-dark">{users.length}</p>
                            <p className="text-gray-600">Total Users</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-instollar-yellow rounded-lg flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-instollar-dark">{talentCount}</p>
                            <p className="text-gray-600">Talents</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-instollar-yellow rounded-lg flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-instollar-dark">{adminCount}</p>
                            <p className="text-gray-600">Admins</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setFilter('all')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${filter === 'all'
                                    ? 'border-instollar-dark text-instollar-dark'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            All Users ({users.length})
                        </button>
                        <button
                            onClick={() => setFilter('talent')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${filter === 'talent'
                                    ? 'border-instollar-dark text-instollar-dark'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Talents ({talentCount})
                        </button>
                        <button
                            onClick={() => setFilter('admin')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${filter === 'admin'
                                    ? 'border-instollar-dark text-instollar-dark'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Admins ({adminCount})
                        </button>
                    </nav>
                </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-instollar-dark">
                        {filter === 'all' ? 'All Users' : filter === 'talent' ? 'Talents' : 'Admins'}
                    </h2>
                </div>

                {error && (
                    <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                        <div className="text-red-700">{error}</div>
                    </div>
                )}

                <div className="p-6">
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-gray-500 text-lg">
                                No {filter === 'all' ? 'users' : filter} found
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredUsers.map((user) => (
                                <div key={user._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-instollar-yellow rounded-full flex items-center justify-center">
                                                <span className="text-instollar-dark font-bold text-lg">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    <h3 className="text-lg font-semibold text-instollar-dark mr-3">
                                                        {user.name}
                                                    </h3>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'Admin'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 text-sm mb-2">{user.email}</p>
                                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {user.location}
                                                </div>
                                                {user.skills && user.skills.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mb-2">
                                                        {user.skills.slice(0, 3).map((skill, index) => (
                                                            <span
                                                                key={index}
                                                                className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                        {user.skills.length > 3 && (
                                                            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
                                                                +{user.skills.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <span className={`w-2 h-2 rounded-full mr-2 ${user.isEmailVerified ? 'bg-green-500' : 'bg-red-500'
                                                        }`}></span>
                                                    {user.isEmailVerified ? 'Email Verified' : 'Email Not Verified'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition-colors">
                                                View Profile
                                            </button>
                                            {user.role === 'Talent' && (
                                                <button className="bg-instollar-dark text-white px-3 py-1 rounded text-sm hover:bg-opacity-90 transition-colors">
                                                    Create Match
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
