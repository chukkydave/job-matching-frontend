'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { api, getAuthToken } from '@/utils/api';
import { PageLayout, LoadingState, EmptyState } from '@/components/shared/layout/PageLayout';
import { ResponsiveGrid } from '@/components/shared/layout/ResponsiveGrid';
import { Card, StatCard } from '@/components/shared/cards/Card';
import { Button } from '@/components/shared/buttons/Button';
import { Modal } from '@/components/shared/modals/Modal';

export default function AdminUsersPage() {
    const { isLoading: authLoading } = useAuth('Admin');
    const [users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState<'all' | 'talent' | 'admin'>('all');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const { execute: fetchUsers, isLoading: usersLoading } = useApi<User[]>({
        showErrorToast: false,
        showSuccessToast: false,
    });

    const loadUsers = useCallback(() => {
        const token = getAuthToken();
        if (!token) return;

        fetchUsers(
            () => api.get('/users', token),
            (data) => setUsers(data)
        );
    }, [fetchUsers]);

    useEffect(() => {
        if (!authLoading) {
            loadUsers();
        }
    }, [authLoading, loadUsers]);

    const filteredUsers = users.filter(user => {
        if (filter === 'all') return true;
        return user.role.toLowerCase() === filter;
    });

    const talentCount = users.filter(user => user.role === 'Talent').length;
    const adminCount = users.filter(user => user.role === 'Admin').length;

    const handleViewProfile = (user: User) => {
        setSelectedUser(user);
        setShowProfileModal(true);
    };

    if (authLoading || usersLoading) {
        return <LoadingState message="Loading users..." />;
    }

    // Define icons for stats
    const userIcon = (
        <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
    );

    const talentIcon = (
        <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );

    const adminIcon = (
        <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    );

    return (
        <PageLayout
            title="User Management"
            subtitle="Manage all registered users and their roles"
        >

            {/* Stats */}
            <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3 }} className="mb-6 sm:mb-8">
                <StatCard
                    title="Total Users"
                    value={users.length}
                    icon={userIcon}
                />
                <StatCard
                    title="Talents"
                    value={talentCount}
                    icon={talentIcon}
                />
                <StatCard
                    title="Admins"
                    value={adminCount}
                    icon={adminIcon}
                />
            </ResponsiveGrid>

            {/* Filter Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex flex-wrap space-x-2 sm:space-x-8">
                        <Button
                            variant={filter === 'all' ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setFilter('all')}
                            className="border-b-2 border-transparent hover:border-gray-300"
                        >
                            All Users ({users.length})
                        </Button>
                        <Button
                            variant={filter === 'talent' ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setFilter('talent')}
                            className="border-b-2 border-transparent hover:border-gray-300"
                        >
                            Talents ({talentCount})
                        </Button>
                        <Button
                            variant={filter === 'admin' ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setFilter('admin')}
                            className="border-b-2 border-transparent hover:border-gray-300"
                        >
                            Admins ({adminCount})
                        </Button>
                    </nav>
                </div>
            </div>

            {/* Users List */}
            <Card>
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-instollar-dark">
                        {filter === 'all' ? 'All Users' : filter === 'talent' ? 'Talents' : 'Admins'}
                    </h2>
                </div>

                <div className="p-6">
                    {filteredUsers.length === 0 ? (
                        <EmptyState
                            title={`No ${filter === 'all' ? 'users' : filter} found`}
                        />
                    ) : (
                        <div className="space-y-4">
                            {filteredUsers.map((user) => (
                                <Card key={user._id} hover className="p-4">
                                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                                        <div className="flex items-start space-x-4 flex-1">
                                            <div className="w-12 h-12 bg-instollar-yellow rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-instollar-dark font-bold text-lg">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center mb-2 gap-2">
                                                    <h3 className="text-lg font-semibold text-instollar-dark">
                                                        {user.name}
                                                    </h3>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium self-start ${user.role === 'Admin'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 text-sm mb-2 truncate">{user.email}</p>
                                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span className="truncate">{user.location}</span>
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
                                        <div className="flex justify-end lg:ml-4">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleViewProfile(user)}
                                            >
                                                View Profile
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            {/* User Profile Modal */}
            <Modal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                title="User Profile"
                size="lg"
                footer={
                    <Button
                        variant="secondary"
                        onClick={() => setShowProfileModal(false)}
                        fullWidth
                    >
                        Close
                    </Button>
                }
            >
                {selectedUser && (
                    <div className="space-y-6">
                        {/* User Avatar and Basic Info */}
                        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="w-20 h-20 bg-instollar-yellow rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-instollar-dark font-bold text-2xl">
                                    {selectedUser.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center mb-2 gap-2">
                                    <h4 className="text-2xl font-bold text-instollar-dark">
                                        {selectedUser.name}
                                    </h4>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium self-start ${selectedUser.role === 'Admin'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {selectedUser.role}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-lg mb-2 break-all">{selectedUser.email}</p>
                                <div className="flex items-center text-gray-500 mb-2">
                                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="truncate">{selectedUser.location}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className={`w-3 h-3 rounded-full mr-2 ${selectedUser.isEmailVerified ? 'bg-green-500' : 'bg-red-500'
                                        }`}></span>
                                    <span className="text-sm text-gray-600">
                                        {selectedUser.isEmailVerified ? 'Email Verified' : 'Email Not Verified'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Skills Section */}
                        {selectedUser.skills && selectedUser.skills.length > 0 && (
                            <div>
                                <h5 className="text-lg font-semibold text-instollar-dark mb-3">Skills</h5>
                                <div className="flex flex-wrap gap-2">
                                    {selectedUser.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-instollar-yellow text-instollar-dark px-3 py-1 rounded-full text-sm font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Account Information */}
                        <div>
                            <h5 className="text-lg font-semibold text-instollar-dark mb-3">Account Information</h5>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                    <span className="text-gray-600">User ID:</span>
                                    <span className="font-mono text-sm text-gray-800 break-all">{selectedUser._id}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                    <span className="text-gray-600">Role:</span>
                                    <span className="font-medium">{selectedUser.role}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                    <span className="text-gray-600">Email Status:</span>
                                    <span className={`font-medium ${selectedUser.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                                        {selectedUser.isEmailVerified ? 'Verified' : 'Not Verified'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </PageLayout>
    );
}
