'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Matching } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { api, getAuthToken } from '@/utils/api';
import { PageLayout, LoadingState, EmptyState } from '@/components/shared/layout/PageLayout';
import { ResponsiveGrid } from '@/components/shared/layout/ResponsiveGrid';
import { Card, StatCard } from '@/components/shared/cards/Card';
import { Button } from '@/components/shared/buttons/Button';

export default function TalentMatchesPage() {
    const { user, isLoading: authLoading } = useAuth('Talent');
    const [matchings, setMatchings] = useState<Matching[]>([]);

    const { execute: fetchMatches, isLoading: matchesLoading } = useApi<Matching[]>({
        showErrorToast: false,
        showSuccessToast: false,
    });

    const loadMatches = useCallback(() => {
        const token = getAuthToken();
        if (!token) return;

        fetchMatches(
            () => api.get('/talent/matches', token),
            (data) => setMatchings(data),
            () => setMatchings([])
        );
    }, [fetchMatches]);

    useEffect(() => {
        if (!authLoading && user) {
            loadMatches();
        }
    }, [authLoading, user, loadMatches]);

    if (authLoading || matchesLoading) {
        return <LoadingState message="Loading your matches..." />;
    }

    if (!user) {
        return null;
    }

    const activeMatches = matchings.filter(m => m.status === 'Active');

    return (
        <PageLayout
            title="My Matched Jobs"
            subtitle="View the jobs you've been matched with"
        >

            {/* Stats */}
            <ResponsiveGrid cols={{ default: 1, sm: 2 }} className="mb-6 sm:mb-8">
                <StatCard
                    title="Total Matches"
                    value={matchings.length}
                    icon={
                        <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                        </svg>
                    }
                />
                <StatCard
                    title="Active Matches"
                    value={activeMatches.length}
                    icon={
                        <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </ResponsiveGrid>

            {/* Matched Jobs */}
            <Card>
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-instollar-dark">
                        Your Job Matches
                    </h2>
                </div>

                <div className="p-6">
                    {matchings.length === 0 ? (
                        <EmptyState
                            title="No matches yet"
                            description="You haven't been matched with any jobs yet. Keep your profile updated and check back later for new opportunities."
                        />
                    ) : (
                        <div className="space-y-4">
                            {matchings.map((match) => (
                                <Card key={match._id} hover className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${match.status === 'Active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {match.status}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Matched on {new Date(match.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-semibold text-instollar-dark mb-2">
                                                {match.jobId.title}
                                            </h3>

                                            <p className="text-gray-600 mb-4 line-clamp-3">
                                                {match.jobId.description}
                                            </p>

                                            <div className="flex items-center text-sm text-gray-500 mb-3">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {match.jobId.location}
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {match.jobId.requiredSkills.slice(0, 4).map((skill: string, index: number) => (
                                                    <span
                                                        key={index}
                                                        className="bg-instollar-yellow text-instollar-dark text-sm px-3 py-1 rounded-full"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                                {match.jobId.requiredSkills.length > 4 && (
                                                    <span className="bg-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full">
                                                        +{match.jobId.requiredSkills.length - 4} more
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-sm text-gray-500">
                                                Posted by {match.jobId.createdBy.name} •
                                                Matched by {match.matchedBy.name}
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:ml-6">
                                            <Link href={`/jobs/${match.jobId._id}`}>
                                                <Button variant="secondary" size="sm" fullWidth>
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </PageLayout>
    );
}
