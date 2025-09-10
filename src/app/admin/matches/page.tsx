'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import { Matching, Job, User } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { api, getAuthToken } from '@/utils/api';
import { PageLayout, LoadingState, EmptyState } from '@/components/shared/layout/PageLayout';
import { ResponsiveGrid } from '@/components/shared/layout/ResponsiveGrid';
import { Card, StatCard } from '@/components/shared/cards/Card';
import { Button } from '@/components/shared/buttons/Button';
import { Modal } from '@/components/shared/modals/Modal';

export default function AdminMatchesPage() {
    const { isLoading: authLoading } = useAuth('Admin');
    const [matchings, setMatchings] = useState<Matching[]>([]);
    const [talents, setTalents] = useState<User[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [showMatchForm, setShowMatchForm] = useState(false);
    const [selectedJob, setSelectedJob] = useState('');
    const [selectedTalent, setSelectedTalent] = useState('');
    const [filteredTalents, setFilteredTalents] = useState<User[]>([]);
    
    const { execute: fetchMatchings, isLoading: matchingsLoading } = useApi<Matching[]>({
        showErrorToast: false,
        showSuccessToast: false,
    });
    const { execute: fetchTalents, isLoading: talentsLoading } = useApi<User[]>({
        showErrorToast: false,
        showSuccessToast: false,
    });
    const { execute: fetchJobs, isLoading: jobsLoading } = useApi<Job[]>({
        showErrorToast: false,
        showSuccessToast: false,
    });
    const { execute: createMatch, isLoading: isSubmitting } = useApi({
        successMessage: 'Match created successfully!',
    });

    const loadData = useCallback(() => {
        const token = getAuthToken();
        if (!token) return;

        // Fetch matchings
        fetchMatchings(
            () => api.get('/matching', token),
            (data) => setMatchings(data)
        );

        // Fetch talents
        fetchTalents(
            () => api.get('/users', token),
            (data) => setTalents(data.filter((user: User) => user.role === 'Talent'))
        );

        // Fetch jobs
        fetchJobs(
            () => api.get('/jobs'),
            (data) => setJobs(data)
        );
    }, [fetchMatchings, fetchTalents, fetchJobs]);

    useEffect(() => {
        if (!authLoading) {
            loadData();
        }
    }, [authLoading, loadData]);

    const handleJobChange = (jobId: string) => {
        setSelectedJob(jobId);
        setSelectedTalent('');

        if (jobId) {
            const job = jobs.find(j => j._id === jobId);
            if (job) {
                // Filter talents based on job requirements and exclude already matched ones
                const matchedUserIds = matchings
                    .filter(match => match.jobId._id === jobId)
                    .map(match => match.userId._id);

                const availableTalents = talents.filter(talent =>
                    !matchedUserIds.includes(talent._id)
                );
                setFilteredTalents(availableTalents);
            }
        } else {
            setFilteredTalents([]);
        }
    };

    const handleCreateMatch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedJob || !selectedTalent) return;

        const token = getAuthToken();
        if (!token) return;

        createMatch(
            () => api.post('/matching', {
                jobId: selectedJob,
                userId: selectedTalent,
                status: 'Active'
            }, token),
            () => {
                setShowMatchForm(false);
                setSelectedJob('');
                setSelectedTalent('');
                setFilteredTalents([]);
                loadData(); // Refresh data
            }
        );
    };

    if (authLoading || matchingsLoading || talentsLoading || jobsLoading) {
        return <LoadingState message="Loading matches..." />;
    }

    const matchIcon = (
        <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    );

    const talentIcon = (
        <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
    );

    const jobIcon = (
        <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
    );

    return (
        <>
            <Toaster />
            <PageLayout
                title="Match Management"
                subtitle="Connect talents with job opportunities"
                actions={
                    <Button onClick={() => setShowMatchForm(true)}>
                        Create Match
                    </Button>
                }
            >

                {/* Stats */}
                <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3 }} className="mb-6 sm:mb-8">
                    <StatCard
                        title="Total Matches"
                        value={matchings.length}
                        icon={matchIcon}
                    />
                    <StatCard
                        title="Available Talents"
                        value={talents.length}
                        icon={talentIcon}
                    />
                    <StatCard
                        title="Available Jobs"
                        value={jobs.length}
                        icon={jobIcon}
                    />
                </ResponsiveGrid>

                {/* Create Match Modal */}
                <Modal
                    isOpen={showMatchForm}
                    onClose={() => {
                        setShowMatchForm(false);
                        setSelectedJob('');
                        setSelectedTalent('');
                        setFilteredTalents([]);
                    }}
                    title="Create New Match"
                    size="lg"
                    footer={
                        <div className="flex space-x-3">
                            <Button
                                onClick={() => handleCreateMatch({} as React.FormEvent)}
                                disabled={isSubmitting || !selectedJob || !selectedTalent}
                                fullWidth
                            >
                                {isSubmitting ? 'Creating...' : 'Create Match'}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setShowMatchForm(false);
                                    setSelectedJob('');
                                    setSelectedTalent('');
                                    setFilteredTalents([]);
                                }}
                                fullWidth
                            >
                                Cancel
                            </Button>
                        </div>
                    }
                >
                    <form onSubmit={handleCreateMatch} className="space-y-6">
                        {/* Job Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Job *
                            </label>
                            <select
                                value={selectedJob}
                                onChange={(e) => handleJobChange(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-instollar-dark"
                                required
                            >
                                <option value="">Choose a job...</option>
                                {jobs.map((job) => (
                                    <option key={job._id} value={job._id}>
                                        {job.title} - {job.location}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Talent Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Talent *
                            </label>
                            {selectedJob ? (
                                filteredTalents.length > 0 ? (
                                    <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                        {filteredTalents.map((talent) => (
                                            <label key={talent._id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="talent"
                                                    value={talent._id}
                                                    checked={selectedTalent === talent._id}
                                                    onChange={(e) => setSelectedTalent(e.target.value)}
                                                    className="mr-3"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">{talent.name}</div>
                                                    <div className="text-sm text-gray-600">{talent.email}</div>
                                                    <div className="text-sm text-gray-500">{talent.location}</div>
                                                    {talent.skills && talent.skills.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {talent.skills.slice(0, 3).map((skill, index) => (
                                                                <span key={index} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                            {talent.skills.length > 3 && (
                                                                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
                                                                    +{talent.skills.length - 3} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <div className="mb-2">No available talents for this job</div>
                                        <div className="text-sm">All talents have already been matched to this job</div>
                                    </div>
                                )
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    Please select a job first to see available talents
                                </div>
                            )}
                        </div>
                    </form>
                </Modal>

                {/* Matches List */}
                <Card>
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-instollar-dark">
                            All Matches
                        </h2>
                    </div>

                    <div className="p-6">
                        {matchings.length === 0 ? (
                            <EmptyState
                                title="No matches created yet"
                                action={
                                    <Button onClick={() => setShowMatchForm(true)}>
                                        Create Your First Match
                                    </Button>
                                }
                            />
                        ) : (
                            <div className="space-y-4">
                                {matchings.map((match) => (
                                    <Card key={match._id} hover className="p-4">
                                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${match.status === 'Active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {match.status}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-semibold text-instollar-dark mb-1">
                                                    {match.jobId.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-2">
                                                    Matched with: <span className="font-medium">{match.userId.name}</span>
                                                </p>
                                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {match.jobId.location} • {match.userId.location}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Matched on {new Date(match.createdAt).toLocaleDateString()} by {match.matchedBy.name}
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                                                <Link href={`/admin/jobs/${match.jobId._id}`}>
                                                    <Button variant="secondary" size="sm" fullWidth>
                                                        View Job
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
        </>
    );
}
