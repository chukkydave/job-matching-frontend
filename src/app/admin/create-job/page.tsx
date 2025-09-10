'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@/lib/types';

export default function CreateJobPage() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requiredSkills: '',
        location: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState<User | null>(null);
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
            setUser(parsedUser);
        } catch (error) {
            router.push('/login');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!formData.title || !formData.description || !formData.location) {
            setError('Please fill in all required fields');
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const skillsArray = formData.requiredSkills.split(',').map(skill => skill.trim()).filter(skill => skill);

            const response = await fetch('http://localhost:3001/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    requiredSkills: skillsArray,
                    location: formData.location
                }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push('/admin');
            } else {
                setError(data.message || 'Failed to create job');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Link
                            href="/admin"
                            className="inline-flex items-center text-instollar-dark hover:text-instollar-yellow transition-colors mr-4"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Admin Panel
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-instollar-dark mb-2">
                        Create New Job
                    </h1>
                    <p className="text-gray-600">
                        Post a new job opportunity for talents to discover
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Job Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-instollar-dark focus:border-instollar-dark"
                                placeholder="e.g., Senior Frontend Developer"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={8}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-instollar-dark focus:border-instollar-dark"
                                placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700 mb-2">
                                Required Skills
                            </label>
                            <input
                                type="text"
                                id="requiredSkills"
                                name="requiredSkills"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-instollar-dark focus:border-instollar-dark"
                                placeholder="JavaScript, React, Node.js, TypeScript (comma-separated)"
                                value={formData.requiredSkills}
                                onChange={handleChange}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Separate multiple skills with commas
                            </p>
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-instollar-dark focus:border-instollar-dark"
                                placeholder="e.g., Lagos, Nigeria or Remote"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                <div className="text-red-700">{error}</div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-4">
                            <Link
                                href="/admin"
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-instollar-dark"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2 bg-instollar-dark text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-instollar-dark disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Creating...' : 'Create Job'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
