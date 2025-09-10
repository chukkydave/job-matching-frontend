'use client';

import { useState, useEffect } from 'react';
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

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [skillFilter, setSkillFilter] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        filterJobs();
    }, [jobs, searchTerm, locationFilter, skillFilter]);

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
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const filterJobs = () => {
        let filtered = jobs;

        if (searchTerm) {
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (locationFilter) {
            filtered = filtered.filter(job =>
                job.location.toLowerCase().includes(locationFilter.toLowerCase())
            );
        }

        if (skillFilter) {
            filtered = filtered.filter(job =>
                job.requiredSkills.some(skill =>
                    skill.toLowerCase().includes(skillFilter.toLowerCase())
                )
            );
        }

        setFilteredJobs(filtered);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setLocationFilter('');
        setSkillFilter('');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg text-gray-600">Loading jobs...</div>
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
                    <h1 className="text-3xl font-bold text-instollar-dark mb-2">
                        Find Your Next Opportunity
                    </h1>
                    <p className="text-gray-600">
                        Discover jobs that match your skills and location
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                Search Jobs
                            </label>
                            <input
                                type="text"
                                id="search"
                                placeholder="Job title or description..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-instollar-dark focus:border-instollar-dark"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                placeholder="City, Country..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-instollar-dark focus:border-instollar-dark"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-1">
                                Skill
                            </label>
                            <input
                                type="text"
                                id="skill"
                                placeholder="JavaScript, React..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-instollar-dark focus:border-instollar-dark"
                                value={skillFilter}
                                onChange={(e) => setSkillFilter(e.target.value)}
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={clearFilters}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-instollar-dark"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Showing {filteredJobs.length} of {jobs.length} jobs
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                        <div className="text-red-700">{error}</div>
                    </div>
                )}

                {/* Jobs Grid */}
                {filteredJobs.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg mb-4">
                            {jobs.length === 0 ? 'No jobs available yet' : 'No jobs match your filters'}
                        </div>
                        {jobs.length === 0 && (
                            <p className="text-gray-400">
                                Check back later for new opportunities
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.map((job) => (
                            <div key={job._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-lg font-semibold text-instollar-dark line-clamp-2">
                                            {job.title}
                                        </h3>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {job.description}
                                    </p>

                                    <div className="mb-4">
                                        <div className="flex items-center text-sm text-gray-500 mb-2">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {job.location}
                                        </div>

                                        <div className="flex flex-wrap gap-1">
                                            {job.requiredSkills.slice(0, 3).map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-block bg-instollar-yellow text-instollar-dark text-xs px-2 py-1 rounded"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {job.requiredSkills.length > 3 && (
                                                <span className="inline-block bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
                                                    +{job.requiredSkills.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="text-xs text-gray-500">
                                            Posted by {job.createdBy.name}
                                        </div>
                                        <Link
                                            href={`/jobs/${job._id}`}
                                            className="bg-instollar-dark text-white px-4 py-2 rounded-md text-sm hover:bg-opacity-90 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
