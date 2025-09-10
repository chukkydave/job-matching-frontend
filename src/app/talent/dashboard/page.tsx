'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { api, getAuthToken } from '@/utils/api';
import { PageLayout, LoadingState } from '@/components/shared/layout/PageLayout';
import { ResponsiveGrid } from '@/components/shared/layout/ResponsiveGrid';
import { Card, StatCard } from '@/components/shared/cards/Card';
import { Button } from '@/components/shared/buttons/Button';

interface TalentStats {
    totalMatches: number;
    activeMatches: number;
    completedMatches: number;
    recentMatches: number;
    totalJobs: number;
    matchingJobs: number;
    jobsInLocation: number;
    matchSuccessRate: number;
    profileCompleteness: number;
}

interface Match {
    _id: string;
    status: string;
    createdAt: string;
    jobId: {
        title: string;
        description: string;
        location: string;
    };
}

export default function TalentDashboardPage() {
    const { user, isLoading: authLoading } = useAuth('Talent');
    const [stats, setStats] = useState<TalentStats | null>(null);
    const [recentMatches, setRecentMatches] = useState<Match[]>([]);

    const { execute: fetchStats, isLoading: statsLoading } = useApi<TalentStats>({
        showErrorToast: false,
        showSuccessToast: false,
    });

    const { execute: fetchMatches, isLoading: matchesLoading } = useApi<Match[]>({
        showErrorToast: false,
        showSuccessToast: false,
    });

    const loadDashboardData = useCallback(() => {
        const token = getAuthToken();
        if (!token) return;

        // Fetch talent statistics
        fetchStats(
            () => api.get('/talent/stats', token),
            (data) => setStats(data)
        );

        // Fetch recent matches
        fetchMatches(
            () => api.get('/talent/matches', token),
            (data) => setRecentMatches(data.slice(0, 3)) // Get only first 3 for dashboard
        );
    }, [fetchStats, fetchMatches]);

    useEffect(() => {
        if (!authLoading && user) {
            loadDashboardData();
        }
    }, [authLoading, user, loadDashboardData]);

    if (authLoading || statsLoading) {
        return <LoadingState message="Loading dashboard..." />;
    }

    if (!user || !stats) {
        return null;
    }

    return (
        <PageLayout
            title="Talent Dashboard"
            subtitle={`Welcome back, ${user.name} • ${user.location}`}
        >

            {/* Stats Grid */}
            <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3 }} className="mb-6 sm:mb-8">
                <StatCard
                    title="Total Matches"
                    value={stats.totalMatches}
                    icon={
                        <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Active Matches"
                    value={stats.activeMatches}
                    icon={
                        <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Success Rate"
                    value={`${stats.matchSuccessRate}%`}
                    icon={
                        <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    }
                />
                <StatCard
                    title="Jobs Matching Skills"
                    value={stats.matchingJobs}
                    icon={
                        <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                        </svg>
                    }
                />
                <StatCard
                    title="Jobs in Location"
                    value={stats.jobsInLocation}
                    icon={
                        <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Profile Complete"
                    value={`${stats.profileCompleteness}%`}
                    icon={
                        <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    }
                />
            </ResponsiveGrid>

        </PageLayout>
    );
}
