'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { Job } from '../../../lib/types';

export default function AdminJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
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
            fetchJobs();
        } catch (error) {
            console.error('Error parsing user data:', error);
            router.push('/login');
        }
    };

    const fetchJobs = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/jobs');
            const data = await response.json();

            if (response.ok) {
                setJobs(data);
            } else {
                setError('Failed to load jobs');
            }
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteJob = async (jobId: string) => {
        const job = jobs.find(j => j._id === jobId);
        const jobTitle = job?.title || 'this job';

        toast((t) => (
            <div className="flex flex-col space-y-3">
                <div className="font-medium text-gray-900">
                    Delete Job Confirmation
                </div>
                <div className="text-sm text-gray-600">
                    Are you sure you want to delete "{jobTitle}"? This action cannot be undone.
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            performDelete(jobId);
                        }}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 10000,
            position: 'top-center',
        });
    };

    const performDelete = async (jobId: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setJobs(jobs.filter(job => job._id !== jobId));
                toast.success('Job deleted successfully!');
            } else {
                toast.error('Failed to delete job');
            }
        } catch (err) {
            console.error('Error deleting job:', err);
            toast.error('Network error. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-600">Loading jobs...</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster />
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-instollar-dark mb-2">
                                Job Management
                            </h1>
                            <p className="text-gray-600">
                                Manage all job postings and view their performance
                            </p>
                        </div>
                        <Link
                            href="/admin/create-job"
                            className="bg-instollar-dark text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                        >
                            Create New Job
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-instollar-yellow rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-instollar-dark">{jobs.length}</p>
                                <p className="text-gray-600">Total Jobs</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-instollar-yellow rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-instollar-dark">0</p>
                                <p className="text-gray-600">Active Matches</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-instollar-yellow rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-instollar-dark">0</p>
                                <p className="text-gray-600">Completed Matches</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Jobs List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-instollar-dark">
                            All Jobs
                        </h2>
                    </div>

                    {error && (
                        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                            <div className="text-red-700">{error}</div>
                        </div>
                    )}

                    <div className="p-6">
                        {jobs.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-gray-500 text-lg mb-4">
                                    No jobs created yet
                                </div>
                                <Link
                                    href="/admin/create-job"
                                    className="bg-instollar-dark text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                                >
                                    Create Your First Job
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {jobs.map((job) => (
                                    <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                        <div className="flex justify-between items-start">
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
                                            <div className="flex space-x-2 ml-4">
                                                <Link
                                                    href={`/admin/jobs/${job._id}`}
                                                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition-colors"
                                                >
                                                    View Details
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteJob(job._id)}
                                                    className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
