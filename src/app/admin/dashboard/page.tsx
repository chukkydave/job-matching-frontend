'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useApi } from '../../../hooks/useApi';
import { api, getAuthToken } from '../../../utils/api';
import { PageLayout, LoadingState } from '../../../components/shared/layout/PageLayout';
import { ResponsiveGrid } from '../../../components/shared/layout/ResponsiveGrid';
import { StatCard } from '../../../components/shared/cards/Card';

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

export default function AdminDashboardPage() {
    const { user, isLoading: authLoading } = useAuth('Admin');
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
    const { execute: fetchStats, isLoading: statsLoading } = useApi<DashboardStats>({
        showErrorToast: false,
        showSuccessToast: false,
    });

    const loadStats = useCallback(() => {
        const token = getAuthToken();
        if (!token) return;

        fetchStats(
            () => api.get('/admin/stats', token),
            (data) => setStats(data)
        );
    }, [fetchStats]);

    useEffect(() => {
        if (!authLoading && user) {
            loadStats();
        }
    }, [authLoading, user, loadStats]);

    if (authLoading) {
        return <LoadingState message="Loading dashboard..." />;
    }

    if (!user) {
        return null;
    }

    // Define icons for stats
    const jobIcon = (
        <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
    );

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

    const matchIcon = (
        <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    );

    const activeIcon = (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const completedIcon = (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );

    const verifiedIcon = (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    );

    const unverifiedIcon = (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
    );

    return (
        <PageLayout
            title="Admin Dashboard"
            subtitle={`Welcome back, ${user.name} • ${user.location}`}
        >
            <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3, xl: 4 }}>
                <StatCard
                    title="Total Jobs"
                    value={statsLoading ? '...' : stats.totalJobs}
                    icon={jobIcon}
                />
                <StatCard
                    title="Total Users"
                    value={statsLoading ? '...' : stats.totalUsers}
                    icon={userIcon}
                />
                <StatCard
                    title="Talents"
                    value={statsLoading ? '...' : stats.totalTalents}
                    icon={talentIcon}
                />
                <StatCard
                    title="Admins"
                    value={statsLoading ? '...' : stats.totalAdmins}
                    icon={adminIcon}
                />
                <StatCard
                    title="Total Matches"
                    value={statsLoading ? '...' : stats.totalMatches}
                    icon={matchIcon}
                />
                <StatCard
                    title="Active Matches"
                    value={statsLoading ? '...' : stats.activeMatches}
                    icon={activeIcon}
                />
                <StatCard
                    title="Completed Matches"
                    value={statsLoading ? '...' : stats.completedMatches}
                    icon={completedIcon}
                />
                <StatCard
                    title="Verified Users"
                    value={statsLoading ? '...' : stats.verifiedUsers}
                    icon={verifiedIcon}
                />
                <StatCard
                    title="Unverified Users"
                    value={statsLoading ? '...' : stats.unverifiedUsers}
                    icon={unverifiedIcon}
                />
            </ResponsiveGrid>
        </PageLayout>
    );
}
