'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';

export default function VerifyEmailPage() {
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const [userEmail, setUserEmail] = useState('');
    const router = useRouter();

    useEffect(() => {
        const tempUser = localStorage.getItem('tempUser');
        if (!tempUser) {
            router.push('/register');
            return;
        }

        const user = JSON.parse(tempUser);
        setUserEmail(user.email);

        // Start resend timer
        setResendTimer(60);
        const timer = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) return; // Only allow single digit

        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = verificationCode.join('');

        if (code.length !== 6) {
            setError('Please enter the complete verification code');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // For now, we'll simulate email verification
            // In a real app, you'd send this to your backend
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Move temp data to permanent storage
            const tempUser = localStorage.getItem('tempUser');
            const tempToken = localStorage.getItem('tempToken');

            if (tempUser && tempToken) {
                localStorage.setItem('user', tempUser);
                localStorage.setItem('token', tempToken);
                localStorage.removeItem('tempUser');
                localStorage.removeItem('tempToken');

                router.push('/dashboard');
            } else {
                router.push('/login');
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendTimer > 0) return;

        setResendTimer(60);
        setError('');

        // Start timer again
        const timer = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <AuthLayout
            title="Verify your email"
            subtitle="We've sent a verification code to your email address"
        >
            <div className="space-y-6">
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        A verification code has been sent to <strong>{userEmail}</strong>.
                        Enter the code to continue and be redirected.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 mb-3">
                            Verification Code
                        </label>
                        <div className="flex justify-center space-x-3">
                            {verificationCode.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`code-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-instollar-dark focus:border-instollar-dark"
                                    value={digit}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                />
                            ))}
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
                            disabled={isLoading || verificationCode.join('').length !== 6}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-instollar-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-instollar-dark disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </span>
                            ) : (
                                'Verify Email'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Didn&apos;t receive the code?{' '}
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={resendTimer > 0}
                                className="font-medium text-instollar-dark hover:text-instollar-yellow disabled:text-gray-400"
                            >
                                {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}
