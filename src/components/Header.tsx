'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-instollar-dark text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-instollar-yellow">
                            Instollar Jobs
                        </h1>
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        <Link href="/" className="hover:text-instollar-yellow transition-colors">
                            Home
                        </Link>
                        <Link href="/jobs" className="hover:text-instollar-yellow transition-colors">
                            Jobs
                        </Link>
                        <Link href="/login" className="hover:text-instollar-yellow transition-colors">
                            Login
                        </Link>
                    </nav>

                    <button
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className="sr-only">Open menu</span>
                        <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                            <div className="w-full h-0.5 bg-white"></div>
                            <div className="w-full h-0.5 bg-white"></div>
                            <div className="w-full h-0.5 bg-white"></div>
                        </div>
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden pb-4">
                        <nav className="flex flex-col space-y-2">
                            <Link href="/" className="hover:text-instollar-yellow transition-colors">
                                Home
                            </Link>
                            <Link href="/jobs" className="hover:text-instollar-yellow transition-colors">
                                Jobs
                            </Link>
                            <Link href="/login" className="hover:text-instollar-yellow transition-colors">
                                Login
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
