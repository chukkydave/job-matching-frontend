'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Talent',
        skills: '',
        location: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validatePassword = (password: string) => {
        const requirements = {
            length: password.length >= 8,
            noEmail: !formData.email || !password.toLowerCase().includes(formData.email.split('@')[0].toLowerCase())
        };
        return requirements;
    };

    const passwordRequirements = validatePassword(formData.password);

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

        try {
            const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);

            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    skills: skillsArray,
                    location: formData.location
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store user data but don't redirect yet - need email verification
                localStorage.setItem('tempUser', JSON.stringify(data.user));
                localStorage.setItem('tempToken', data.token);
                router.push('/verify-email');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Join thousands of professionals finding their perfect match"
        >
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <div className="mt-1">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-instollar-dark focus:border-instollar-dark sm:text-sm"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-instollar-dark focus:border-instollar-dark sm:text-sm"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Role
                        </label>
                        <div className="mt-1">
                            <select
                                id="role"
                                name="role"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-instollar-dark focus:border-instollar-dark sm:text-sm"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="Talent">Talent</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            Location
                        </label>
                        <div className="mt-1">
                            <input
                                id="location"
                                name="location"
                                type="text"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-instollar-dark focus:border-instollar-dark sm:text-sm"
                                placeholder="City, Country"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                        Skills (comma-separated)
                    </label>
                    <div className="mt-1">
                        <textarea
                            id="skills"
                            name="skills"
                            rows={3}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-instollar-dark focus:border-instollar-dark sm:text-sm"
                            placeholder="JavaScript, React, Node.js, Python..."
                            value={formData.skills}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="mt-1 relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            required
                            className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-instollar-dark focus:border-instollar-dark sm:text-sm"
                            placeholder="Create a password"
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
                                Does not contain your email address
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <div className="mt-1 relative">
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            required
                            className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-instollar-dark focus:border-instollar-dark sm:text-sm"
                            placeholder="Confirm your password"
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
                                Creating account...
                            </span>
                        ) : (
                            'Create account'
                        )}
                    </button>
                </div>

                <div className="text-center">
                    <span className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-instollar-dark hover:text-instollar-yellow">
                            Sign in
                        </Link>
                    </span>
                </div>
            </form>
        </AuthLayout>
    );
}