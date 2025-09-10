'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { Job, Matching, User } from '@/lib/types';
import { API_BASE_URL } from '@/config/api';

export default function AdminJobDetailPage() {
    const [job, setJob] = useState<Job | null>(null);
    const [matchings, setMatchings] = useState<Matching[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [isCreatingMatch, setIsCreatingMatch] = useState(false);
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const params = useParams();
    const jobId = params.id as string;

    useEffect(() => {
        checkAuth();
    }, [jobId]);

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
            fetchJobDetails();
        } catch (error) {
            console.error('Error parsing user data:', error);
            router.push('/login');
        }
    };

    const fetchJobDetails = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch job details and matchings in parallel
            const [jobRes, matchingsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/jobs/${jobId}`),
                fetch(`${API_BASE_URL}/matching`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (jobRes.ok) {
                const jobData = await jobRes.json();
                setJob(jobData);
            } else {
                setError('Failed to load job details');
            }

            if (matchingsRes.ok) {
                const matchingsData = await matchingsRes.json();
                // Filter matchings for this specific job
                const jobMatchings = matchingsData.filter((match: Matching) => match.jobId._id === jobId);
                setMatchings(jobMatchings);
            }
        } catch (err) {
            console.error('Error fetching job details:', err);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteJob = async () => {
        if (!job) return;

        toast((t) => (
            <div className="flex flex-col space-y-3">
                <div className="font-medium text-gray-900">
                    Delete Job Confirmation
                </div>
                <div className="text-sm text-gray-600">
                    Are you sure you want to delete "{job.title}"? This action cannot be undone and will also remove all associated matches.
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            performDelete();
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

    const performDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success('Job deleted successfully!');
                setTimeout(() => {
                    router.push('/admin/jobs');
                }, 1000);
            } else {
                toast.error('Failed to delete job');
            }
        } catch (err) {
            console.error('Error deleting job:', err);
            toast.error('Network error. Please try again.');
        }
    };

    const handleCreateMatch = async () => {
        setShowMatchModal(true);
        await fetchUsers();
    };

    const fetchUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const usersData = await response.json();
                // Filter out users who are already matched to this job
                const matchedUserIds = matchings.map(match => match.userId._id);
                const availableUsers = usersData.filter((user: User) =>
                    user.role === 'Talent' && !matchedUserIds.includes(user._id)
                );
                setUsers(availableUsers);
            } else {
                toast.error('Failed to load users');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            toast.error('Network error. Please try again.');
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleMatchUser = async (userId: string, userName: string) => {
        setIsCreatingMatch(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/matching`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    jobId: jobId,
                    userId: userId,
                    status: 'Active'
                })
            });

            if (response.ok) {
                toast.success(`Successfully matched ${userName} to this job!`);
                setShowMatchModal(false);
                // Refresh the page data
                fetchJobDetails();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to create match');
            }
        } catch (err) {
            console.error('Error creating match:', err);
            toast.error('Network error. Please try again.');
        } finally {
            setIsCreatingMatch(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-600">Loading job details...</div>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="text-center py-8">
                    <div className="text-red-600 text-lg mb-4">
                        {error || 'Job not found'}
                    </div>
                    <Link
                        href="/admin/jobs"
                        className="bg-instollar-dark text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                        Back to Jobs
                    </Link>
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
                            <Link
                                href="/admin/jobs"
                                className="text-instollar-dark hover:text-opacity-80 transition-colors mb-2 inline-block"
                            >
                                ← Back to Jobs
                            </Link>
                            <h1 className="text-3xl font-bold text-instollar-dark mb-2">
                                {job.title}
                            </h1>
                            <p className="text-gray-600">
                                Job Details & Performance Analytics
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <Link
                                href={`/admin/jobs/${jobId}/edit`}
                                className="bg-instollar-yellow text-instollar-dark px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                Edit Job
                            </Link>
                            <button
                                onClick={handleDeleteJob}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Delete Job
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Job Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-instollar-dark mb-4">
                                Job Information
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                                    <p className="text-gray-600">{job.description}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Location</h3>
                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {job.location}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Required Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {job.requiredSkills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="bg-instollar-yellow text-instollar-dark px-3 py-1 rounded-full text-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Posted By</h3>
                                    <p className="text-gray-600">{job.createdBy.name} ({job.createdBy.email})</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Posted Date</h3>
                                    <p className="text-gray-600">{new Date(job.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Matched Talents */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-instollar-dark mb-4">
                                Matched Talents ({matchings.length})
                            </h2>
                            {matchings.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-500 mb-4">No talents matched to this job yet</div>
                                    <Link
                                        href="/admin/matches"
                                        className="bg-instollar-dark text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                                    >
                                        Create Match
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {matchings.map((match) => (
                                        <div key={match._id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{match.userId.name}</h4>
                                                    <p className="text-sm text-gray-600 mb-2">{match.userId.email}</p>
                                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {match.userId.location}
                                                    </div>
                                                    <div className="flex flex-wrap gap-1 mb-2">
                                                        {match.userId.skills.slice(0, 3).map((skill, index) => (
                                                            <span
                                                                key={index}
                                                                className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                        {match.userId.skills.length > 3 && (
                                                            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
                                                                +{match.userId.skills.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Matched on {new Date(match.createdAt).toLocaleDateString()} by {match.matchedBy.name}
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${match.status === 'Active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {match.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Analytics Sidebar */}
                    <div className="space-y-6">
                        {/* Performance Stats */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-instollar-dark mb-4">
                                Performance Analytics
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total Matches</span>
                                    <span className="text-2xl font-bold text-instollar-dark">{matchings.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Active Matches</span>
                                    <span className="text-2xl font-bold text-green-600">
                                        {matchings.filter(m => m.status === 'Active').length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Days Posted</span>
                                    <span className="text-2xl font-bold text-instollar-dark">
                                        {Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-instollar-dark mb-4">
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <button
                                    onClick={handleCreateMatch}
                                    className="block w-full bg-instollar-dark text-white text-center py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                                >
                                    Match Talent
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Match Modal */}
                {showMatchModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-instollar-dark">
                                    Match Talent to Job
                                </h2>
                                <button
                                    onClick={() => setShowMatchModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {isLoadingUsers ? (
                                    <div className="text-center py-8">
                                        <div className="text-gray-500">Loading available talents...</div>
                                    </div>
                                ) : users.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="text-gray-500 mb-4">No available talents to match</div>
                                        <div className="text-sm text-gray-400">
                                            All talents have already been matched to this job
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {users.map((user) => (
                                            <div key={user._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                                                        <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                                                        <div className="flex items-center text-sm text-gray-500 mb-2">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {user.location}
                                                        </div>
                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                            {user.skills && user.skills.slice(0, 3).map((skill, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                            {user.skills && user.skills.length > 3 && (
                                                                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
                                                                    +{user.skills.length - 3} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleMatchUser(user._id, user.name)}
                                                        disabled={isCreatingMatch}
                                                        className="bg-instollar-dark text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                                    >
                                                        {isCreatingMatch ? 'Matching...' : 'Match'}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-gray-200">
                                <button
                                    onClick={() => setShowMatchModal(false)}
                                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
