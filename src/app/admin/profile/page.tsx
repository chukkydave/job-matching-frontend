'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types';
import toast, { Toaster } from 'react-hot-toast';

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
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isRequestingOTP, setIsRequestingOTP] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const router = useRouter();

    const checkAuth = useCallback(() => {
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
    }, [router]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

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
                toast.success('Profile updated successfully!');
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            toast.error('Network error. Please try again.');
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
    };

    const handleRequestOTP = async () => {
        try {
            setIsRequestingOTP(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/auth/change-password-otp', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success('OTP sent to your email');
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to send OTP');
            }
        } catch (err) {
            console.error('Error requesting OTP:', err);
            toast.error('Network error. Please try again.');
        } finally {
            setIsRequestingOTP(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            setIsChangingPassword(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/auth/verify-otp-change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    otp: passwordData.otp,
                    newPassword: passwordData.newPassword
                })
            });

            if (response.ok) {
                toast.success('Password changed successfully');
                setShowChangePasswordModal(false);
                setPasswordData({ otp: '', newPassword: '', confirmPassword: '' });
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to change password');
            }
        } catch (err) {
            console.error('Error changing password:', err);
            toast.error('Network error. Please try again.');
        } finally {
            setIsChangingPassword(false);
        }
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
                            <button 
                                onClick={() => setShowChangePasswordModal(true)}
                                className="block w-full bg-instollar-dark text-white text-center py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            {showChangePasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-instollar-dark">
                                Change Password
                            </h3>
                            <button
                                onClick={() => {
                                    setShowChangePasswordModal(false);
                                    setPasswordData({ otp: '', newPassword: '', confirmPassword: '' });
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    OTP Code
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={passwordData.otp}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, otp: e.target.value }))}
                                        placeholder="Enter OTP from email"
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-instollar-dark"
                                    />
                                    <button
                                        onClick={handleRequestOTP}
                                        disabled={isRequestingOTP}
                                        className="bg-instollar-yellow text-instollar-dark px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                                    >
                                        {isRequestingOTP ? 'Sending...' : 'Get OTP'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    placeholder="Enter new password"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-instollar-dark"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    placeholder="Confirm new password"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-instollar-dark"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-200 flex space-x-3">
                            <button
                                onClick={handleChangePassword}
                                disabled={isChangingPassword || !passwordData.otp || !passwordData.newPassword || !passwordData.confirmPassword}
                                className="flex-1 bg-instollar-dark text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                            >
                                {isChangingPassword ? 'Changing...' : 'Change Password'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowChangePasswordModal(false);
                                    setPasswordData({ otp: '', newPassword: '', confirmPassword: '' });
                                }}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Toaster />
        </div>
    );
}
