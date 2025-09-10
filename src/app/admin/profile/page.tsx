'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types';

export default function AdminProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        location: '',
        skills: [] as string[],
    });
    const [newSkill, setNewSkill] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
            setFormData({
                name: parsedUser.name,
                email: parsedUser.email,
                location: parsedUser.location,
                skills: parsedUser.skills || [],
            });
        } catch (error) {
            console.error('Error parsing user data:', error);
            router.push('/login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/auth/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser.user);
                localStorage.setItem('user', JSON.stringify(updatedUser.user));
                setIsEditing(false);
                setSuccess('Profile updated successfully!');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError('Failed to update profile');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Network error. Please try again.');
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                location: user.location,
                skills: user.skills || [],
            });
        }
        setIsEditing(false);
        setError('');
        setSuccess('');
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-600">Loading profile...</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="text-center py-8">
                    <div className="text-red-600 text-lg">User not found</div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-instollar-dark mb-2">
                    Profile Settings
                </h1>
                <p className="text-gray-600">
                    Manage your account information and preferences
                </p>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-green-700">{success}</div>
                </div>
            )}

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-red-700">{error}</div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-instollar-dark">
                                Personal Information
                            </h2>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-instollar-dark text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-instollar-dark"
                                    />
                                ) : (
                                    <p className="text-gray-900">{user.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-instollar-dark"
                                    />
                                ) : (
                                    <p className="text-gray-900">{user.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-instollar-dark"
                                    />
                                ) : (
                                    <p className="text-gray-900">{user.location}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Skills
                                </label>
                                {isEditing ? (
                                    <div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {formData.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-instollar-yellow text-instollar-dark px-3 py-1 rounded-full text-sm flex items-center"
                                                >
                                                    {skill}
                                                    <button
                                                        onClick={() => handleRemoveSkill(skill)}
                                                        className="ml-2 text-instollar-dark hover:text-opacity-70"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                placeholder="Add a skill"
                                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-instollar-dark"
                                                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                                            />
                                            <button
                                                onClick={handleAddSkill}
                                                className="bg-instollar-dark text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {user.skills && user.skills.length > 0 ? (
                                            user.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-instollar-yellow text-instollar-dark px-3 py-1 rounded-full text-sm"
                                                >
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No skills added</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {isEditing && (
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        onClick={handleSave}
                                        className="bg-instollar-dark text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Account Info Sidebar */}
                <div className="space-y-6">
                    {/* Account Status */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-instollar-dark mb-4">
                            Account Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Role</span>
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
                                    {user.role}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Email Status</span>
                                <span className={`px-2 py-1 rounded text-sm font-medium ${user.isEmailVerified
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {user.isEmailVerified ? 'Verified' : 'Not Verified'}
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
                            <button className="block w-full bg-gray-200 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                                Change Password
                            </button>
                            <button className="block w-full bg-gray-200 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                                Download Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
