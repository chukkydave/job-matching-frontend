'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { Job } from '../../../lib/types';
import { useAuth } from '../../../hooks/useAuth';
import { useApi } from '../../../hooks/useApi';
import { api, getAuthToken } from '../../../utils/api';
import { PageLayout, LoadingState, EmptyState } from '../../../components/shared/layout/PageLayout';
import { ResponsiveGrid } from '../../../components/shared/layout/ResponsiveGrid';
import { Card, StatCard } from '../../../components/shared/cards/Card';
import { Button } from '../../../components/shared/buttons/Button';

export default function AdminJobsPage() {
    const { isLoading: authLoading } = useAuth('Admin');
    const [jobs, setJobs] = useState<Job[]>([]);
    const { execute: fetchJobs, isLoading: jobsLoading } = useApi<Job[]>({
        showErrorToast: false,
        showSuccessToast: false,
    });
    const { execute: deleteJob } = useApi({ successMessage: 'Job deleted successfully!' });

    const loadJobs = useCallback(() => {
        fetchJobs(
            () => api.get('/jobs'),
            (data) => setJobs(data),
            () => setJobs([])
        );
    }, [fetchJobs]);

    useEffect(() => {
        if (!authLoading) {
            loadJobs();
        }
    }, [authLoading, loadJobs]);

    const handleDeleteJob = async (jobId: string) => {
        const job = jobs.find(j => j._id === jobId);
        const jobTitle = job?.title || 'this job';

        toast((t) => (
            <div className="flex flex-col space-y-3">
                <div className="font-medium text-gray-900">
                    Delete Job Confirmation
                </div>
                <div className="text-sm text-gray-600">
                    Are you sure you want to delete &ldquo;{jobTitle}&rdquo;? This action cannot be undone.
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                            toast.dismiss(t.id);
                            performDelete(jobId);
                        }}
                    >
                        Delete
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        ), {
            duration: 10000,
            position: 'top-center',
        });
    };

    const performDelete = async (jobId: string) => {
        const token = getAuthToken();
        if (!token) return;

        deleteJob(
            () => api.delete(`/jobs/${jobId}`, token),
            () => setJobs(jobs.filter(job => job._id !== jobId))
        );
    };

    if (authLoading || jobsLoading) {
        return <LoadingState message="Loading jobs..." />;
    }

    const jobIcon = (
        <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
    );

    const matchIcon = (
        <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    );

    const completedIcon = (
        <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    return (
        <>
            <Toaster />
            <PageLayout
                title="Job Management"
                subtitle="Manage all job postings and view their performance"
                actions={
                    <Link href="/admin/create-job">
                        <Button>Create New Job</Button>
                    </Link>
                }
            >
                {/* Stats */}
                <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3 }} className="mb-6 sm:mb-8">
                    <StatCard
                        title="Total Jobs"
                        value={jobs.length}
                        icon={jobIcon}
                    />
                    <StatCard
                        title="Active Matches"
                        value="0"
                        icon={matchIcon}
                    />
                    <StatCard
                        title="Completed Matches"
                        value="0"
                        icon={completedIcon}
                    />
                </ResponsiveGrid>

                {/* Jobs List */}
                <Card>
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-instollar-dark">
                            All Jobs
                        </h2>
                    </div>

                    <div className="p-6">
                        {jobs.length === 0 ? (
                            <EmptyState
                                title="No jobs created yet"
                                action={
                                    <Link href="/admin/create-job">
                                        <Button>Create Your First Job</Button>
                                    </Link>
                                }
                            />
                        ) : (
                            <div className="space-y-4">
                                {jobs.map((job) => (
                                    <Card key={job._id} hover className="p-4">
                                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-instollar-dark mb-2">
                                                    {job.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                                    {job.description}
                                                </p>
                                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {job.location}
                                                </div>
                                                <div className="flex flex-wrap gap-1 mb-2">
                                                    {job.requiredSkills.slice(0, 3).map((skill, index) => (
                                                        <span
                                                            key={index}
                                                            className="bg-instollar-yellow text-instollar-dark text-xs px-2 py-1 rounded"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {job.requiredSkills.length > 3 && (
                                                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
                                                            +{job.requiredSkills.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Posted {new Date(job.createdAt).toLocaleDateString()} by {job.createdBy.name}
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                                                <Link href={`/admin/jobs/${job._id}`}>
                                                    <Button variant="secondary" size="sm" fullWidth>
                                                        View Details
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteJob(job._id)}
                                                    fullWidth
                                                >
                                                    Delete
                                                </Button>
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
