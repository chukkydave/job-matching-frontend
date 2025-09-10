'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { api, getAuthToken } from '@/utils/api';
import { PageLayout, LoadingState } from '@/components/shared/layout/PageLayout';
import { Card } from '@/components/shared/cards/Card';
import { Button } from '@/components/shared/buttons/Button';
import { Modal } from '@/components/shared/modals/Modal';
import toast, { Toaster } from 'react-hot-toast';

export default function TalentProfilePage() {
    const { user, isLoading: authLoading } = useAuth('Talent');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
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

    const { execute: updateProfile, isLoading: isUpdating } = useApi({
        successMessage: 'Profile updated successfully!',
    });
    const { execute: requestOTP, isLoading: isRequestingOTP } = useApi({
        successMessage: 'OTP sent to your email!',
    });
    const { execute: changePassword, isLoading: isChangingPassword } = useApi({
        successMessage: 'Password changed successfully!',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                location: user.location,
                skills: user.skills || [],
            });
        }
    }, [user]);

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

    const handleSave = () => {
        const token = getAuthToken();
        if (!token) return;

        updateProfile(
            () => api.put('/auth/me', formData, token),
            (data: unknown) => {
                const response = data as { user: Record<string, unknown> };
                localStorage.setItem('user', JSON.stringify(response.user));
                setIsEditing(false);
            }
        );
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name,
                location: user.location,
                skills: user.skills || [],
            });
        }
        setIsEditing(false);
    };

    const handleRequestOTP = () => {
        const token = getAuthToken();
        if (!token) return;

        requestOTP(
            () => api.post('/auth/change-password-otp', {}, token)
        );
    };

    const handleChangePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        const token = getAuthToken();
        if (!token) return;

        changePassword(
            () => api.post('/auth/verify-otp-change-password', {
                otp: passwordData.otp,
                newPassword: passwordData.newPassword
            }, token),
            () => {
                setShowChangePasswordModal(false);
                setPasswordData({ otp: '', newPassword: '', confirmPassword: '' });
            }
        );
    };

    if (authLoading) {
        return <LoadingState message="Loading profile..." />;
    }

    if (!user) {
        return null;
    }

    return (
        <PageLayout
            title="Profile Settings"
            subtitle="Manage your account information and preferences"
        >


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                            <h2 className="text-xl font-semibold text-instollar-dark">
                                Personal Information
                            </h2>
                            {!isEditing && (
                                <Button onClick={() => setIsEditing(true)}>
                                    Edit Profile
                                </Button>
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
                                <p className="text-gray-900">{user.email}</p>
                                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
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
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <Button
                                        onClick={handleSave}
                                        disabled={isUpdating}
                                        loading={isUpdating}
                                        fullWidth
                                    >
                                        Save Changes
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={handleCancel}
                                        fullWidth
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Account Info Sidebar */}
                <div className="space-y-6">
                    {/* Account Status */}
                    <Card>
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
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <h3 className="text-lg font-semibold text-instollar-dark mb-4">
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <Button
                                onClick={() => setShowChangePasswordModal(true)}
                                fullWidth
                            >
                                Change Password
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Change Password Modal */}
            <Modal
                isOpen={showChangePasswordModal}
                onClose={() => {
                    setShowChangePasswordModal(false);
                    setPasswordData({ otp: '', newPassword: '', confirmPassword: '' });
                }}
                title="Change Password"
                size="md"
                footer={
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            onClick={handleChangePassword}
                            disabled={isChangingPassword || !passwordData.otp || !passwordData.newPassword || !passwordData.confirmPassword}
                            loading={isChangingPassword}
                            fullWidth
                        >
                            Change Password
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowChangePasswordModal(false);
                                setPasswordData({ otp: '', newPassword: '', confirmPassword: '' });
                            }}
                            fullWidth
                        >
                            Cancel
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            OTP Code
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={passwordData.otp}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, otp: e.target.value }))}
                                placeholder="Enter OTP from email"
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-instollar-dark"
                            />
                            <Button
                                variant="secondary"
                                onClick={handleRequestOTP}
                                disabled={isRequestingOTP}
                                loading={isRequestingOTP}
                                className="whitespace-nowrap"
                            >
                                Get OTP
                            </Button>
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
            </Modal>

            <Toaster />
        </PageLayout>
    );
}
