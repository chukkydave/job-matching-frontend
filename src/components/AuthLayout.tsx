'use client';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex">
            {/* Left Section - Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-instollar-dark rounded-lg flex items-center justify-center mr-3">
                                <span className="text-instollar-yellow font-bold text-lg">I</span>
                            </div>
                            <h1 className="text-2xl font-bold text-instollar-dark">Instollar Jobs</h1>
                        </div>
                        <h2 className="mt-8 text-3xl font-bold text-instollar-dark">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="mt-2 text-sm text-gray-600">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="mt-8">
                        {children}
                    </div>
                </div>
            </div>

            {/* Right Section - Decorative Background */}
            <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-instollar-dark to-instollar-dark/80">
                    {/* Abstract geometric shapes */}
                    <div className="absolute top-20 left-10 w-32 h-32 bg-instollar-yellow/20 rounded-full blur-xl"></div>
                    <div className="absolute top-40 right-20 w-24 h-24 bg-instollar-yellow/30 rounded-2xl rotate-12"></div>
                    <div className="absolute bottom-32 left-20 w-40 h-40 bg-instollar-yellow/15 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-20 right-10 w-28 h-28 bg-instollar-yellow/25 rounded-3xl rotate-45"></div>
                    <div className="absolute top-60 left-1/2 w-20 h-20 bg-instollar-yellow/20 rounded-full"></div>
                    <div className="absolute bottom-60 right-1/3 w-36 h-36 bg-instollar-yellow/10 rounded-2xl rotate-12 blur-lg"></div>

                    {/* Overlay pattern */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>

                {/* Content overlay */}
                <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
                    <div className="text-center">
                        <h3 className="text-4xl font-bold mb-4">
                            Find Your Perfect Match
                        </h3>
                        <p className="text-xl opacity-90 mb-8">
                            Connect with opportunities that align with your skills and career goals
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-instollar-yellow rounded-full flex items-center justify-center mr-3">
                                    <span className="text-instollar-dark font-bold">1</span>
                                </div>
                                <span>Create your professional profile</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-instollar-yellow rounded-full flex items-center justify-center mr-3">
                                    <span className="text-instollar-dark font-bold">2</span>
                                </div>
                                <span>Get matched with relevant opportunities</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-instollar-yellow rounded-full flex items-center justify-center mr-3">
                                    <span className="text-instollar-dark font-bold">3</span>
                                </div>
                                <span>Connect and grow your career</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
