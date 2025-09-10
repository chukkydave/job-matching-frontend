'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { Job } from '../../../../../lib/types';
import { API_BASE_URL } from '../../../../../config/api';

export default function EditJobPage() {
    const [job, setJob] = useState<Job | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        requiredSkills: [] as string[],
    });
    const [skillInput, setSkillInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
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
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
            if (response.ok) {
                const jobData = await response.json();
                setJob(jobData);
                setFormData({
                    title: jobData.title,
                    description: jobData.description,
                    location: jobData.location,
                    requiredSkills: jobData.requiredSkills,
                });
            } else {
                toast.error('Failed to load job details');
                router.push('/admin/jobs');
            }
        } catch (err) {
            console.error('Error fetching job details:', err);
            toast.error('Network error. Please try again.');
            router.push('/admin/jobs');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSkill = () => {
        if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                requiredSkills: [...prev.requiredSkills, skillInput.trim()]
            }));
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast.success('Job updated successfully!');
                setTimeout(() => {
                    router.push(`/admin/jobs/${jobId}`);
                }, 1000);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to update job');
            }
        } catch (err) {
            console.error('Error updating job:', err);
            toast.error('Network error. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-600">Loading job details...</div>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="text-center py-8">
                    <div className="text-red-600 text-lg mb-4">Job not found</div>
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
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/admin/jobs/${jobId}`}
                        className="text-instollar-dark hover:text-opacity-80 transition-colors mb-2 inline-block"
                    >
                        ← Back to Job Details
                    </Link>
                    <h1 className="text-3xl font-bold text-instollar-dark mb-2">
                        Edit Job
                    </h1>
                    <p className="text-gray-600">
                        Update job information and requirements
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Job Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-instollar-dark focus:border-transparent"
                                placeholder="Enter job title"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-instollar-dark focus:border-transparent"
                                placeholder="Describe the job responsibilities, requirements, and what the candidate will be doing"
                                required
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-instollar-dark focus:border-transparent"
                                placeholder="e.g., New York, NY or Remote"
                                required
                            />
                        </div>

                        {/* Required Skills */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Required Skills
                            </label>
                            <div className="flex space-x-2 mb-3">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-instollar-dark focus:border-transparent"
                                    placeholder="Add a skill"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSkill}
                                    className="bg-instollar-yellow text-instollar-dark px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.requiredSkills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="bg-instollar-yellow text-instollar-dark px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                                    >
                                        <span>{skill}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(skill)}
                                            className="text-instollar-dark hover:text-red-600 transition-colors"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex space-x-4 pt-6">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-instollar-dark text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? 'Saving...' : 'Update Job'}
                            </button>
                            <Link
                                href={`/admin/jobs/${jobId}`}
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors text-center"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
