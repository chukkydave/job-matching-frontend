'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { api } from '@/utils/api';
import { PageLayout, LoadingState } from '@/components/shared/layout/PageLayout';
import { Card } from '@/components/shared/cards/Card';
import { Button } from '@/components/shared/buttons/Button';

interface Job {
    _id: string;
    title: string;
    description: string;
    requiredSkills: string[];
    location: string;
    createdBy: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
}

export default function JobDetailPage() {
    const { user } = useAuth();
    const [job, setJob] = useState<Job | null>(null);
    const params = useParams();

    const { execute: fetchJob, isLoading, error } = useApi<Job>({
        showErrorToast: false,
        showSuccessToast: false,
    });

    const loadJob = useCallback((jobId: string) => {
        fetchJob(
            () => api.get(`/jobs/${jobId}`),
            (data) => setJob(data),
            () => setJob(null)
        );
    }, [fetchJob]);

    useEffect(() => {
        if (params.id) {
            loadJob(params.id as string);
        }
    }, [params.id, loadJob]);

    const getBackUrl = () => {
        // If user is a talent, go back to their matches page
        if (user?.role === 'Talent') {
            return '/talent/matches';
        }
        // If user is an admin, go back to admin jobs page
        if (user?.role === 'Admin') {
            return '/admin/jobs';
        }
        // Default fallback
        return '/jobs';
    };

    if (isLoading) {
        return <LoadingState message="Loading job details..." />;
    }

    if (error || !job) {
        return (
            <PageLayout
                title="Job Not Found"
                subtitle="The job you're looking for doesn't exist or has been removed"
            >
                <div className="text-center py-16">
                    <Link href={getBackUrl()}>
                        <Button>Back to Jobs</Button>
                    </Link>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout
            title={job.title}
            subtitle={`Posted by ${job.createdBy.name} • ${job.location}`}
            actions={
                <Link href={getBackUrl()}>
                    <Button variant="secondary">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </Button>
                </Link>
            }
        >

            {/* Job Info */}
            <Card className="mb-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
                    <div className="flex-1">
                        <div className="flex items-center text-gray-600 mb-4">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500 mb-2">
                            Posted {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-600">
                            by {job.createdBy.name}
                        </div>
                    </div>
                </div>

                {/* Required Skills */}
                <div>
                    <h3 className="text-lg font-semibold text-instollar-dark mb-3">
                        Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.map((skill: string, index: number) => (
                            <span
                                key={index}
                                className="bg-instollar-yellow text-instollar-dark px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Job Description */}
            <Card className="mb-6">
                <h2 className="text-2xl font-bold text-instollar-dark mb-4">
                    Job Description
                </h2>
                <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {job.description}
                    </p>
                </div>
            </Card>

            {/* Company Info */}
            <Card>
                <h2 className="text-2xl font-bold text-instollar-dark mb-4">
                    About the Company
                </h2>
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-instollar-dark rounded-full flex items-center justify-center mr-4">
                        <span className="text-instollar-yellow font-bold text-lg">
                            {job.createdBy.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {job.createdBy.name}
                        </h3>
                        <p className="text-gray-600">
                            {job.createdBy.email}
                        </p>
                    </div>
                </div>
            </Card>
        </PageLayout>
    );
}
