'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import { API_BASE_URL } from '@/config/api';

function ResetPasswordForm() {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [token, setToken] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (!tokenParam) {
            setError('Invalid or missing reset token');
            return;
        }
        setToken(tokenParam);
    }, [searchParams]);

    const validatePassword = (password: string) => {
        const requirements = {
            length: password.length >= 8,
            noEmail: !password.toLowerCase().includes('@')
        };
        return requirements;
    };

    const passwordRequirements = validatePassword(formData.password);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (!passwordRequirements.length || !passwordRequirements.noEmail) {
            setError('Password does not meet requirements');
            setIsLoading(false);
            return;
        }

        if (!token) {
            setError('Invalid reset token');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setError(data.message || 'Password reset failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <AuthLayout
                title="Password reset successful"
                subtitle="Your password has been updated successfully"
            >
                <div className="text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Password Updated!
                        </h3>
                        <p className="text-sm text-gray-600">
                            Your password has been successfully updated. You will be redirected to the login page shortly.
                        </p>
                    </div>

                    <Link
                        href="/login"
                        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-instollar-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-instollar-dark"
                    >
                        Go to Login
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    if (!token) {
        return (
            <AuthLayout
                title="Invalid reset link"
                subtitle="This password reset link is invalid or has expired"
            >
                <div className="text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Link Invalid
                        </h3>
                        <p className="text-sm text-gray-600">
                            This password reset link is invalid or has expired. Please request a new one.
                        </p>
                    </div>

                    <Link
                        href="/forgot-password"
                        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-instollar-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-instollar-dark"
                    >
                        Request New Reset Link
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Enter your new password below"
        >
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <div className="mt-1 relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            required
                            className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-instollar-dark focus:border-instollar-dark sm:text-sm"
                            placeholder="Enter your new password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <span className="text-gray-400 hover:text-gray-600">
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </span>
                        </button>
                    </div>

                    {/* Password Requirements */}
                    {formData.password && (
                        <div className="mt-2 space-y-1">
                            <div className={`flex items-center text-sm ${passwordRequirements.length ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className="mr-2">{passwordRequirements.length ? '✓' : '○'}</span>
                                Must be at least 8 characters
                            </div>
                            <div className={`flex items-center text-sm ${passwordRequirements.noEmail ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className="mr-2">{passwordRequirements.noEmail ? '✓' : '○'}</span>
                                Does not contain email address
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                    </label>
                    <div className="mt-1 relative">
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            required
                            className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-instollar-dark focus:border-instollar-dark sm:text-sm"
                            placeholder="Confirm your new password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <span className="text-gray-400 hover:text-gray-600">
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </span>
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="text-sm text-red-700">
                            {error}
                        </div>
                    </div>
                )}

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-instollar-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-instollar-dark disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating password...
                            </span>
                        ) : (
                            'Update Password'
                        )}
                    </button>
                </div>

                <div className="text-center">
                    <Link href="/login" className="font-medium text-instollar-dark hover:text-instollar-yellow">
                        Back to sign in
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <AuthLayout title="Loading..." subtitle="Please wait while we load the reset form">
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-instollar-dark"></div>
                </div>
            </AuthLayout>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
