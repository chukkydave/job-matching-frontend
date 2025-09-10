'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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
    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        if (params.id) {
            fetchJob(params.id as string);
        }
    }, [params.id]);

    const fetchJob = async (jobId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/api/jobs/${jobId}`);
            const data = await response.json();

            if (response.ok) {
                setJob(data);
            } else {
                setError('Job not found');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        setIsApplying(true);
        // For now, we'll just show a success message
        // Later we'll implement the actual application logic
        setTimeout(() => {
            setIsApplying(false);
            alert('Application submitted successfully!');
        }, 1000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg text-gray-600">Loading job details...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <div className="text-red-600 text-lg mb-4">
                            {error || 'Job not found'}
                        </div>
                        <Link
                            href="/jobs"
                            className="bg-instollar-dark text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                        >
                            Back to Jobs
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href="/jobs"
                        className="inline-flex items-center text-instollar-dark hover:text-instollar-yellow transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Jobs
                    </Link>
                </div>

                {/* Job Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-instollar-dark mb-2">
                                {job.title}
                            </h1>
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
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-instollar-dark mb-3">
                            Required Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {job.requiredSkills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-instollar-yellow text-instollar-dark px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Apply Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleApply}
                            disabled={isApplying}
                            className="bg-instollar-dark text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isApplying ? 'Applying...' : 'Apply Now'}
                        </button>
                    </div>
                </div>

                {/* Job Description */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-instollar-dark mb-4">
                        Job Description
                    </h2>
                    <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {job.description}
                        </p>
                    </div>
                </div>

                {/* Company Info */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-6">
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
                </div>
            </div>
        </div>
    );
}
