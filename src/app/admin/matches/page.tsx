'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { Matching, Job, User } from '@/lib/types';

export default function AdminMatchesPage() {
    const [matchings, setMatchings] = useState<Matching[]>([]);
    const [talents, setTalents] = useState<User[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showMatchForm, setShowMatchForm] = useState(false);
    const [selectedJob, setSelectedJob] = useState('');
    const [selectedTalent, setSelectedTalent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filteredTalents, setFilteredTalents] = useState<User[]>([]);
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
            fetchData();
        } catch (error) {
            console.error('Error parsing user data:', error);
            router.push('/login');
        }
    };

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch all data in parallel
            const [matchingsRes, talentsRes, jobsRes] = await Promise.all([
                fetch('http://localhost:3001/api/matching', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:3001/api/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:3001/api/jobs')
            ]);

            const [matchingsData, talentsData, jobsData] = await Promise.all([
                matchingsRes.json(),
                talentsRes.json(),
                jobsRes.json()
            ]);

            if (matchingsRes.ok) setMatchings(matchingsData);
            if (talentsRes.ok) setTalents(talentsData.filter((user: User) => user.role === 'Talent'));
            if (jobsRes.ok) setJobs(jobsData);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleCreateMatch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedJob || !selectedTalent) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/matching', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    jobId: selectedJob,
                    userId: selectedTalent,
                    status: 'Active'
                })
            });

            if (response.ok) {
                const newMatch = await response.json();
                setMatchings([...matchings, newMatch]);
                setShowMatchForm(false);
                setSelectedJob('');
                setSelectedTalent('');
                setFilteredTalents([]);
                toast.success('Match created successfully!');
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to create match');
            }
        } catch (err) {
            console.error('Error creating match:', err);
            toast.error('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg text-gray-600">Loading matches...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-instollar-dark mb-2">
                                    Match Management
                                </h1>
                                <p className="text-gray-600">
                                    Connect talents with job opportunities
                                </p>
                            </div>
                            <button
                                onClick={() => setShowMatchForm(true)}
                                className="bg-instollar-dark text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                Create Match
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-instollar-yellow rounded-lg flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-instollar-dark">{matchings.length}</p>
                                    <p className="text-gray-600">Total Matches</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-instollar-yellow rounded-lg flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-instollar-dark">{talents.length}</p>
                                    <p className="text-gray-600">Available Talents</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-instollar-yellow rounded-lg flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-instollar-dark">{jobs.length}</p>
                                    <p className="text-gray-600">Available Jobs</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Create Match Modal */}
                    {showMatchForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                                {/* Modal Header */}
                                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                    <h3 className="text-xl font-semibold text-instollar-dark">
                                        Create New Match
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowMatchForm(false);
                                            setSelectedJob('');
                                            setSelectedTalent('');
                                            setFilteredTalents([]);
                                        }}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Modal Content */}
                                <div className="flex-1 overflow-y-auto p-6">
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
                                </div>

                                {/* Modal Footer */}
                                <div className="p-6 border-t border-gray-200">
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={handleCreateMatch}
                                            disabled={isSubmitting || !selectedJob || !selectedTalent}
                                            className="flex-1 bg-instollar-dark text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? 'Creating...' : 'Create Match'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowMatchForm(false);
                                                setSelectedJob('');
                                                setSelectedTalent('');
                                                setFilteredTalents([]);
                                            }}
                                            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Matches List */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-instollar-dark">
                                All Matches
                            </h2>
                        </div>

                        {error && (
                            <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                                <div className="text-red-700">{error}</div>
                            </div>
                        )}

                        <div className="p-6">
                            {matchings.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-500 text-lg mb-4">
                                        No matches created yet
                                    </div>
                                    <button
                                        onClick={() => setShowMatchForm(true)}
                                        className="bg-instollar-dark text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                                    >
                                        Create Your First Match
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {matchings.map((match) => (
                                        <div key={match._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                            <div className="flex justify-between items-start">
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
                                                <div className="flex space-x-2 ml-4">
                                                    <Link
                                                        href={`/admin/jobs/${match.jobId._id}`}
                                                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition-colors"
                                                    >
                                                        View Job
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
