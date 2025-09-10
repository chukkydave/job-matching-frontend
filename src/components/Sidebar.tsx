'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/lib/types';

interface SidebarProps {
    user: User;
}

export default function Sidebar({ user }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    const isActive = (path: string) => pathname === path;

    const adminNavItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
        { name: 'Jobs', href: '/admin/jobs', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6' },
        { name: 'Manage Matches', href: '/admin/matches', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { name: 'Users', href: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
        { name: 'Profile', href: '/admin/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    ];

    const talentNavItems = [
        { name: 'Dashboard', href: '/talent/dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
        { name: 'My Matches', href: '/talent/matches', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { name: 'Browse Jobs', href: '/talent/jobs', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6' },
        { name: 'Profile', href: '/talent/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    ];

    const navItems = user.role === 'Admin' ? adminNavItems : talentNavItems;

    return (
        <div className={`bg-instollar-dark text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-instollar-yellow rounded-lg flex items-center justify-center mr-3">
                                <span className="text-instollar-dark font-bold text-lg">I</span>
                            </div>
                            <h1 className="text-xl font-bold">Instollar Jobs</h1>
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* User Info */}
            {!isCollapsed && (
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-instollar-yellow rounded-full flex items-center justify-center mr-3">
                            <span className="text-instollar-dark font-bold text-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-300">{user.role}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={`flex items-center p-3 rounded-lg transition-colors ${isActive(item.href)
                                    ? 'bg-instollar-yellow text-instollar-dark'
                                    : 'hover:bg-gray-700'
                                    }`}
                            >
                                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                </svg>
                                {!isCollapsed && <span>{item.name}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-3 text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
}
