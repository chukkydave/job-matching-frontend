'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Matching } from '@/lib/types';

export default function TalentPage() {
    const [matchings, setMatchings] = useState<Matching[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState<any>(null);
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
            if (parsedUser.role !== 'Talent') {
                router.push('/dashboard');
                return;
            }
            setUser(parsedUser);
            fetchMyJobs();
        } catch (error) {
            console.error('Error parsing user data:', error);
            router.push('/login');
        }
    };

    const fetchMyJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/matching/my-jobs', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setMatchings(data);
            } else {
                setError('Failed to load your matched jobs');
            }
        } catch (err) {
            console.error('Error fetching matched jobs:', err);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg text-gray-600">Loading your matches...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-instollar-dark mb-2">
                                My Matched Jobs
                            </h1>
                            <p className="text-gray-600">
                                View the jobs you've been matched with
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <Link
                                href="/jobs"
                                className="bg-instollar-dark text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                Browse All Jobs
                            </Link>
                            <Link
                                href="/dashboard"
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-instollar-yellow rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-instollar-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-instollar-dark">{matchings.length}</p>
                                <p className="text-gray-600">Matched Jobs</p>
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
                                <p className="text-2xl font-bold text-instollar-dark">
                                    {matchings.filter(m => m.status === 'Active').length}
                                </p>
                                <p className="text-gray-600">Active Matches</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Matched Jobs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-instollar-dark">
                            Your Job Matches
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
                                    You haven't been matched with any jobs yet
                                </div>
                                <p className="text-gray-400 mb-6">
                                    Keep your profile updated and check back later for new opportunities
                                </p>
                                <Link
                                    href="/jobs"
                                    className="bg-instollar-dark text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                                >
                                    Browse Available Jobs
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {matchings.map((match) => (
                                    <div key={match._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-3">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        match.status === 'Active' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {match.status}
                                                    </span>
                                                    <span className="ml-3 text-sm text-gray-500">
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
                                                    {match.jobId.requiredSkills.slice(0, 4).map((skill, index) => (
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
                                            
                                            <div className="flex flex-col space-y-2 ml-6">
                                                <Link
                                                    href={`/jobs/${match.jobId._id}`}
                                                    className="bg-instollar-dark text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-center"
                                                >
                                                    View Details
                                                </Link>
                                                <button className="bg-instollar-yellow text-instollar-dark px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                                                    Contact Employer
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
        </div>
    );
}
